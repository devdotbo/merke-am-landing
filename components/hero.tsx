"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Wallet, Zap, Database, Brain, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    let trails: Array<{ x: number; y: number; life: number }> = [];

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
  title = "Transform Data into Intelligence",
  subtitle = "Experience the power of RAG-driven inference with our cutting-edge AI platform",
  inputPlaceholder = "Enter your query...",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [nodeStates, setNodeStates] = useState<Record<string, boolean>>({});
  const canvasRef = useCanvasTrail();

  const cursor1X = useMotionValue(200);
  const cursor1Y = useMotionValue(150);
  const cursor2X = useMotionValue(600);
  const cursor2Y = useMotionValue(150);

  const springCursor1X = useSpring(cursor1X, { stiffness: 200, damping: 25 });
  const springCursor1Y = useSpring(cursor1Y, { stiffness: 200, damping: 25 });
  const springCursor2X = useSpring(cursor2X, { stiffness: 200, damping: 25 });
  const springCursor2Y = useSpring(cursor2Y, { stiffness: 200, damping: 25 });

  const cursors: CursorItem[] = [
    { id: "alex", username: "Alex", color: "#FF6B6B" },
    { id: "sarah", username: "Sarah", color: "#4ECDC4" },
  ];

  const nodes: NodeItem[] = [
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
      x: 650,
      y: 120,
      details: ["Language Model", "Response Generation", "Quality Scoring", "Output Validation"],
    },
  ];

  useEffect(() => {
    let alexIndex = 0;
    let sarahIndex = 0;

    const alexTargets = [
      { x: 150, y: 120 },
      { x: 400, y: 80 },
      { x: 650, y: 120 },
    ];

    const sarahTargets = [
      { x: 650, y: 120 },
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
      }, 1500);
      alexIndex = (alexIndex + 1) % alexTargets.length;

      setTimeout(() => {
        const sarahTarget = sarahTargets[sarahIndex];
        cursor2X.set(sarahTarget.x + Math.random() * 40 - 20);
        cursor2Y.set(sarahTarget.y + Math.random() * 40 - 20);
        sarahIndex = (sarahIndex + 1) % sarahTargets.length;
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [cursor1X, cursor1Y, cursor2X, cursor2Y]);

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

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-20">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI Platform
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
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent drop-shadow-sm">
                {title}
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="max-w-2xl w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <div className="flex items-center bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-2 flex-1">
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
                      <Plus className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      placeholder={inputPlaceholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
                    transition={{ duration: 2, delay: index * 0.5, repeat: Infinity, repeatType: "loop" }}
                  />
                );
              })}
            </svg>

            {nodes.map((node, index) => (
              <motion.div key={node.id} className="absolute" style={{ left: node.x - 60, top: node.y - 40, zIndex: 2 }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2, type: "spring", stiffness: 200 }}>
                <div className="relative">
                  <motion.div className="w-24 h-24 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg backdrop-blur-sm" whileHover={{ scale: 1.05 }} animate={nodeStates[node.id] ? { borderColor: "hsl(var(--primary))", boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" } : {}}>
                    <div className="text-primary">{node.icon}</div>
                  </motion.div>
                  <div className="text-center mt-3 text-sm font-medium text-foreground">{node.label}</div>
                  <motion.div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden" initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={nodeStates[node.id] ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: -10 }} transition={{ duration: 0.2 }} style={{ pointerEvents: "none" }}>
                    {node.details.map((detail, detailIndex) => (
                      <motion.div key={detailIndex} className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 border-b border-border/50 last:border-b-0" initial={{ opacity: 0, x: -10 }} animate={nodeStates[node.id] ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.2, delay: detailIndex * 0.1 }}>
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

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-border/50" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
          {[
            { label: "Data Sources", value: "1000+", gradient: "from-blue-500 to-cyan-500" },
            { label: "Inference Speed", value: "< 100ms", gradient: "from-green-500 to-emerald-500" },
            { label: "Accuracy Rate", value: "99.9%", gradient: "from-purple-500 to-pink-500" },
          ].map((stat, index) => (
            <motion.div key={index} className="text-center group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }} whileHover={{ y: -5 }}>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;


