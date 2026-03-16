"use client";

import type { SegmentDefinition } from "@/types/prompt";

interface SegmentItemProps {
  segment: SegmentDefinition;
  onAdd: (segmentId: string) => void;
}

export default function SegmentItem({ segment, onAdd }: SegmentItemProps) {
  return (
    <button
      onClick={() => onAdd(segment.id)}
      className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
    >
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400">
        {segment.code.length > 20
          ? segment.code.slice(0, 18) + "..."
          : segment.code}
      </code>
      <span className="flex-1 truncate text-zinc-700 dark:text-zinc-300">
        {segment.label}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="h-3.5 w-3.5 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
      </svg>
    </button>
  );
}
