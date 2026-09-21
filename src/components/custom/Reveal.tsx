"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Phase = "idle" | "hidden" | "shown";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

// Fades content in as it scrolls into view. Content is fully visible in the
// server HTML, so nothing is hidden until JS runs; only elements that start
// below the fold are hidden (before first paint) and revealed on scroll.
export default function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    phase === "shown" && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined;

  const phaseClass =
    phase === "hidden"
      ? "opacity-0 translate-y-5"
      : phase === "shown"
        ? "opacity-100 translate-y-0 transition duration-700 ease-out"
        : "";

  return (
    <div ref={ref} style={style} className={`${phaseClass} ${className}`}>
      {children}
    </div>
  );
}
