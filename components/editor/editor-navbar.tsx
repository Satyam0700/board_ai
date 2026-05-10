"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
}: EditorNavbarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex h-12 items-center bg-surface border-b border-surface-border px-3">
      {/* Left section — sidebar toggle */}
      <div className="flex flex-1 items-center">
        <button
          type="button"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Center section */}
      <div className="flex items-center" />

      {/* Right section — profile settings and logout */}
      <div className="flex flex-1 items-center justify-end px-2">
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8"
            }
          }}
        />
      </div>
    </header>
  );
}
