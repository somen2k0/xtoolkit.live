import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -300, y: -300 });
  const orb = useRef({ x: -300, y: -300 });
  const ring = useRef({ x: -300, y: -300 });
  const raf = useRef<number>();

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    document.body.style.cursor = "none";
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const tick = () => {
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      // Ring — medium lag (lerp 0.18)
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      // Orb — slow trailing glow (lerp 0.07)
      orb.current.x += (mouse.current.x - orb.current.x) * 0.07;
      orb.current.y += (mouse.current.y - orb.current.y) * 0.07;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${orb.current.x - 180}px, ${orb.current.y - 180}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Large trailing glow orb */}
      <div
        ref={orbRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{
          zIndex: 99998,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(258 82% 66% / 0.13) 0%, hsl(195 90% 60% / 0.06) 45%, transparent 70%)",
          filter: "blur(2px)",
        }}
        aria-hidden
      />

      {/* Medium ring — subtle outline circle */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{
          zIndex: 99999,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid hsl(258 82% 72% / 0.45)",
          boxShadow: "0 0 8px 1px hsl(258 82% 66% / 0.25)",
          backdropFilter: "none",
          transition: "width 0.15s, height 0.15s, border-color 0.15s",
        }}
        aria-hidden
      />

      {/* Precise cursor dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
        style={{
          zIndex: 100000,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "hsl(258 82% 80%)",
          boxShadow: "0 0 6px 2px hsl(258 82% 66% / 0.70), 0 0 14px 4px hsl(258 82% 66% / 0.30)",
        }}
        aria-hidden
      />
    </>
  );
}
