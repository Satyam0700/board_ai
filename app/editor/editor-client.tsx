"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import { ProjectDialogs } from "@/components/editor/project-dialogs";

interface Project {
  id: string;
  name: string;
  isOwner: boolean;
}

interface EditorClientProps {
  myProjects: Project[];
  sharedProjects: Project[];
}

export function EditorClient({ myProjects: initialMyProjects, sharedProjects: initialSharedProjects }: EditorClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    activeDialog,
    selectedProject,
    openDialog,
    closeDialog,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    shortId,
    isLoading,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
      />

      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenDialog={openDialog}
        myProjects={initialMyProjects}
        sharedProjects={initialSharedProjects}
      />

      <ProjectDialogs
        activeDialog={activeDialog}
        selectedProject={selectedProject}
        onClose={closeDialog}
        createName={createName}
        setCreateName={setCreateName}
        renameName={renameName}
        setRenameName={setRenameName}
        shortId={shortId}
        isLoading={isLoading}
        handleCreate={handleCreate}
        handleRename={handleRename}
        handleDelete={handleDelete}
      />

      {/* Canvas placeholder — replaced when canvas feature is built */}
      <main className="flex flex-1 flex-col items-center justify-center pt-12">
        <h1 className="text-xl font-semibold text-copy-primary text-center px-4">
          Create a project or open an existing one
        </h1>
        <p className="mt-2 text-sm text-copy-secondary text-center px-4">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button
          className="mt-6 gap-2"
          onClick={() => openDialog("create")}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>
    </div>
  );
}
