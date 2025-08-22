"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Wallet, Zap, Database, Brain, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BorderTrail } from "@/components/ui/border-trail";
import { toast } from "sonner";

interface NodeItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  details: string[];
}

interface CursorItem {
  id: string;
  username: string;
  color: string;
}

interface HeroComponentProps {
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  ctaText?: string;
}

const useCanvasTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitialized) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const trails: Array<{ x: number; y: number; life: number }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addTrail = (x: number, y: number) => {
      trails.push({ x, y, life: 1 });
      if (trails.length > 50) trails.shift();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      trails.forEach((trail, index) => {
        trail.life -= 0.02;
        if (trail.life <= 0) {
          trails.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.life * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(Date.now() * 0.01) % 360}, 70%, 60%, ${trail.life})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      addTrail(e.clientX, e.clientY);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    animate();
    setIsInitialized(true);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInitialized]);

  return canvasRef;
};

export const Hero: React.FC<HeroComponentProps> = ({
  title = "Build with nodes. Keep the proof.",
  subtitle = "Click together data, RAG, and inference. 0G anchors your history and verifies results.",
  inputPlaceholder = "Describe your pipeline…",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<number | null>(null);
  const [nodeStates, setNodeStates] = useState<Record<string, boolean>>({});
  const canvasRef = useCanvasTrail();

  const cursor1X = useMotionValue(200);
  const cursor1Y = useMotionValue(150);
  const cursor2X = useMotionValue(600);
  const cursor2Y = useMotionValue(150);

  // Softer springs for more fluid cursor glide
  const springCursor1X = useSpring(cursor1X, { stiffness: 120, damping: 28, mass: 0.9 });
  const springCursor1Y = useSpring(cursor1Y, { stiffness: 120, damping: 28, mass: 0.9 });
  const springCursor2X = useSpring(cursor2X, { stiffness: 120, damping: 28, mass: 0.9 });
  const springCursor2Y = useSpring(cursor2Y, { stiffness: 120, damping: 28, mass: 0.9 });

  const cursors: CursorItem[] = [
    { id: "alex", username: "Alex", color: "#FF6B6B" },
    { id: "sarah", username: "Sarah", color: "#4ECDC4" },
  ];

  const nodes: NodeItem[] = useMemo(() => [
    {
      id: "data",
      label: "Data Sources",
      icon: <Database className="w-6 h-6" />,
      x: 150,
      y: 120,
      details: ["Vector Database", "Document Store", "Knowledge Graph", "Real-time Streams"],
    },
    {
      id: "rag",
      label: "RAG Pipeline",
      icon: <Zap className="w-6 h-6" />,
      x: 400,
      y: 80,
      details: ["Retrieval System", "Context Ranking", "Query Processing", "Embedding Search"],
    },
    {
      id: "inference",
      label: "AI Inference",
      icon: <Brain className="w-6 h-6" />,
      x: 600,
      y: 120,
      details: ["Language Model", "Response Generation", "Quality Scoring", "Output Validation"],
    },
  ], []);

  useEffect(() => {
    let alexIndex = 0;
    let sarahIndex = 0;

    const alexTargets = [
      { x: 150, y: 120 },
      { x: 400, y: 80 },
      { x: 600, y: 120 },
    ];

    const sarahTargets = [
      { x: 600, y: 120 },
      { x: 150, y: 120 },
      { x: 400, y: 80 },
    ];

    const interval = setInterval(() => {
      const alexTarget = alexTargets[alexIndex];
      cursor1X.set(alexTarget.x + Math.random() * 40 - 20);
      cursor1Y.set(alexTarget.y + Math.random() * 40 - 20);
      const currentNode = nodes[alexIndex];
      setNodeStates((prev) => ({ ...prev, [currentNode.id]: true }));
      setTimeout(() => {
        setNodeStates((prev) => ({ ...prev, [currentNode.id]: false }));
      }, 1800);
      alexIndex = (alexIndex + 1) % alexTargets.length;

      setTimeout(() => {
        const sarahTarget = sarahTargets[sarahIndex];
        cursor2X.set(sarahTarget.x + Math.random() * 40 - 20);
        cursor2Y.set(sarahTarget.y + Math.random() * 40 - 20);
        sarahIndex = (sarahIndex + 1) % sarahTargets.length;
      }, 1200);
    }, 3400);

    return () => clearInterval(interval);
  }, [cursor1X, cursor1Y, cursor2X, cursor2Y, nodes]);

  const handleConnectWallet = () => {
    toast("Wallet login coming soon!", {
      description: "We're working on integrating wallet connectivity.",
      duration: 3000,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    toast("Query submitted!", {
      description: `Processing: "${inputValue}"`,
      duration: 3000,
    });
    setInputValue("");
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: "transparent" }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto pl-4 pr-8 md:pr-16 lg:pr-24 xl:pr-32 py-20">
        <div className="flex justify-between items-center mb-20">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Merke.am
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Button variant="outline" onClick={handleConnectWallet} className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all duration-300">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.h1
              className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent drop-shadow-sm">
                {title}
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2, ease: "easeOut" }}
            >
              {subtitle}
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.35, ease: "easeOut" }}
            >
              {/* light trails */}
              <motion.div
                aria-hidden
                className="relative mb-0"
              >
                <motion.div
                  aria-hidden
                  className="absolute -left-64 top-1/2 -translate-y-1/2 w-64 h-12 blur-2xl"
                  style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.70), rgba(14,165,233,0.18), rgba(0,0,0,0))" }}
                  animate={{ opacity: isFocused ? 0.9 : 0.5 }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />
                <motion.div
                  aria-hidden
                  className="absolute -right-64 top-1/2 -translate-y-1/2 w-64 h-12 blur-2xl"
                  style={{ background: "linear-gradient(270deg, rgba(139,92,246,0.70), rgba(14,165,233,0.18), rgba(0,0,0,0))" }}
                  animate={{ opacity: isFocused ? 0.9 : 0.5 }}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.05 }}
                />

                <div className="relative rounded-full magic-glow">
                  <div className="relative isolate flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm px-3 py-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
                      <Sparkles className="h-4 w-4 text-violet-300" />
                    </div>
                    <Input
                      type="text"
                      placeholder={inputPlaceholder}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsTyping(true);
                        if (typingTimer.current) window.clearTimeout(typingTimer.current);
                        typingTimer.current = window.setTimeout(() => setIsTyping(false), 700);
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="flex-1 bg-transparent border-0 h-10 px-2 py-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground text-sm"
                    />
                    <motion.button
                      type="submit"
                      disabled={!inputValue.trim()}
                      whileHover={{ scale: inputValue.trim() ? 1.04 : 1 }}
                      whileTap={{ scale: inputValue.trim() ? 0.96 : 1 }}
                      animate={{ boxShadow: inputValue.trim() ? "0 0 20px rgba(139,92,246,0.35)" : "0 0 6px rgba(139,92,246,0.15)" }}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-sky-400 text-black shadow-md ring-4 ring-violet-400/15 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <motion.span animate={isTyping ? { x: [0, 5, 0] } : { x: 0 }} transition={isTyping ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}>
                        <Send className="h-4 w-4" />
                      </motion.span>
                      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
                    </motion.button>
                  </div>
                  <BorderTrail
                    className="bg-gradient-to-l from-violet-300 via-sky-400 to-fuchsia-300"
                    size={120}
                  />
                </div>
              </motion.div>
            </motion.form>
          </div>

          <div className="relative h-96 lg:h-[500px]">
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              {nodes.map((node, index) => {
                const nextNode = nodes[index + 1];
                if (!nextNode) return null;
                return (
                  <motion.line
                    key={`line-${index}`}
                    x1={node.x}
                    y1={node.y}
                    x2={nextNode.x}
                    y2={nextNode.y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3.2, delay: index * 0.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  />
                );
              })}
            </svg>

            {nodes.map((node, index) => (
              <motion.div key={node.id} className="absolute" style={{ left: node.x - 60, top: node.y - 40, zIndex: 2 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 160, damping: 20 }}>
                <div className="relative">
                  <motion.div className="w-24 h-24 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg backdrop-blur-sm" whileHover={{ scale: 1.05 }} animate={nodeStates[node.id] ? { borderColor: "hsl(var(--primary))", boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" } : {}}>
                    <div className="text-primary">{node.icon}</div>
                  </motion.div>
                  <div className="text-center mt-3 text-sm font-medium text-foreground">{node.label}</div>
                  <motion.div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden" initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={nodeStates[node.id] ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: -10 }} transition={{ duration: 0.26, ease: "easeOut" }} style={{ pointerEvents: "none" }}>
                    {node.details.map((detail, detailIndex) => (
                      <motion.div key={detailIndex} className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 border-b border-border/50 last:border-b-0" initial={{ opacity: 0, x: -10 }} animate={nodeStates[node.id] ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.24, delay: detailIndex * 0.09, ease: "easeOut" }}>
                        {detail}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ))}

            <motion.div className="absolute pointer-events-none" style={{ x: springCursor1X, y: springCursor1Y, zIndex: 4 }}>
              <div className="relative">
                <motion.div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: cursors[0].color }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute inset-0 w-6 h-6 rounded-full" style={{ backgroundColor: cursors[0].color + "40" }} animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-sm" style={{ backgroundColor: cursors[0].color }}>
                  {cursors[0].username}
                </div>
              </div>
            </motion.div>

            <motion.div className="absolute pointer-events-none" style={{ x: springCursor2X, y: springCursor2Y, zIndex: 4 }}>
              <div className="relative">
                <motion.div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: cursors[1].color }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
                <motion.div className="absolute inset-0 w-6 h-6 rounded-full" style={{ backgroundColor: cursors[1].color + "40" }} animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-sm" style={{ backgroundColor: cursors[1].color }}>
                  {cursors[1].username}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats section removed per design request */}
      </div>
    </div>
  );
};

export default Hero;


