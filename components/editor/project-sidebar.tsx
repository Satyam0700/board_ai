"use client";

import { X, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
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
              className="flex flex-1 items-center justify-center"
            >
              <p className="text-xs text-copy-faint">No projects yet.</p>
            </TabsContent>

            <TabsContent
              value="shared"
              className="flex flex-1 items-center justify-center"
            >
              <p className="text-xs text-copy-faint">No shared projects.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer — New Project button */}
        <div className="shrink-0 border-t border-surface-border p-3">
          <Button
            variant="outline"
            className="w-full gap-2 border-surface-border bg-elevated text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
