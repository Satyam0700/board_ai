import { useState, useCallback } from "react";

export type DialogType = "create" | "rename" | "delete" | null;

export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
}

/** Generate a URL-safe slug from a project name. */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const INITIAL_MY_PROJECTS: Project[] = [
  { id: "1", name: "Alpha App", slug: "alpha-app", isOwner: true },
  { id: "2", name: "Beta Dashboard", slug: "beta-dashboard", isOwner: true },
];

const INITIAL_SHARED_PROJECTS: Project[] = [
  { id: "3", name: "Gamma API", slug: "gamma-api", isOwner: false },
];

let nextId = 4;

export function useProjectDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Project lists (mock state — lives in memory, resets on refresh)
  const [myProjects, setMyProjects] = useState<Project[]>(INITIAL_MY_PROJECTS);
  const [sharedProjects] = useState<Project[]>(INITIAL_SHARED_PROJECTS);

  // Form State
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");

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
    }
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    // Small delay so the exit animation doesn't suddenly lose the text.
    setTimeout(() => {
      setSelectedProject(null);
    }, 200);
  }, []);

  /** Create a new project and add it to myProjects. */
  const handleCreate = useCallback(() => {
    const slug = toSlug(createName);
    if (!createName.trim() || !slug) return;

    setIsLoading(true);
    setTimeout(() => {
      const newProject: Project = {
        id: String(nextId++),
        name: createName.trim(),
        slug,
        isOwner: true,
      };
      setMyProjects((prev) => [...prev, newProject]);
      setIsLoading(false);
      setActiveDialog(null);
      setCreateName("");
    }, 400);
  }, [createName]);

  /** Rename the selected project in myProjects. */
  const handleRename = useCallback(() => {
    if (!selectedProject || !renameName.trim() || renameName === selectedProject.name) return;

    setIsLoading(true);
    setTimeout(() => {
      setMyProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? { ...p, name: renameName.trim(), slug: toSlug(renameName) }
            : p
        )
      );
      setIsLoading(false);
      setActiveDialog(null);
      setTimeout(() => setSelectedProject(null), 200);
    }, 400);
  }, [selectedProject, renameName]);

  /** Delete the selected project from myProjects. */
  const handleDelete = useCallback(() => {
    if (!selectedProject) return;

    setIsLoading(true);
    setTimeout(() => {
      setMyProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setIsLoading(false);
      setActiveDialog(null);
      setTimeout(() => setSelectedProject(null), 200);
    }, 400);
  }, [selectedProject]);

  return {
    activeDialog,
    selectedProject,
    openDialog,
    closeDialog,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    isLoading,
    myProjects,
    sharedProjects,
    handleCreate,
    handleRename,
    handleDelete,
  };
}
