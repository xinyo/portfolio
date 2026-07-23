import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
  type OnNodeDrag,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Check, Pencil } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from "react";
import { useTranslation } from "react-i18next";

import {
  WORKFLOW_ADD_NODE_EVENT,
  WORKFLOW_FIT_VIEW_EVENT,
} from "@/apps/factory/components/workflow-sidebar";
import {
  getWorkflowNodeParent,
  useFactoryStore,
  type FactoryWorkflowNode,
  type FactoryWorkflowNodeData,
  type FactoryWorkflowNodeType,
} from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WorkflowView() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
}

function WorkflowCanvas() {
  const { t } = useTranslation();
  const reactFlow = useReactFlow();
  const workflows = useFactoryStore((state) => state.workflows);
  const activeWorkflowId = useFactoryStore((state) => state.activeWorkflowId);
  const setWorkflowNodes = useFactoryStore((state) => state.setWorkflowNodes);
  const setWorkflowEdges = useFactoryStore((state) => state.setWorkflowEdges);
  const addWorkflowNode = useFactoryStore((state) => state.addWorkflowNode);
  const setSelectedWorkflowElementId = useFactoryStore(
    (state) => state.setSelectedWorkflowElementId,
  );

  const workflow = useMemo(
    () => workflows.find((item) => item.id === activeWorkflowId),
    [activeWorkflowId, workflows],
  );
  const nodes = useMemo(() => workflow?.nodes ?? [], [workflow?.nodes]);
  const edges = useMemo(() => workflow?.edges ?? [], [workflow?.edges]);

  const addNodeAtPosition = useCallback(
    (type: FactoryWorkflowNodeType, position: XYPosition) => {
      addWorkflowNode(type, position);
    },
    [addWorkflowNode],
  );

  const addNodeAtViewportCenter = useCallback(
    (type: FactoryWorkflowNodeType) => {
      const root = document.querySelector(".factory-workflow-canvas");
      const bounds = root?.getBoundingClientRect();
      const position = reactFlow.screenToFlowPosition({
        x: bounds ? bounds.left + bounds.width / 2 : window.innerWidth / 2,
        y: bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2,
      });

      addNodeAtPosition(type, position);
    },
    [addNodeAtPosition, reactFlow],
  );

  useEffect(() => {
    function handleAddNode(event: Event) {
      const customEvent = event as CustomEvent<{
        type: FactoryWorkflowNodeType;
      }>;

      addNodeAtViewportCenter(customEvent.detail.type);
    }

    function handleFitView() {
      reactFlow.fitView({ padding: 0.2, duration: 160 });
    }

    window.addEventListener(WORKFLOW_ADD_NODE_EVENT, handleAddNode);
    window.addEventListener(WORKFLOW_FIT_VIEW_EVENT, handleFitView);

    return () => {
      window.removeEventListener(WORKFLOW_ADD_NODE_EVENT, handleAddNode);
      window.removeEventListener(WORKFLOW_FIT_VIEW_EVENT, handleFitView);
    };
  }, [addNodeAtViewportCenter, reactFlow]);

  const handleNodesChange = useCallback(
    (changes: NodeChange<FactoryWorkflowNode>[]) => {
      setWorkflowNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setWorkflowNodes],
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setWorkflowEdges(applyEdgeChanges(changes, edges));
    },
    [edges, setWorkflowEdges],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setWorkflowEdges(
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: false,
          },
          edges,
        ),
      );
    },
    [edges, setWorkflowEdges],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/factory-workflow-node",
      ) as FactoryWorkflowNodeType;

      if (type !== "container" && type !== "item") {
        return;
      }

      addNodeAtPosition(
        type,
        reactFlow.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
      );
    },
    [addNodeAtPosition, reactFlow],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleNodeDragStop = useCallback<OnNodeDrag<FactoryWorkflowNode>>(
    (_event, node) => {
      if (node.data.nodeType !== "item") {
        return;
      }

      const parent = getWorkflowNodeParent(
        nodes.filter((item) => item.id !== node.id),
        node.position,
      );

      if (!parent || parent.id === node.parentId) {
        setWorkflowNodes(nodes);
        return;
      }

      setWorkflowNodes(
        nodes.map((item) =>
          item.id === node.id
            ? {
                ...item,
                parentId: parent.id,
                position: {
                  x: Math.max(16, node.position.x - parent.position.x),
                  y: Math.max(48, node.position.y - parent.position.y),
                },
              }
            : item,
        ),
      );
    },
    [nodes, setWorkflowNodes],
  );

  return (
    <section
      className="factory-workflow-view"
      aria-label={t("factory.views.workflow.canvasLabel")}
    >
      <ReactFlow
        className="factory-workflow-canvas"
        nodes={nodes}
        edges={edges}
        nodeTypes={workflowNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={(_event, node) => setSelectedWorkflowElementId(node.id)}
        onEdgeClick={(_event, edge) => setSelectedWorkflowElementId(edge.id)}
        onPaneClick={() => setSelectedWorkflowElementId(null)}
        deleteKeyCode={["Backspace", "Delete"]}
        selectionKeyCode="Shift"
        multiSelectionKeyCode="Meta"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.4}
          color="var(--border)"
        />
        <Controls position="bottom-right" />
        <MiniMap
          pannable
          zoomable
          className="factory-workflow-minimap"
          nodeColor={(node) =>
            (node.data as FactoryWorkflowNodeData).nodeType === "container"
              ? "var(--primary)"
              : "var(--secondary)"
          }
        />
      </ReactFlow>
    </section>
  );
}

const WorkflowNode = memo(function WorkflowNode({
  id,
  data,
  selected,
}: NodeProps<FactoryWorkflowNode>) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(data.label);
  const updateWorkflowNodeLabel = useFactoryStore(
    (state) => state.updateWorkflowNodeLabel,
  );

  useEffect(() => {
    setDraftLabel(data.label);
  }, [data.label]);

  function commitLabel() {
    const label = draftLabel.trim();
    updateWorkflowNodeLabel(id, label || data.label);
    setIsEditing(false);
  }

  return (
    <div
      className="factory-workflow-node"
      data-node-type={data.nodeType}
      data-selected={selected ? "true" : "false"}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Left} />
      {isEditing ? (
        <div className="factory-workflow-node-editor">
          <Input
            value={draftLabel}
            onChange={(event) => setDraftLabel(event.target.value)}
            onBlur={commitLabel}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitLabel();
              }
              if (event.key === "Escape") {
                setDraftLabel(data.label);
                setIsEditing(false);
              }
            }}
            aria-label={t("factory.views.workflow.nodeLabel")}
            autoFocus
          />
          <Button
            type="button"
            size="icon-sm"
            aria-label={t("factory.views.workflow.saveLabel")}
            onClick={commitLabel}
          >
            <Check aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="factory-workflow-node-label">
          <span>{data.label}</span>
          <Pencil aria-hidden="true" />
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

const workflowNodeTypes: NodeTypes = {
  container: WorkflowNode,
  item: WorkflowNode,
};
