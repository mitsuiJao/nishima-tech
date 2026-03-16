"use client";

import { useState, useRef, useCallback } from "react";
import type { ActiveSegmentData, PromptAction } from "@/types/prompt";
import ActiveSegment from "./ActiveSegment";

interface ActiveSegmentListProps {
  segments: ActiveSegmentData[];
  dispatch: React.Dispatch<PromptAction>;
}

export default function ActiveSegmentList({
  segments,
  dispatch,
}: ActiveSegmentListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      dragNode.current = e.currentTarget;
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
      // Make drag image slightly transparent
      requestAnimationFrame(() => {
        if (dragNode.current) {
          dragNode.current.style.opacity = "0.4";
        }
      });
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndex === null || dragIndex === index) return;
      setOverIndex(index);
    },
    [dragIndex]
  );

  const handleDragEnd = useCallback(() => {
    if (dragNode.current) {
      dragNode.current.style.opacity = "1";
    }
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      dispatch({
        type: "REORDER_SEGMENTS",
        fromIndex: dragIndex,
        toIndex: overIndex,
      });
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNode.current = null;
  }, [dragIndex, overIndex, dispatch]);

  const handleDragLeave = useCallback(() => {
    setOverIndex(null);
  }, []);

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Active Segments
        </h3>
        {segments.length > 0 && (
          <button
            onClick={() => dispatch({ type: "CLEAR_ALL" })}
            className="text-sm text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
          >
            Clear All
          </button>
        )}
      </div>
      {segments.length === 0 ? (
        <p className="mt-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No segments added yet.
          <br />
          Click segments in the left panel to add them.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {segments.map((seg, i) => (
            <div
              key={seg.instanceId}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              className={`transition-all ${
                overIndex === i && dragIndex !== null && dragIndex !== i
                  ? dragIndex < i
                    ? "border-b-2 border-indigo-400 pb-1"
                    : "border-t-2 border-indigo-400 pt-1"
                  : ""
              }`}
            >
              <ActiveSegment
                segment={seg}
                index={i}
                total={segments.length}
                dispatch={dispatch}
              />
            </div>
          ))}
          <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Drag to reorder
          </p>
        </div>
      )}
    </>
  );
}
