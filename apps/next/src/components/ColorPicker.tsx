"use client";

import type { AnsiColor } from "@/types/prompt";

const COLORS: { color: AnsiColor; label: string }[] = [
  { color: "default", label: "Default" },
  { color: "black", label: "Black" },
  { color: "red", label: "Red" },
  { color: "green", label: "Green" },
  { color: "yellow", label: "Yellow" },
  { color: "blue", label: "Blue" },
  { color: "magenta", label: "Magenta" },
  { color: "cyan", label: "Cyan" },
  { color: "white", label: "White" },
  { color: "bold_black", label: "Bright Black" },
  { color: "bold_red", label: "Bright Red" },
  { color: "bold_green", label: "Bright Green" },
  { color: "bold_yellow", label: "Bright Yellow" },
  { color: "bold_blue", label: "Bright Blue" },
  { color: "bold_magenta", label: "Bright Magenta" },
  { color: "bold_cyan", label: "Bright Cyan" },
  { color: "bold_white", label: "Bright White" },
];

const COLOR_DISPLAY: Record<AnsiColor, string> = {
  default: "#888",
  black: "#1e1e1e",
  red: "#e06c75",
  green: "#98c379",
  yellow: "#e5c07b",
  blue: "#61afef",
  magenta: "#c678dd",
  cyan: "#56b6c2",
  white: "#dcdfe4",
  bold_black: "#5c6370",
  bold_red: "#e06c75",
  bold_green: "#98c379",
  bold_yellow: "#e5c07b",
  bold_blue: "#61afef",
  bold_magenta: "#c678dd",
  bold_cyan: "#56b6c2",
  bold_white: "#ffffff",
};

interface ColorPickerProps {
  label: string;
  value: AnsiColor;
  onChange: (color: AnsiColor) => void;
  mode: "fg" | "bg";
}

export default function ColorPicker({
  label,
  value,
  onChange,
  mode,
}: ColorPickerProps) {
  const selectedEntry = COLORS.find((c) => c.color === value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        {selectedEntry && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {selectedEntry.label}
          </span>
        )}
      </div>
      <div className="grid grid-cols-9 gap-1">
        {COLORS.map(({ color, label: colorLabel }) => {
          const isSelected = value === color;
          const displayColor = COLOR_DISPLAY[color];
          const isDefault = color === "default";
          return (
            <button
              key={color}
              onClick={() => onChange(color)}
              title={colorLabel}
              className={`h-5 w-5 rounded border transition-all ${
                isSelected
                  ? "scale-125 border-indigo-500 ring-2 ring-indigo-400/50"
                  : "border-zinc-300 hover:scale-110 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
              }`}
              style={{
                backgroundColor: isDefault
                  ? mode === "bg"
                    ? "transparent"
                    : "#888"
                  : displayColor,
              }}
            >
              {isDefault && (
                <span className="flex h-full w-full items-center justify-center text-[9px] text-zinc-400">
                  -
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
