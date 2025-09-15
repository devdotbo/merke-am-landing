"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkInProgressGateProps {
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_TITLE = "Studio is under construction";
const DEFAULT_DESCRIPTION =
  "Wallet login and query execution are not enabled yet. We’re wiring up nodes, provenance, and anchors.";

export function WorkInProgressGate({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
}: WorkInProgressGateProps) {
  const AlertIcon = AlertTriangle as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wip-title"
      aria-describedby="wip-description"
      className="fixed inset-0 z-[60] pointer-events-auto"
    >
      {/* Backdrop: theme-based veil (not gray/black) + subtle brand glow */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Content */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 w-[min(96vw,600px)] -translate-x-1/2 -translate-y-1/2 relative z-10",
          className,
        )}
      >
        {/* Subtle spotlight behind the panel for emphasis */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-16 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_center,_hsl(var(--accent)/0.28),_transparent_65%)]"
        />
        <div className="rounded-xl border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--background)/1)] shadow-[0_10px_30px_-10px_hsl(var(--accent)/0.35),0_0_0_1px_hsl(var(--accent)/0.18)]">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-md bg-[hsl(var(--accent)/0.15)] p-2 ring-1 ring-[hsl(var(--accent)/0.35)]">
                <AlertIcon className="h-5 w-5 text-[hsl(var(--accent))]" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase font-brand-sans">
                    Private alpha
                  </span>
                </div>
                <h2 id="wip-title" className="text-xl md:text-2xl font-semibold tracking-tight font-brand-serif text-foreground">
                  {title}
                </h2>
                <p id="wip-description" className="text-sm md:text-base text-muted-foreground leading-relaxed font-brand-sans">
                  {description}
                </p>
                <p className="text-xs text-muted-foreground/80 font-brand-sans">
                  Build with nodes. Keep the proof. 0G anchors your history and verifies results.
                </p>
              </div>
            </div>

            {/* Spacer for visual rhythm; no interactive controls */}
            <div className="mt-6 h-0" />
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />
          <div className="px-6 py-4 md:px-8">
            <div className="text-xs text-muted-foreground font-brand-sans">
              Interactions are temporarily disabled while we finish this surface.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkInProgressGate;


