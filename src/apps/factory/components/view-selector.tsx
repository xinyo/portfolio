import type { FactoryColumnView } from "@/apps/factory/store";
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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    Bookmark,
    BookmarkPlus,
    Check,
    ChevronsUpDown,
    Pencil,
    Trash2,
} from "lucide-react";
import { useState } from "react";

interface ViewSelectorProps {
  views: FactoryColumnView[];
  activeViewId: string | null;
  isModified: boolean;
  onSelectView: (id: string) => void;
  onSaveNewView: (name: string) => void;
  onUpdateView: (id: string) => void;
  onDeleteView: (id: string) => void;
}

export function ViewSelector({
  views,
  activeViewId,
  isModified,
  onSelectView,
  onSaveNewView,
  onUpdateView,
  onDeleteView,
}: ViewSelectorProps) {
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FactoryColumnView | null>(
    null,
  );
  const [newViewName, setNewViewName] = useState("");

  const activeView = views.find((v) => v.id === activeViewId) ?? null;
  const triggerLabel = activeView ? activeView.name : "Custom view";

  const handleSave = () => {
    const name = newViewName.trim();
    if (!name) return;
    onSaveNewView(name);
    setNewViewName("");
    setSaveOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[220px] justify-between font-normal"
          >
            <span className="flex items-center gap-2 truncate">
              <Bookmark
                className={cn(
                  "h-4 w-4 shrink-0",
                  activeView
                    ? "fill-primary text-primary"
                    : "text-muted-foreground",
                )}
              />
              <span className="truncate">{triggerLabel}</span>
              {isModified && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive"
                  title="Unsaved changes"
                />
              )}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search views..." />
            <CommandList>
              <CommandEmpty>No views found.</CommandEmpty>
              <CommandGroup heading="Saved views">
                {views.map((view) => (
                  <CommandItem
                    key={view.id}
                    value={view.name}
                    onSelect={() => {
                      onSelectView(view.id);
                      setOpen(false);
                    }}
                    className="group justify-between"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          view.id === activeViewId && !isModified
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="truncate">{view.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(view);
                      }}
                      className="ml-2 shrink-0 rounded p-1 opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      aria-label={`Delete ${view.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup>
                {isModified && activeView && (
                  <CommandItem
                    onSelect={() => {
                      onUpdateView(activeView.id);
                      setOpen(false);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Update &quot;{activeView.name}&quot;
                  </CommandItem>
                )}
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setSaveOpen(true);
                  }}
                >
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Save current columns as new view...
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Save view</DialogTitle>
            <DialogDescription>
              Save the current column selection so you can come back to it
              later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="view-name">View name</Label>
            <Input
              id="view-name"
              placeholder="e.g. Financial overview"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!newViewName.trim()}>
              Save view
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{deleteTarget?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the saved view. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  onDeleteView(deleteTarget.id);
                }
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
