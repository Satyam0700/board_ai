import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export type DialogType = "create" | "rename" | "delete" | null;

export interface Project {
  id: string;
  name: string;
  isOwner: boolean;
}

/** Generate a URL-safe slug from a project name. */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateShortId() {
  return Math.random().toString(36).substring(2, 6);
}

export function useProjectActions() {
  const router = useRouter();

  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form State
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [shortId, setShortId] = useState("");

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = useCallback((type: DialogType, project?: Project) => {
    setActiveDialog(type);
    setIsLoading(false);
    if (project) {
      setSelectedProject(project);
      if (type === "rename") {
        setRenameName(project.name);
      }
    } else if (type === "create") {
      setSelectedProject(null);
      setCreateName("");
      setShortId(generateShortId());
    }
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    // Small delay so the exit animation doesn't suddenly lose the text.
    setTimeout(() => {
      setSelectedProject(null);
      setShortId("");
    }, 200);
  }, []);

  const handleCreate = useCallback(async () => {
    const baseSlug = toSlug(createName);
    if (!createName.trim() || !baseSlug || !shortId) return;

    setIsLoading(true);
    try {
      const roomId = `${baseSlug}-${shortId}`;
      
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim(), id: roomId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();
      
      setActiveDialog(null);
      setCreateName("");
      // Navigate to new workspace
      router.push(`/editor/${newProject.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [createName, shortId, router]);

  const handleRename = useCallback(async () => {
    if (!selectedProject || !renameName.trim() || renameName === selectedProject.name) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename project");
      }

      setActiveDialog(null);
      setTimeout(() => setSelectedProject(null), 200);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, renameName, router]);

  const handleDelete = useCallback(async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setActiveDialog(null);
      setTimeout(() => setSelectedProject(null), 200);
      
      if (window.location.pathname.includes(selectedProject.id)) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, router]);

  return {
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
  };
}
