"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={"reveal " + (visible ? "is-visible " : "") + className} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max ? (window.scrollY / max) * 100 : 0); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-white/5"><div className="h-full bg-[#c7f36b] transition-[width] duration-150" style={{ width: progress + "%" }} /></div>;
}

export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const move = (event: PointerEvent) => { node.style.transform = "translate3d(" + (event.clientX - 260) + "px, " + (event.clientY - 260) + "px, 0)"; };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[520px] w-[520px] rounded-full bg-[#c7f36b]/[0.045] blur-3xl transition-transform duration-700 ease-out lg:block" />;
}
