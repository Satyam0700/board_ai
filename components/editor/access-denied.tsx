import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-base p-4">
      <Lock className="h-12 w-12 text-copy-secondary mb-4" />
      <h1 className="text-xl font-semibold text-copy-primary mb-2">Access Denied</h1>
      <p className="text-sm text-copy-secondary mb-6 text-center max-w-sm">
        You do not have permission to view this project, or it does not exist.
      </p>
      <Link href="/editor">
        <Button variant="outline">Return to Home</Button>
      </Link>
    </div>
  );
}
