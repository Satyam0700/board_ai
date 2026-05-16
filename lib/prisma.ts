import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

/**
 * Cached Prisma client singleton.
 *
 * Branches on DATABASE_URL:
 *  - prisma+postgres:// → Accelerate (connection-proxy, edge-compatible)
 *  - anything else      → direct @prisma/adapter-pg
 *
 * In development the instance is cached on `globalThis` so Next.js hot
 * reloads don't exhaust connection limits.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof buildClient> | undefined;
};

function buildClient() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (url.startsWith("prisma+postgres://")) {
    // Accelerate — no driver adapter, use the proxy URL directly
    return new PrismaClient({
      accelerateUrl: url,
    }).$extends(withAccelerate());
  }

  // Direct PostgreSQL via @prisma/adapter-pg
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter }).$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
