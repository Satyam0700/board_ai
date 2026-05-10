import { SignUp } from "@clerk/nextjs";
import { BrainCircuit, Users, FileText } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-base font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[45%] min-h-screen p-12 border-r border-surface-border">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-base font-black text-[#080809]">
            B
          </span>
          <span className="text-sm font-semibold text-copy-primary tracking-wide">
            Board AI
          </span>
        </div>

        {/* Main copy */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mt-16">
          <h1 className="text-[2.6rem] leading-[1.15] font-bold text-copy-primary mb-5">
            Design systems at the speed of thought.
          </h1>
          <p className="text-base text-copy-secondary leading-relaxed mb-12">
            Describe your architecture in plain English. Board AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          {/* Feature list */}
          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-elevated text-copy-secondary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-copy-primary">
                    {title}
                  </p>
                  <p className="text-sm text-copy-muted mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-copy-faint">
          © 2026 Board AI. All rights reserved.
        </p>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex flex-1 items-center justify-center bg-surface p-8">
        <SignUp />
      </div>
    </div>
  );
}
