"use client";

import type { ActiveSegmentData } from "@/types/prompt";
import { PRESETS } from "@/lib/presets";
import { getMockPreview, getCssColor, getCssBgColor } from "@/lib/generator";

interface PresetGalleryProps {
  onLoadPreset: (segments: ActiveSegmentData[]) => void;
}

function PresetCard({
  preset,
  onSelect,
}: {
  preset: (typeof PRESETS)[number];
  onSelect: () => void;
}) {
  const preview = getMockPreview(preset.segments);

  return (
    <button
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-indigo-600"
    >
      {/* Terminal preview */}
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
          <span className="animate-pulse text-zinc-500">|</span>
        </div>
      </div>
      {/* Info */}
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
}

export default function PresetGallery({ onLoadPreset }: PresetGalleryProps) {
  const handleSelect = (preset: (typeof PRESETS)[number]) => {
    const freshSegments = preset.segments.map((s) => ({
      ...s,
      instanceId: `${s.segmentId}-${Math.random().toString(36).slice(2, 8)}`,
    }));
    onLoadPreset(freshSegments);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
          Get Started
        </h2>
        <p className="mt-1 text-base text-zinc-500 dark:text-zinc-400">
          Pick a preset theme to start customizing, or add segments manually
          from the left panel.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PRESETS.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            onSelect={() => handleSelect(preset)}
          />
        ))}
      </div>
    </div>
  );
}
