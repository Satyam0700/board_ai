"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import { CanvasNode } from "@/types/canvas";

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  return (
    <div 
      className={`relative flex items-center justify-center w-full h-full bg-surface text-copy-primary border-2 rounded-md transition-colors ${
        selected ? "border-brand shadow-md" : "border-surface-border"
      }`}
      style={{ backgroundColor: data.color }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <span className="text-sm font-medium px-2 text-center pointer-events-none select-none">
        {data.label || ""}
      </span>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
