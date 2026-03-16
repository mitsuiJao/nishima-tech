"use client";

import type { ActiveSegmentData } from "@/types/prompt";
import { getMockPreview, getCssColor, getCssBgColor } from "@/lib/generator";

interface TerminalPreviewProps {
  segments: ActiveSegmentData[];
}

export default function TerminalPreview({ segments }: TerminalPreviewProps) {
  const preview = getMockPreview(segments);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-700 bg-[#1e1e1e] shadow-lg">
      <div className="flex items-center border-b border-zinc-700 bg-[#2d2d2d] px-4 py-2">
        <span className="text-xs text-zinc-400">Terminal Preview</span>
      </div>
      <div className="min-h-[120px] p-4 font-mono text-base leading-7">
        {preview.length === 0 ? (
          <span className="text-zinc-500">
            Add segments to preview your prompt...
          </span>
        ) : (
          <div className="flex flex-wrap">
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
                      part.fg === "default" ? "#dcdfe4" : getCssColor(part.fg),
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
            <span className="animate-pulse text-zinc-300">|</span>
          </div>
        )}
      </div>
    </div>
  );
}
