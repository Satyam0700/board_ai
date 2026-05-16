"use client";

import { useState } from "react";
import { Share, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";

interface Project {
  id: string;
  name: string;
  isOwner: boolean;
}

interface WorkspaceClientProps {
  myProjects: Project[];
  sharedProjects: Project[];
  activeProject: {
    id: string;
    name: string;
    isOwner: boolean;
  };
}

export function WorkspaceClient({ myProjects, sharedProjects, activeProject }: WorkspaceClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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

  const rightActions = (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 gap-2 text-copy-secondary hover:text-copy-primary"
        onClick={() => setShareDialogOpen(true)}
      >
        <Share className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <button
        type="button"
        onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          aiSidebarOpen 
            ? "bg-brand/10 text-brand hover:bg-brand/20" 
            : "text-copy-secondary hover:bg-elevated hover:text-copy-primary"
        }`}
      >
        <MessageSquare className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
        projectName={activeProject.name}
        rightActions={rightActions}
      />

      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenDialog={openDialog}
        myProjects={myProjects}
        sharedProjects={sharedProjects}
        activeProjectId={activeProject.id}
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

      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        projectId={activeProject.id}
        isOwner={activeProject.isOwner}
      />

      <div className="flex flex-1 pt-12">
        <main className="flex-1 flex flex-col bg-[#0a0a0a]">
          <CanvasWrapper roomId={activeProject.id} />
        </main>

        {/* AI Sidebar placeholder */}
        {aiSidebarOpen && (
          <aside className="w-80 border-l border-surface-border bg-surface flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-copy-primary">
              AI Chat
            </h3>
            <p className="text-xs text-copy-faint mt-1">
              Coming soon...
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
