"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

export interface MasonryItem {
  _id: string;
  width?: number;
  height?: number;
}

interface Breakpoints {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
}

interface MasonryGridProps<T extends MasonryItem> {
  items: T[];
  columns: Breakpoints;
  gapClassName?: string;
  renderItem: (item: T) => ReactNode;
}

function columnCountFor(width: number, bp: Breakpoints) {
  if (width >= 1024 && bp.lg) return bp.lg;
  if (width >= 768 && bp.md) return bp.md;
  if (width >= 640 && bp.sm) return bp.sm;
  return bp.base;
}

function useColumnCount(bp: Breakpoints) {
  const [count, setCount] = useState(bp.base);

  useEffect(() => {
    const update = () => setCount(columnCountFor(window.innerWidth, bp));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [bp.base, bp.sm, bp.md, bp.lg]);

  return count;
}

// Height of an item relative to its width; unknown dimensions are treated as square.
const ratioOf = (item: MasonryItem) =>
  item.width && item.height ? item.height / item.width : 1;

export default function MasonryGrid<T extends MasonryItem>({
  items,
  columns,
  gapClassName = "gap-4",
  renderItem,
}: MasonryGridProps<T>) {
  const columnCount = useColumnCount(columns);

  // Remembers which column each item was placed in. Placement is sticky:
  // appending more items or deleting one never moves the others.
  const placement = useRef<{ count: number; map: Map<string, number> }>({
    count: columnCount,
    map: new Map(),
  });

  if (placement.current.count !== columnCount) {
    placement.current = { count: columnCount, map: new Map() };
  }
  const { map } = placement.current;

  const currentIds = new Set(items.map(i => i._id));
  for (const id of map.keys()) if (!currentIds.has(id)) map.delete(id);

  const heights = new Array<number>(columnCount).fill(0);
  for (const item of items) {
    const col = map.get(item._id);
    if (col !== undefined) heights[col] += ratioOf(item);
  }
  for (const item of items) {
    if (map.has(item._id)) continue;
    let target = 0;
    for (let c = 1; c < columnCount; c++) if (heights[c] < heights[target]) target = c;
    map.set(item._id, target);
    heights[target] += ratioOf(item);
  }

  const cols: T[][] = Array.from({ length: columnCount }, () => []);
  for (const item of items) cols[map.get(item._id)!].push(item);

  return (
    <div className={`flex items-start ${gapClassName}`}>
      {cols.map((colItems, i) => (
        <div key={i} className={`flex-1 min-w-0 flex flex-col ${gapClassName}`}>
          <AnimatePresence>
            {colItems.map(item => (
              <Fragment key={item._id}>{renderItem(item)}</Fragment>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
