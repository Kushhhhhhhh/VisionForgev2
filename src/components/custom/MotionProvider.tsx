"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Loads framer-motion's animation features in a separate chunk after the page
// is interactive, instead of shipping them in each route's initial JS.
const loadFeatures = () => import("@/lib/motion-features").then(mod => mod.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
