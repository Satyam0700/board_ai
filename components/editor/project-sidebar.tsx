"use client";

import { X, Plus, Pencil, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Project, DialogType } from "@/hooks/use-project-actions";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDialog: (type: DialogType, project?: Project) => void;
  myProjects: Project[];
  sharedProjects: Project[];
}

function ProjectItem({ project, onOpenDialog }: { project: Project; onOpenDialog: (type: DialogType, project?: Project) => void }) {
  return (
    <div className="group flex items-center justify-between rounded-md px-2 py-2 text-sm text-copy-secondary hover:bg-elevated hover:text-copy-primary transition-colors cursor-pointer">
      <span className="truncate">{project.name}</span>
      {project.isOwner && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="p-1 rounded hover:bg-subtle text-copy-muted hover:text-copy-primary transition-colors focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onClick={(e) => { e.stopPropagation(); onOpenDialog("rename", project); }}
            aria-label="Rename project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-subtle text-copy-muted hover:text-destructive transition-colors focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            onClick={(e) => { e.stopPropagation(); onOpenDialog("delete", project); }}
            aria-label="Delete project"
          >
            <Trash className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose, onOpenDialog, myProjects, sharedProjects }: ProjectSidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-12 z-30 bg-black/50 transition-opacity sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Floating overlay — slides in from left, does not push content */}
      <aside
        aria-label="Projects sidebar"
        data-open={isOpen}
        className={[
          "fixed left-0 top-12 z-40 flex h-[calc(100vh-3rem)] w-72 flex-col",
          "bg-surface border-r border-surface-border",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-surface-border px-4">
          <span className="text-sm font-semibold text-copy-primary">
            Projects
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-elevated hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-1 flex-col overflow-hidden px-3 pt-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1 text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1 text-xs">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="my-projects"
              className="flex flex-1 flex-col overflow-y-auto"
            >
              {myProjects.length > 0 ? (
                <div className="flex flex-col gap-1 py-2">
                  {myProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} onOpenDialog={onOpenDialog} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-xs text-copy-faint">No projects yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="shared"
              className="flex flex-1 flex-col overflow-y-auto"
            >
              {sharedProjects.length > 0 ? (
                <div className="flex flex-col gap-1 py-2">
                  {sharedProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} onOpenDialog={onOpenDialog} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-xs text-copy-faint">No shared projects.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer — New Project button */}
        <div className="shrink-0 border-t border-surface-border p-3">
          <Button
            variant="outline"
            className="w-full gap-2 border-surface-border bg-elevated text-copy-secondary hover:bg-subtle hover:text-copy-primary"
            onClick={() => onOpenDialog("create")}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
