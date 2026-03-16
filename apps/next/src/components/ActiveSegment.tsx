"use client";

import type { ActiveSegmentData, AnsiColor, PromptAction } from "@/types/prompt";
import { getSegmentById } from "@/lib/segments";
import { getCssColor, getCssBgColor } from "@/lib/generator";
import ColorPicker from "./ColorPicker";
import { useState } from "react";

interface ActiveSegmentProps {
  segment: ActiveSegmentData;
  index: number;
  total: number;
  dispatch: React.Dispatch<PromptAction>;
}

export default function ActiveSegment({
  segment,
  index,
  total,
  dispatch,
}: ActiveSegmentProps) {
  const [showColors, setShowColors] = useState(false);
  const def = getSegmentById(segment.segmentId);
  if (!def) return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <div className="cursor-grab text-zinc-300 active:cursor-grabbing dark:text-zinc-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <button
            disabled={index === 0}
            onClick={() =>
              dispatch({
                type: "MOVE_SEGMENT",
                instanceId: segment.instanceId,
                direction: "up",
              })
            }
            className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 dark:hover:text-zinc-200"
            aria-label="Move up"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            disabled={index === total - 1}
            onClick={() =>
              dispatch({
                type: "MOVE_SEGMENT",
                instanceId: segment.instanceId,
                direction: "down",
              })
            }
            className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 dark:hover:text-zinc-200"
            aria-label="Move down"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {def.label}
          </span>
          <code className="ml-1.5 text-xs text-zinc-400">
            {def.code.length > 15 ? def.code.slice(0, 13) + "..." : def.code}
          </code>
        </div>
        {/* Color swatches preview */}
        {(segment.fg !== "default" || segment.bg !== "default") && (
          <div className="flex gap-0.5">
            {segment.fg !== "default" && (
              <div
                className="h-3 w-3 rounded-sm border border-zinc-300 dark:border-zinc-600"
                style={{ backgroundColor: getCssColor(segment.fg) }}
                title={`fg: ${segment.fg}`}
              />
            )}
            {segment.bg !== "default" && (
              <div
                className="h-3 w-3 rounded-sm border border-zinc-300 dark:border-zinc-600"
                style={{ backgroundColor: getCssBgColor(segment.bg) }}
                title={`bg: ${segment.bg}`}
              />
            )}
          </div>
        )}
        <button
          onClick={() => setShowColors(!showColors)}
          className={`rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 ${showColors ? "bg-zinc-100 dark:bg-zinc-700" : ""}`}
          aria-label="Toggle color picker"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.15 7.375a.75.75 0 0 0-.187.313l-.898 2.916a.75.75 0 0 0 .949.949l2.916-.898a.75.75 0 0 0 .312-.187l4.863-4.863a1.75 1.75 0 0 0 0-2.475l-.617-.617Z" />
          </svg>
        </button>
        <button
          onClick={() =>
            dispatch({
              type: "REMOVE_SEGMENT",
              instanceId: segment.instanceId,
            })
          }
          className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          aria-label="Remove segment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
      </div>
      {showColors && (
        <div className="mt-2.5 flex flex-col gap-2.5 border-t border-zinc-100 pt-2.5 dark:border-zinc-700">
          <ColorPicker
            label="Foreground"
            value={segment.fg}
            onChange={(color: AnsiColor) =>
              dispatch({
                type: "SET_COLOR",
                instanceId: segment.instanceId,
                colorType: "fg",
                color,
              })
            }
            mode="fg"
          />
          <ColorPicker
            label="Background"
            value={segment.bg}
            onChange={(color: AnsiColor) =>
              dispatch({
                type: "SET_COLOR",
                instanceId: segment.instanceId,
                colorType: "bg",
                color,
              })
            }
            mode="bg"
          />
        </div>
      )}
    </div>
  );
}
