import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const access = await checkProjectAccess(projectId);

  if (!access.hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    const emails = collaborators.map((c) => c.email);
    
    // Enrich with Clerk user data
    let enrichedCollaborators = collaborators.map((c) => ({
      email: c.email,
      name: null as string | null,
      avatar: null as string | null,
    }));

    if (emails.length > 0) {
      const client = await clerkClient();
      const clerkUsers = await client.users.getUserList({ emailAddress: emails });
      
      enrichedCollaborators = collaborators.map((c) => {
        const user = clerkUsers.data.find(
          (u) => u.emailAddresses.some((e) => e.emailAddress === c.email)
        );
        return {
          email: c.email,
          name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || null : null,
          avatar: user ? user.imageUrl : null,
        };
      });
    }

    return NextResponse.json(enrichedCollaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const access = await checkProjectAccess(projectId);

  // Enforce ownership server-side for invite
  if (!access.hasAccess || access.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const collab = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email,
      },
    });

    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({ emailAddress: [email] });
    const user = clerkUsers.data[0];

    return NextResponse.json({
      email: collab.email,
      name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || null : null,
      avatar: user ? user.imageUrl : null,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Already a collaborator" }, { status: 400 });
    }
    console.error("Error inviting collaborator:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
