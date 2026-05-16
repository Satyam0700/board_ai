"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Loader2, X, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Collaborator {
  email: string;
  name: string | null;
  avatar: string | null;
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({ isOpen, onClose, projectId, isOwner }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
      setCopied(false);
      setError(null);
      setEmail("");
    }
  }, [isOpen, projectId]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) throw new Error("Failed to load collaborators");
      const data = await res.json();
      setCollaborators(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load collaborators.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/editor/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isOwner) return;

    setIsInviting(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to invite");
      }

      const newCollab = await res.json();
      setCollaborators([newCollab, ...collaborators]);
      setEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (collabEmail: string) => {
    if (!isOwner) return;
    
    // Optimistic update
    const previous = [...collaborators];
    setCollaborators(collaborators.filter((c) => c.email !== collabEmail));

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators/${encodeURIComponent(collabEmail)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove");
    } catch (err) {
      console.error(err);
      setCollaborators(previous); // Revert
      setError("Failed to remove collaborator.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface border-surface-border p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-semibold text-copy-primary">
            Share Project
          </DialogTitle>
          <DialogDescription className="text-sm text-copy-secondary">
            Anyone with access can view and edit this project.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/editor/${projectId}`}
              className="bg-base border-surface-border text-copy-primary focus-visible:ring-brand"
            />
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="shrink-0 gap-2 w-[100px] bg-elevated hover:bg-subtle text-copy-primary"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {isOwner && (
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                placeholder="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-base border-surface-border text-copy-primary focus-visible:ring-brand"
              />
              <Button type="submit" disabled={isInviting || !email.trim()} className="shrink-0 w-[100px]">
                {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
              </Button>
            </form>
          )}
          
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="border-t border-surface-border p-6 bg-base">
          <h4 className="text-sm font-medium text-copy-primary mb-3">Collaborators</h4>
          <ScrollArea className="h-[200px] pr-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-copy-muted" />
              </div>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-copy-faint text-center py-4">No collaborators yet.</p>
            ) : (
              <div className="space-y-3">
                {collaborators.map((c) => (
                  <div key={c.email} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {c.avatar ? (
                        <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-surface-border flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-copy-muted" />
                        </div>
                      )}
                      <div className="truncate">
                        {c.name && <p className="text-sm font-medium text-copy-primary truncate">{c.name}</p>}
                        <p className={`text-xs truncate ${c.name ? "text-copy-secondary" : "text-sm font-medium text-copy-primary"}`}>
                          {c.email}
                        </p>
                      </div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleRemove(c.email)}
                        className="p-2 -mr-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-border text-copy-muted hover:text-destructive focus-visible:opacity-100"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
