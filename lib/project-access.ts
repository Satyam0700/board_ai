import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type Identity = {
  userId: string;
  email: string | null;
};

export async function getIdentity(): Promise<Identity | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress || null;

  return { userId, email };
}

export type AccessResult =
  | { hasAccess: false; reason: "unauthenticated" | "not_found" | "forbidden" }
  | { hasAccess: true; project: any; role: "owner" | "collaborator" };

export async function checkProjectAccess(projectId: string): Promise<AccessResult> {
  const identity = await getIdentity();
  if (!identity) {
    return { hasAccess: false, reason: "unauthenticated" };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  });

  if (!project) {
    return { hasAccess: false, reason: "not_found" };
  }

  if (project.ownerId === identity.userId) {
    return { hasAccess: true, project, role: "owner" };
  }

  if (identity.email) {
    const isCollaborator = project.collaborators.some(
      (c) => c.email === identity.email
    );
    if (isCollaborator) {
      return { hasAccess: true, project, role: "collaborator" };
    }
  }

  return { hasAccess: false, reason: "forbidden" };
}
