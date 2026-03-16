"use client";

import { useState } from "react";
import type { SegmentCategory } from "@/types/prompt";
import {
  SEGMENT_DEFINITIONS,
  SIDEBAR_CATEGORIES,
  CATEGORY_LABELS,
} from "@/lib/segments";
import SegmentItem from "./SegmentItem";

interface SidebarProps {
  onAddSegment: (segmentId: string) => void;
}

export default function Sidebar({ onAddSegment }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Set<SegmentCategory>>(
    new Set(["prompt", "git", "decorators", "plugins"])
  );

  const toggleSection = (category: SegmentCategory) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Segments
        </h2>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Click to add to prompt
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {SIDEBAR_CATEGORIES.map((category) => {
          const isOpen = openSections.has(category);
          const segments = SEGMENT_DEFINITIONS.filter(
            (s) => s.category === category
          );
          return (
            <div
              key={category}
              className="border-b border-zinc-100 dark:border-zinc-800"
            >
              <button
                onClick={() => toggleSection(category)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <span className="flex items-center gap-2">
                  {CATEGORY_LABELS[category]}
                  <span className="text-xs text-zinc-400">
                    {segments.length}
                  </span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={`h-4 w-4 text-zinc-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="px-2 pb-2">
                  {segments.map((seg) => (
                    <SegmentItem
                      key={seg.id}
                      segment={seg}
                      onAdd={onAddSegment}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
