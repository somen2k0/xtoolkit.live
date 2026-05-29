import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;          // 0→1, counts down
  decay: number;         // how fast it dies
  size: number;
  hue: number;
  isStar: boolean;       // star shape vs circle
}

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -999, y: -999, px: -999, py: -999 });
  const raf = useRef<number>();
  const active = useRef(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
    if (!isFine || isMobile) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      mouse.current.px = mouse.current.x;
      mouse.current.py = mouse.current.y;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      active.current = true;

      const dx = mouse.current.x - mouse.current.px;
      const dy = mouse.current.y - mouse.current.py;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // More particles when moving faster
      const count = Math.min(Math.ceil(speed * 0.35) + 1, 10);

      for (let i = 0; i < count; i++) {
        const t = i / count;
        // Interpolate spawn position along movement path
        const spawnX = mouse.current.px + dx * t + (Math.random() - 0.5) * 3;
        const spawnY = mouse.current.py + dy * t + (Math.random() - 0.5) * 3;

        // Tail goes opposite to travel direction, with spread
        const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 0.8;
        const tailSpeed = speed * 0.04 + Math.random() * 0.8;

        const isStar = Math.random() > 0.45;

        // Color: mix of violet, white, gold for a shooting star feel
        const colorRoll = Math.random();
        const hue = colorRoll < 0.45 ? 258 + Math.random() * 30   // violet-purple
                  : colorRoll < 0.75 ? 45  + Math.random() * 20   // gold-yellow
                  :                    0;                           // white (hsl 0 0% 100%)
        const isSaturated = hue !== 0;

        particles.current.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(angle) * tailSpeed,
          vy: Math.sin(angle) * tailSpeed,
          life: 1,
          decay: 0.022 + Math.random() * 0.028,
          size: isStar ? 1.2 + Math.random() * 2 : 0.8 + Math.random() * 1.8,
          hue: isSaturated ? hue : 0,
          isStar,
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    // Draw a 4-point sparkle star
    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      const outer = size * 2.2;
      const inner = size * 0.45;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const r = i % 2 === 0 ? outer : inner;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove dead particles
      particles.current = particles.current.filter(p => p.life > 0);

      for (const p of particles.current) {
        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;        // gentle gravity
        p.vx *= 0.98;        // air drag
        p.life -= p.decay;

        const alpha = Math.max(0, p.life * p.life); // ease-out fade

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);

        if (p.isStar) {
          // Sparkle / 4-point star
          const lightness = p.hue === 0 ? "98%" : "80%";
          const saturation = p.hue === 0 ? "0%" : "90%";
          ctx.fillStyle = `hsl(${p.hue} ${saturation} ${lightness})`;
          ctx.shadowColor = p.hue === 0
            ? "hsl(258 80% 88%)"
            : `hsl(${p.hue} 90% 70%)`;
          ctx.shadowBlur = 8;
          // slight random rotation per frame
          ctx.rotate(p.life * 3);
          drawStar(ctx, p.size);
          ctx.fill();
        } else {
          // Small glowing circle
          const lightness = p.hue === 0 ? "96%" : "78%";
          const saturation = p.hue === 0 ? "0%" : "85%";
          ctx.fillStyle = `hsl(${p.hue} ${saturation} ${lightness})`;
          ctx.shadowColor = `hsl(${p.hue === 0 ? 258 : p.hue} 85% 70%)`;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 99999 }}
      aria-hidden
    />
  );
}
