import {
  Check,
  Copy,
  EllipsisVertical,
  Expand,
  FilePlus2,
  FolderOpen,
  Maximize2,
  PackagePlus,
  Pencil,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  const [newWorkflowOpen, setNewWorkflowOpen] = useState(false);
  const [editWorkflowOpen, setEditWorkflowOpen] = useState(false);
  const [editWorkflowName, setEditWorkflowName] = useState("");
  const [deleteWorkflowTargetId, setDeleteWorkflowTargetId] = useState<
    string | null
  >(null);
  const workflows = useFactoryStore((state) => state.workflows);
  const activeWorkflowId = useFactoryStore((state) => state.activeWorkflowId);
  const workflowDraftDirty = useFactoryStore(
    (state) => state.workflowDraftDirty,
  );
  const selectedWorkflowElementId = useFactoryStore(
    (state) => state.selectedWorkflowElementId,
  );
  const createWorkflow = useFactoryStore((state) => state.createWorkflow);
  const openWorkflow = useFactoryStore((state) => state.openWorkflow);
  const saveActiveWorkflow = useFactoryStore(
    (state) => state.saveActiveWorkflow,
  );
  const renameWorkflow = useFactoryStore((state) => state.renameWorkflow);
  const deleteWorkflow = useFactoryStore((state) => state.deleteWorkflow);
  const deleteWorkflowElements = useFactoryStore(
    (state) => state.deleteWorkflowElements,
  );
  const duplicateSelectedWorkflowNode = useFactoryStore(
    (state) => state.duplicateSelectedWorkflowNode,
  );
  const clearActiveWorkflow = useFactoryStore(
    (state) => state.clearActiveWorkflow,
  );

  const activeWorkflow = useMemo(
    () => workflows.find((workflow) => workflow.id === activeWorkflowId),
    [activeWorkflowId, workflows],
  );

  function handleCreateWorkflow() {
    createWorkflow(newWorkflowName);
    setNewWorkflowName("");
    setNewWorkflowOpen(false);
  }

  function handleRenameWorkflow() {
    if (activeWorkflowId && editWorkflowName.trim()) {
      renameWorkflow(activeWorkflowId, editWorkflowName);
      setEditWorkflowOpen(false);
    }
  }

  function handleDeleteWorkflow() {
    if (deleteWorkflowTargetId) {
      deleteWorkflow(deleteWorkflowTargetId);
      setDeleteWorkflowTargetId(null);
    }
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
        <div className="factory-workflow-inline-control">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label={t("factory.views.workflow.newWorkflow")}
              >
                <EllipsisVertical aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuItem onClick={() => setNewWorkflowOpen(true)}>
                <FilePlus2 aria-hidden="true" />
                {t("factory.views.workflow.newWorkflow")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditWorkflowName(activeWorkflow?.name ?? "");
                  setEditWorkflowOpen(true);
                }}
              >
                <Pencil aria-hidden="true" />
                {t("factory.views.workflow.editWorkflow")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={workflows.length <= 1}
                onClick={() => setDeleteWorkflowTargetId(activeWorkflowId)}
              >
                <Trash2 aria-hidden="true" />
                {t("factory.views.workflow.deleteWorkflow")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={newWorkflowOpen} onOpenChange={setNewWorkflowOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("factory.views.workflow.newWorkflowName")}
                </DialogTitle>
              </DialogHeader>
              <div className="factory-workflow-inline-control">
                <Input
                  id="factory-workflow-name"
                  value={newWorkflowName}
                  onChange={(event) => setNewWorkflowName(event.target.value)}
                  placeholder={t(
                    "factory.views.workflow.newWorkflowPlaceholder",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("factory.views.workflow.newWorkflow")}
                  onClick={handleCreateWorkflow}
                >
                  <Check aria-hidden="true" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editWorkflowOpen} onOpenChange={setEditWorkflowOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("factory.views.workflow.editWorkflow")}
                </DialogTitle>
              </DialogHeader>
              <div className="factory-workflow-inline-control">
                <Input
                  id="factory-workflow-rename"
                  value={editWorkflowName}
                  onChange={(event) => setEditWorkflowName(event.target.value)}
                  placeholder={t(
                    "factory.views.workflow.newWorkflowPlaceholder",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t("factory.views.workflow.editWorkflow")}
                  onClick={handleRenameWorkflow}
                >
                  <Check aria-hidden="true" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={!!deleteWorkflowTargetId}
            onOpenChange={(o) => !o && setDeleteWorkflowTargetId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("factory.views.workflow.deleteWorkflowTitle", {
                    name: activeWorkflow?.name ?? "",
                  })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("factory.views.workflow.deleteWorkflowDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("factory.views.workflow.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteWorkflow}
                >
                  {t("factory.views.workflow.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Button
          type="button"
          variant="default"
          onClick={saveActiveWorkflow}
          disabled={!workflowDraftDirty}
        >
          <Save aria-hidden="true" />
          {workflowDraftDirty
            ? t("factory.views.workflow.unsavedShort")
            : t("factory.views.workflow.saveWorkflow")}
        </Button>
      </div>

      <div className="factory-workflow-sidebar-group">
        <p className="factory-nav-section-label">
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
        <p className="factory-nav-section-label">
          {t("factory.views.workflow.canvasTools")}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={requestWorkflowFitView}
        >
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
        <Button
          type="button"
          variant="destructive"
          onClick={clearActiveWorkflow}
        >
          <Trash2 aria-hidden="true" />
          {t("factory.views.workflow.clearCanvas")}
        </Button>
      </div>
    </section>
  );
}
