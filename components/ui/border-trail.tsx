"use client";

import * as React from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

/**
 * BorderTrail renders a single animated bead that orbits the border of the parent
 * rounded container. It relies on CSS offset-path with a rounded rect path so the
 * motion is perfectly smooth and clockwork around the perimeter.
 *
 * Usage: wrap a relatively positioned, rounded element and render <BorderTrail />
 * as a last child to draw the animated trail above it.
 */
export function BorderTrail({
  className,
  size = 96,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: 6,
    ease: "linear",
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(hsl(var(--foreground)),hsl(var(--foreground)))]"
    >
      <motion.div
        className={cn("absolute aspect-square rounded-full", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ ...(transition ?? BASE_TRANSITION), delay }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}

export default BorderTrail;


