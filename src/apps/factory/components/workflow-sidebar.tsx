import {
  Copy,
  Expand,
  FilePlus2,
  FolderOpen,
  GitBranchPlus,
  Maximize2,
  PackagePlus,
  Save,
  Trash2,
} from "lucide-react";
import type { DragEvent } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useFactoryStore,
  type FactoryWorkflowNodeType,
} from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const WORKFLOW_ADD_NODE_EVENT = "factory-workflow:add-node";
export const WORKFLOW_FIT_VIEW_EVENT = "factory-workflow:fit-view";

function requestWorkflowNode(type: FactoryWorkflowNodeType) {
  window.dispatchEvent(
    new CustomEvent(WORKFLOW_ADD_NODE_EVENT, {
      detail: { type },
    }),
  );
}

function requestWorkflowFitView() {
  window.dispatchEvent(new CustomEvent(WORKFLOW_FIT_VIEW_EVENT));
}

export function WorkflowSidebar() {
  const { t } = useTranslation();
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const workflows = useFactoryStore((state) => state.workflows);
  const activeWorkflowId = useFactoryStore((state) => state.activeWorkflowId);
  const workflowDraftDirty = useFactoryStore((state) => state.workflowDraftDirty);
  const selectedWorkflowElementId = useFactoryStore(
    (state) => state.selectedWorkflowElementId,
  );
  const createWorkflow = useFactoryStore((state) => state.createWorkflow);
  const openWorkflow = useFactoryStore((state) => state.openWorkflow);
  const saveActiveWorkflow = useFactoryStore((state) => state.saveActiveWorkflow);
  const deleteWorkflowElements = useFactoryStore(
    (state) => state.deleteWorkflowElements,
  );
  const duplicateSelectedWorkflowNode = useFactoryStore(
    (state) => state.duplicateSelectedWorkflowNode,
  );
  const clearActiveWorkflow = useFactoryStore((state) => state.clearActiveWorkflow);

  const activeWorkflow = useMemo(
    () => workflows.find((workflow) => workflow.id === activeWorkflowId),
    [activeWorkflowId, workflows],
  );

  function handleCreateWorkflow() {
    createWorkflow(newWorkflowName);
    setNewWorkflowName("");
  }

  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    type: FactoryWorkflowNodeType,
  ) {
    event.dataTransfer.setData("application/factory-workflow-node", type);
    event.dataTransfer.effectAllowed = "copy";
  }

  return (
    <section
      className="factory-workflow-sidebar"
      aria-label={t("factory.views.workflow.sidebarLabel")}
    >
      <div className="factory-workflow-sidebar-group">
        <div className="factory-workflow-sidebar-heading">
          <GitBranchPlus aria-hidden="true" />
          <span>{activeWorkflow?.name ?? t("factory.views.workflow.title")}</span>
          {workflowDraftDirty && (
            <span className="factory-workflow-dirty" aria-label={t("factory.views.workflow.unsaved")}>
              {t("factory.views.workflow.unsavedShort")}
            </span>
          )}
        </div>

        <Label htmlFor="factory-workflow-name">
          {t("factory.views.workflow.newWorkflowName")}
        </Label>
        <div className="factory-workflow-inline-control">
          <Input
            id="factory-workflow-name"
            value={newWorkflowName}
            onChange={(event) => setNewWorkflowName(event.target.value)}
            placeholder={t("factory.views.workflow.newWorkflowPlaceholder")}
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("factory.views.workflow.newWorkflow")}
            onClick={handleCreateWorkflow}
          >
            <FilePlus2 aria-hidden="true" />
          </Button>
        </div>

        <Label htmlFor="factory-workflow-open">
          {t("factory.views.workflow.openWorkflow")}
        </Label>
        <Select value={activeWorkflowId} onValueChange={openWorkflow}>
          <SelectTrigger id="factory-workflow-open" className="w-full">
            <FolderOpen aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workflows.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id}>
                {workflow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="button" variant="default" onClick={saveActiveWorkflow}>
          <Save aria-hidden="true" />
          {t("factory.views.workflow.saveWorkflow")}
        </Button>
      </div>

      <div className="factory-workflow-sidebar-group">
        <p className="factory-workflow-sidebar-label">
          {t("factory.views.workflow.nodeTools")}
        </p>
        <Button
          type="button"
          variant="outline"
          draggable
          onDragStart={(event) => handleDragStart(event, "container")}
          onClick={() => requestWorkflowNode("container")}
        >
          <Maximize2 aria-hidden="true" />
          {t("factory.views.workflow.addContainer")}
        </Button>
        <Button
          type="button"
          variant="outline"
          draggable
          onDragStart={(event) => handleDragStart(event, "item")}
          onClick={() => requestWorkflowNode("item")}
        >
          <PackagePlus aria-hidden="true" />
          {t("factory.views.workflow.addItem")}
        </Button>
      </div>

      <div className="factory-workflow-sidebar-group">
        <p className="factory-workflow-sidebar-label">
          {t("factory.views.workflow.canvasTools")}
        </p>
        <Button type="button" variant="outline" onClick={requestWorkflowFitView}>
          <Expand aria-hidden="true" />
          {t("factory.views.workflow.fitView")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!selectedWorkflowElementId}
          onClick={duplicateSelectedWorkflowNode}
        >
          <Copy aria-hidden="true" />
          {t("factory.views.workflow.duplicateSelected")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!selectedWorkflowElementId}
          onClick={() =>
            selectedWorkflowElementId &&
            deleteWorkflowElements([selectedWorkflowElementId])
          }
        >
          <Trash2 aria-hidden="true" />
          {t("factory.views.workflow.deleteSelected")}
        </Button>
        <Button type="button" variant="destructive" onClick={clearActiveWorkflow}>
          <Trash2 aria-hidden="true" />
          {t("factory.views.workflow.clearCanvas")}
        </Button>
      </div>
    </section>
  );
}
