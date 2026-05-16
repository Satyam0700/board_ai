import { Liveblocks } from "@liveblocks/node";

/**
 * Cached Liveblocks node client singleton.
 *
 * Uses a lazy getter so the client is only constructed on first use,
 * avoiding build-time failures when LIVEBLOCKS_SECRET_KEY is not set.
 *
 * In development the instance is cached on `globalThis` so Next.js hot
 * reloads don't create multiple clients.
 */

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

function buildClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
  }

  return new Liveblocks({ secret });
}

function getLiveblocksClient(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = buildClient();
  }
  return globalForLiveblocks.liveblocks;
}

/**
 * Lazily-initialized Liveblocks node client.
 * Access via `liveblocks` — the client is created on first property access.
 */
export const liveblocks = new Proxy({} as Liveblocks, {
  get(_target, prop, receiver) {
    const client = getLiveblocksClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

/**
 * Fixed palette of distinct cursor colors.
 * Deterministically maps a user ID to a consistent color.
 */
const CURSOR_COLORS = [
  "#E57373", // red
  "#64B5F6", // blue
  "#81C784", // green
  "#FFD54F", // amber
  "#BA68C8", // purple
  "#4DD0E1", // cyan
  "#FF8A65", // deep orange
  "#A1887F", // brown
  "#90A4AE", // blue grey
  "#F06292", // pink
  "#AED581", // light green
  "#7986CB", // indigo
] as const;

/**
 * Deterministically maps a user ID string to a consistent cursor color
 * from the fixed palette. Uses a simple hash so the same user always
 * gets the same color across sessions.
 */
export function getCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}
