"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Project, DialogType, toSlug } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  activeDialog: DialogType;
  selectedProject: Project | null;
  onClose: () => void;
  createName: string;
  setCreateName: (name: string) => void;
  renameName: string;
  setRenameName: (name: string) => void;
  isLoading: boolean;
  handleCreate: () => void;
  handleRename: () => void;
  handleDelete: () => void;
}

export function ProjectDialogs({
  activeDialog,
  selectedProject,
  onClose,
  createName,
  setCreateName,
  renameName,
  setRenameName,
  isLoading,
  handleCreate,
  handleRename,
  handleDelete,
}: ProjectDialogsProps) {
  const createSlug = toSlug(createName);
  const isSlugValid = createName.trim().length > 0 && createSlug.length > 0;

  return (
    <>
      {/* Create Project */}
      <Dialog open={activeDialog === "create"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Create Project</DialogTitle>
            <DialogDescription>
              Start a new architecture workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
            className="text-white"
              autoFocus
              placeholder="Project Name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isSlugValid && handleCreate()}
              disabled={isLoading}
            />
            {createName && (
              <p className={`mt-2 text-xs ${createSlug ? "text-copy-muted" : "text-destructive"}`}>
                {createSlug
                  ? `Slug preview: /${createSlug}`
                  : "Name must contain at least one letter or number."}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!isSlugValid || isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project */}
      <Dialog open={activeDialog === "rename"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Rename Project</DialogTitle>
            <DialogDescription>
              Currently: {selectedProject?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
            className="text-white"
              autoFocus
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && renameName.trim() && renameName !== selectedProject?.name && handleRename()}
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button
              onClick={handleRename}
              disabled={!renameName.trim() || renameName === selectedProject?.name || isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project */}
      <Dialog open={activeDialog === "delete"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>&ldquo;{selectedProject?.name}&rdquo;</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
