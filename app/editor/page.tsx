"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((v) => !v)}
      />

      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Canvas placeholder — replaced when canvas feature is built */}
      <main className="flex flex-1 flex-col items-center justify-center pt-12">
        <p className="text-sm text-copy-faint select-none">
          Open a project to start designing.
        </p>
      </main>
    </div>
  );
}
