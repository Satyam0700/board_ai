import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditorClient } from "./editor-client";

export default async function EditorPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Fetch owned projects
  const ownedDbProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, ownerId: true },
  });

  const myProjects = ownedDbProjects.map((p) => ({
    id: p.id,
    name: p.name,
    isOwner: true,
  }));

  // Fetch shared projects
  const primaryEmail = user.emailAddresses.find(
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
    <EditorClient 
      myProjects={myProjects} 
      sharedProjects={sharedProjects} 
    />
  );
}
