"use client";

import { useEffect } from "react";

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-800">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            About
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
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
        <div className="mt-4 space-y-3 text-base text-zinc-600 dark:text-zinc-300">
          <p>
            <strong>Oh My Zsh Prompt Builder</strong> is a visual tool for
            designing custom zsh prompts. Compose your prompt by combining
            segments — usernames, directories, git info, decorators, and more —
            then apply colors and export a ready-to-use{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-700">
              .zshrc
            </code>{" "}
            configuration.
          </p>
          <p>
            Compatible with{" "}
            <strong>Oh My Zsh</strong> and standard zsh prompt escape sequences.
            Some segments (like git info) require Oh My Zsh plugins to be
            installed.
          </p>
          <h3 className="pt-2 text-base font-semibold text-zinc-800 dark:text-zinc-100">
            How to use
          </h3>
          <ol className="list-inside list-decimal space-y-1.5 text-sm">
            <li>
              Pick a preset template or add segments from the left panel
            </li>
            <li>Drag to reorder segments in the Active Segments list</li>
            <li>Click the paint icon to customize foreground/background colors</li>
            <li>Preview your prompt in the terminal window</li>
            <li>Download the .zshrc file or copy the raw configuration</li>
          </ol>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
