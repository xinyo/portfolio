import { afterEach, describe, expect, it } from "vitest";

import {
  createWorkflowNode,
  defaultWorkflow,
  getAutoGrownWorkflowNodes,
  getWorkflowNodeAddTarget,
  reparentWorkflowItem,
  useFactoryStore,
  type FactoryWorkflow,
} from "@/apps/factory/store";

function cloneWorkflow(workflow: FactoryWorkflow): FactoryWorkflow {
  return {
    ...workflow,
    nodes: workflow.nodes.map((node) => ({
      ...node,
      data: { ...node.data },
      position: { ...node.position },
      style: { ...node.style },
    })),
    edges: workflow.edges.map((edge) => ({ ...edge })),
  };
}

function resetWorkflowStore() {
  useFactoryStore.setState({
    workflows: [cloneWorkflow(defaultWorkflow)],
    activeWorkflowId: defaultWorkflow.id,
    workflowDraftDirty: false,
    selectedWorkflowElementId: null,
  });
}

describe("factory workflow store", () => {
  afterEach(() => {
    resetWorkflowStore();
  });

  it("creates, opens, and saves in-memory workflows", () => {
    const createdId = useFactoryStore
      .getState()
      .createWorkflow("Install process");

    expect(useFactoryStore.getState().activeWorkflowId).toBe(createdId);
    expect(
      useFactoryStore
        .getState()
        .workflows.find((workflow) => workflow.id === createdId),
    ).toMatchObject({
      name: "Install process",
      nodes: [],
      edges: [],
      savedAt: null,
    });

    useFactoryStore.getState().openWorkflow(defaultWorkflow.id);
    expect(useFactoryStore.getState().activeWorkflowId).toBe(defaultWorkflow.id);

    useFactoryStore.getState().openWorkflow(createdId);
    useFactoryStore.getState().saveActiveWorkflow();

    expect(
      useFactoryStore
        .getState()
        .workflows.find((workflow) => workflow.id === createdId)?.savedAt,
    ).toEqual(expect.any(String));
    expect(useFactoryStore.getState().workflowDraftDirty).toBe(false);
  });

  it("adds container and item nodes with default labels", () => {
    const store = useFactoryStore.getState();
    const workflowId = store.createWorkflow("Node test");
    const containerId = useFactoryStore
      .getState()
      .addWorkflowNode("container", { x: 120, y: 160 });
    const itemId = useFactoryStore
      .getState()
      .addWorkflowNode("item", { x: 180, y: 220 });
    const workflow = useFactoryStore
      .getState()
      .workflows.find((item) => item.id === workflowId);

    expect(workflow?.nodes.find((node) => node.id === containerId)).toMatchObject({
      data: { label: "Container", nodeType: "container" },
      position: { x: 120, y: 160 },
    });
    expect(workflow?.nodes.find((node) => node.id === itemId)).toMatchObject({
      data: { label: "Item", nodeType: "item" },
      parentId: containerId,
    });
    expect(useFactoryStore.getState().selectedWorkflowElementId).toBe(itemId);
  });

  it("updates workflow node labels inline", () => {
    const nodeId = useFactoryStore
      .getState()
      .addWorkflowNode("container", { x: 0, y: 0 });

    useFactoryStore.getState().updateWorkflowNodeLabel(nodeId, "Shipping");

    expect(
      useFactoryStore
        .getState()
        .workflows.find((workflow) => workflow.id === defaultWorkflow.id)
        ?.nodes.find((node) => node.id === nodeId)?.data.label,
    ).toBe("Shipping");
  });

  it("adds and deletes workflow edges and connected nodes", () => {
    const firstId = useFactoryStore
      .getState()
      .addWorkflowNode("item", { x: 0, y: 0 });
    const secondId = useFactoryStore
      .getState()
      .addWorkflowNode("item", { x: 220, y: 0 });

    useFactoryStore.getState().addWorkflowEdge({
      source: firstId,
      target: secondId,
    });
    expect(
      useFactoryStore.getState().workflows[0]?.edges[0],
    ).toMatchObject({
      source: firstId,
      target: secondId,
    });

    useFactoryStore.getState().deleteWorkflowElements([firstId]);

    const workflow = useFactoryStore.getState().workflows[0];
    expect(workflow?.nodes.some((node) => node.id === firstId)).toBe(false);
    expect(workflow?.edges).toEqual([]);
  });

  it("auto-grows containers when child items exceed their bounds", () => {
    const container = createWorkflowNode(
      "container",
      { x: 0, y: 0 },
      "Container",
      { id: "container-test" },
    );
    const item = createWorkflowNode("item", { x: 300, y: 210 }, "Item", {
      id: "item-test",
      parentId: "container-test",
    });

    const [grownContainer] = getAutoGrownWorkflowNodes([container, item]);

    expect(grownContainer?.style?.width).toBeGreaterThan(300);
    expect(grownContainer?.style?.height).toBeGreaterThan(210);
  });

  it("targets the selected container when adding an item from the toolbar", () => {
    const firstContainer = createWorkflowNode(
      "container",
      { x: 40, y: 60 },
      "First",
      { id: "container-first" },
    );
    const secondContainer = createWorkflowNode(
      "container",
      { x: 440, y: 60 },
      "Second",
      { id: "container-second" },
    );

    expect(
      getWorkflowNodeAddTarget(
        [firstContainer, secondContainer],
        "item",
        { x: 900, y: 700 },
        firstContainer.id,
      ),
    ).toMatchObject({
      parentId: firstContainer.id,
      position: { x: 56, y: 108 },
    });
  });

  it("reparents a dragged item using its absolute canvas position", () => {
    const firstContainer = createWorkflowNode(
      "container",
      { x: 100, y: 100 },
      "First",
      { id: "container-first" },
    );
    const item = createWorkflowNode("item", { x: 24, y: 64 }, "Item", {
      id: "item-dragged",
      parentId: firstContainer.id,
    });
    const secondContainer = createWorkflowNode(
      "container",
      { x: 500, y: 100 },
      "Second",
      { id: "container-second" },
    );

    const movedNodes = reparentWorkflowItem(
      [firstContainer, item, secondContainer],
      {
        ...item,
        // React Flow reports a child drag position relative to its old parent.
        position: { x: 424, y: 64 },
      },
    );
    const movedItem = movedNodes.find((node) => node.id === item.id);

    expect(movedItem).toMatchObject({
      parentId: secondContainer.id,
      position: { x: 24, y: 64 },
    });
    expect(movedNodes.indexOf(secondContainer)).toBeLessThan(
      movedNodes.findIndex((node) => node.id === item.id),
    );
  });
});
