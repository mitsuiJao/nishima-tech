"use client";

import { useState } from "react";
import type { ActiveSegmentData, PresetId } from "@/types/prompt";
import { PRESETS } from "@/lib/presets";
import { generateZshrc } from "@/lib/generator";
import ThemeToggle from "./ThemeToggle";
import AboutModal from "./AboutModal";
import TemplatesModal from "./TemplatesModal";

interface HeaderProps {
  segments: ActiveSegmentData[];
  onLoadPreset: (segments: ActiveSegmentData[]) => void;
  onReset: () => void;
}

export default function Header({
  segments,
  onLoadPreset,
  onReset,
}: HeaderProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleDownload = () => {
    const content = generateZshrc(segments);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".zshrc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value as PresetId;
    if (!presetId) return;
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const freshSegments = preset.segments.map((s) => ({
        ...s,
        instanceId: `${s.segmentId}-${Math.random().toString(36).slice(2, 8)}`,
      }));
      onLoadPreset(freshSegments);
    }
  };

  const handleTemplateSelect = (segments: ActiveSegmentData[]) => {
    onLoadPreset(segments);
    setShowTemplates(false);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="text-xl font-bold text-zinc-800 transition-opacity hover:opacity-70 dark:text-zinc-100"
          >
            <span className="text-indigo-600 dark:text-indigo-400">
              Oh My Zsh
            </span>{" "}
            Prompt Builder
          </button>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setShowTemplates(true)}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              Templates
            </button>
            <button
              onClick={() => setShowAbout(true)}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              About
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <select
            onChange={handlePresetChange}
            defaultValue=""
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition-colors hover:border-zinc-300 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600"
          >
            <option value="">Load Preset...</option>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleDownload}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
              <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
            </svg>
            Download
          </button>
          <ThemeToggle />
        </div>
      </header>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showTemplates && (
        <TemplatesModal
          onClose={() => setShowTemplates(false)}
          onSelect={handleTemplateSelect}
        />
      )}
    </>
  );
}
