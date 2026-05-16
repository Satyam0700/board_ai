import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceClient } from "./workspace-client";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  
  // 1. Access Check
  const access = await checkProjectAccess(roomId);

  if (!access.hasAccess) {
    if (access.reason === "unauthenticated") {
      redirect("/sign-in");
    }
    return <AccessDenied />;
  }

  const activeProject = access.project;

  // 2. Fetch Projects for Sidebar
  const { userId } = await auth();
  const user = await currentUser();

  // Fetch owned projects
  const ownedDbProjects = await prisma.project.findMany({
    where: { ownerId: userId! },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, ownerId: true },
  });

  const myProjects = ownedDbProjects.map((p) => ({
    id: p.id,
    name: p.name,
    isOwner: true,
  }));

  // Fetch shared projects
  const primaryEmail = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  let sharedProjects: { id: string; name: string; isOwner: boolean }[] = [];

  if (primaryEmail) {
    const sharedDbProjects = await prisma.project.findMany({
      where: {
        collaborators: {
          some: {
            email: primaryEmail,
          },
        },
      },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    });

    sharedProjects = sharedDbProjects.map((p) => ({
      id: p.id,
      name: p.name,
      isOwner: false,
    }));
  }

  return (
    <WorkspaceClient
      myProjects={myProjects}
      sharedProjects={sharedProjects}
      activeProject={{
        id: activeProject.id,
        name: activeProject.name,
        isOwner: access.role === "owner",
      }}
    />
  );
}
