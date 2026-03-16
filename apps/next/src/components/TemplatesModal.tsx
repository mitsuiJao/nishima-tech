"use client";

import { useEffect } from "react";
import type { ActiveSegmentData } from "@/types/prompt";
import { PRESETS } from "@/lib/presets";
import { getMockPreview, getCssColor, getCssBgColor } from "@/lib/generator";

interface TemplatesModalProps {
  onClose: () => void;
  onSelect: (segments: ActiveSegmentData[]) => void;
}

export default function TemplatesModal({
  onClose,
  onSelect,
}: TemplatesModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSelect = (preset: (typeof PRESETS)[number]) => {
    const freshSegments = preset.segments.map((s) => ({
      ...s,
      instanceId: `${s.segmentId}-${Math.random().toString(36).slice(2, 8)}`,
    }));
    onSelect(freshSegments);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-8 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Templates
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Select a template to apply. This will replace your current
              segments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => {
            const preview = getMockPreview(preset.segments);
            return (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset)}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-600"
              >
                <div className="border-b border-zinc-200 bg-[#1e1e1e] px-4 py-3 font-mono text-sm dark:border-zinc-700">
                  <div className="flex min-h-[2.5rem] flex-wrap items-center leading-6">
                    {preview.map((part, i) => {
                      if (part.text === "\n") {
                        return <div key={i} className="w-full" />;
                      }
                      const isBold = part.fg.startsWith("bold_");
                      return (
                        <span
                          key={i}
                          style={{
                            color:
                              part.fg === "default"
                                ? "#dcdfe4"
                                : getCssColor(part.fg),
                            backgroundColor:
                              part.bg === "default"
                                ? "transparent"
                                : getCssBgColor(part.bg),
                            fontWeight: isBold ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      );
                    })}
                    <span className="animate-pulse text-zinc-500">|</span>
                  </div>
                </div>
                <div className="flex h-[4.5rem] flex-col justify-center gap-0.5 p-3">
                  <span className="truncate text-base font-semibold text-zinc-800 group-hover:text-indigo-600 dark:text-zinc-200 dark:group-hover:text-indigo-400">
                    {preset.name}
                  </span>
                  <span className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {preset.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
