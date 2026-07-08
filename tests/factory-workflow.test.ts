import { afterEach, describe, expect, it } from "vitest";

import {
  createWorkflowNode,
  defaultWorkflow,
  getAutoGrownWorkflowNodes,
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
});
