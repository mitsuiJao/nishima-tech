export type AnsiColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "bold_black"
  | "bold_red"
  | "bold_green"
  | "bold_yellow"
  | "bold_blue"
  | "bold_magenta"
  | "bold_cyan"
  | "bold_white"
  | "default";

export type SegmentCategory =
  | "prompt"
  | "git"
  | "colors"
  | "decorators"
  | "plugins";

export interface SegmentDefinition {
  id: string;
  label: string;
  code: string;
  category: SegmentCategory;
  description: string;
  mockValue: string;
}

export interface ActiveSegmentData {
  instanceId: string;
  segmentId: string;
  fg: AnsiColor;
  bg: AnsiColor;
}

export type PresetId =
  | "robbyrussell"
  | "agnoster"
  | "minimal"
  | "clean"
  | "refined"
  | "powerline"
  | "lambda"
  | "pure"
  | "spaceship"
  | "bullet_train";

export interface PresetTheme {
  id: PresetId;
  name: string;
  description: string;
  segments: ActiveSegmentData[];
}

export type PromptAction =
  | { type: "ADD_SEGMENT"; segmentId: string }
  | { type: "REMOVE_SEGMENT"; instanceId: string }
  | { type: "MOVE_SEGMENT"; instanceId: string; direction: "up" | "down" }
  | { type: "REORDER_SEGMENTS"; fromIndex: number; toIndex: number }
  | {
      type: "SET_COLOR";
      instanceId: string;
      colorType: "fg" | "bg";
      color: AnsiColor;
    }
  | { type: "LOAD_PRESET"; segments: ActiveSegmentData[] }
  | { type: "CLEAR_ALL" };

export interface PromptState {
  segments: ActiveSegmentData[];
}
