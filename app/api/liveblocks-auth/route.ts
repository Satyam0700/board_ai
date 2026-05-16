import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { checkProjectAccess } from "@/lib/project-access";
import { liveblocks, getCursorColor } from "@/lib/liveblocks";

/**
 * POST /api/liveblocks-auth
 *
 * Issues a Liveblocks session token for a specific project room.
 * Uses the project ID as the Liveblocks room ID.
 *
 * Requirements:
 * 1. Clerk authentication
 * 2. Project access verification via checkProjectAccess
 * 3. Room creation if needed (getOrCreateRoom)
 * 4. Session token with user name, avatar, and cursor color
 */
export async function POST(req: NextRequest) {
  // 1. Require Clerk authentication
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the room (project) ID from the request body
  const body = await req.json();
  const roomId = body?.room as string | undefined;

  if (!roomId) {
    return NextResponse.json(
      { error: "Missing room in request body" },
      { status: 400 }
    );
  }

  // 2. Verify project access using the existing access helper
  const access = await checkProjectAccess(roomId);

  if (!access.hasAccess) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // 3. Ensure the Liveblocks room exists (create only if needed)
  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
  });

  // 4. Prepare a session with user info and grant room access
  const userName =
    user.fullName ||
    user.firstName ||
    user.username ||
    "Anonymous";

  const avatarUrl = user.imageUrl || "";
  const cursorColor = getCursorColor(user.id);

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: userName,
      avatar: avatarUrl,
      cursorColor,
    },
  });

  // Grant the user full access to the requested room
  session.allow(roomId, session.FULL_ACCESS);

  const { status, body: responseBody } = await session.authorize();

  return new Response(responseBody, { status });
}
