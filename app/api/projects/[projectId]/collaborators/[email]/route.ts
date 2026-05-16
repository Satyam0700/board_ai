import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string; email: string }> }
) {
  const { projectId, email } = await params;
  const access = await checkProjectAccess(projectId);

  // Enforce ownership server-side for remove
  if (!access.hasAccess || access.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const decodedEmail = decodeURIComponent(email);

    await prisma.projectCollaborator.delete({
      where: {
        projectId_email: {
          projectId,
          email: decodedEmail,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
