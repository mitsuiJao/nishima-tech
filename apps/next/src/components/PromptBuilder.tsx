"use client";

import { useReducer, useState, useCallback, useRef } from "react";
import type {
  PromptState,
  PromptAction,
  ActiveSegmentData,
} from "@/types/prompt";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TerminalPreview from "./TerminalPreview";
import RawOutput from "./RawOutput";
import ActiveSegmentList from "./ActiveSegmentList";
import PresetGallery from "./PresetGallery";

function promptReducer(
  state: PromptState,
  action: PromptAction
): PromptState {
  switch (action.type) {
    case "ADD_SEGMENT": {
      const newSegment: ActiveSegmentData = {
        instanceId: `${action.segmentId}-${Math.random().toString(36).slice(2, 8)}`,
        segmentId: action.segmentId,
        fg: "default",
        bg: "default",
      };
      return { ...state, segments: [...state.segments, newSegment] };
    }
    case "REMOVE_SEGMENT":
      return {
        ...state,
        segments: state.segments.filter(
          (s) => s.instanceId !== action.instanceId
        ),
      };
    case "MOVE_SEGMENT": {
      const idx = state.segments.findIndex(
        (s) => s.instanceId === action.instanceId
      );
      if (idx === -1) return state;
      const newIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.segments.length) return state;
      const newSegments = [...state.segments];
      [newSegments[idx], newSegments[newIdx]] = [
        newSegments[newIdx],
        newSegments[idx],
      ];
      return { ...state, segments: newSegments };
    }
    case "REORDER_SEGMENTS": {
      const newSegments = [...state.segments];
      const [moved] = newSegments.splice(action.fromIndex, 1);
      newSegments.splice(action.toIndex, 0, moved);
      return { ...state, segments: newSegments };
    }
    case "SET_COLOR":
      return {
        ...state,
        segments: state.segments.map((s) =>
          s.instanceId === action.instanceId
            ? {
                ...s,
                [action.colorType]: action.color,
              }
            : s
        ),
      };
    case "LOAD_PRESET":
      return { ...state, segments: action.segments };
    case "CLEAR_ALL":
      return { ...state, segments: [] };
    default:
      return state;
  }
}

const initialState: PromptState = {
  segments: [],
};

function ResizeHandle({
  onResize,
}: {
  onResize: (delta: number) => void;
}) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastX.current = e.clientX;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = ev.clientX - lastX.current;
        lastX.current = ev.clientX;
        onResize(delta);
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onResize]
  );

  return (
    <div
      onMouseDown={onMouseDown}
      className="group relative z-10 w-1 flex-shrink-0 cursor-col-resize"
    >
      <div className="absolute inset-y-0 -left-1 -right-1 transition-colors group-hover:bg-indigo-400/30" />
    </div>
  );
}

export default function PromptBuilder() {
  const [state, dispatch] = useReducer(promptReducer, initialState);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [activeWidth, setActiveWidth] = useState(300);

  const handleAddSegment = (segmentId: string) => {
    dispatch({ type: "ADD_SEGMENT", segmentId });
  };

  const handleLoadPreset = (segments: ActiveSegmentData[]) => {
    dispatch({ type: "LOAD_PRESET", segments });
  };

  const handleReset = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const handleSidebarResize = useCallback((delta: number) => {
    setSidebarWidth((w) => Math.max(200, Math.min(500, w + delta)));
  }, []);

  const handleActiveResize = useCallback((delta: number) => {
    setActiveWidth((w) => Math.max(220, Math.min(500, w + delta)));
  }, []);

  const isEmpty = state.segments.length === 0;

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header
        segments={state.segments}
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          <Sidebar onAddSegment={handleAddSegment} />
        </div>

        <ResizeHandle onResize={handleSidebarResize} />

        {/* Center Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Active segments list */}
            <div
              className="flex-shrink-0 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900"
              style={{ width: activeWidth }}
            >
              <ActiveSegmentList
                segments={state.segments}
                dispatch={dispatch}
              />
            </div>

            <ResizeHandle onResize={handleActiveResize} />

            {/* Preview and Output */}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
              {isEmpty ? (
                <PresetGallery onLoadPreset={handleLoadPreset} />
              ) : (
                <>
                  <TerminalPreview segments={state.segments} />
                  <RawOutput segments={state.segments} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
