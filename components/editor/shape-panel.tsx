"use client";

import { Button } from "@/components/ui/button";
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react";

export const SHAPES = [
  {
    name: "rectangle",
    icon: Square,
    defaultSize: { width: 120, height: 80 },
  },
  {
    name: "diamond",
    icon: Diamond,
    defaultSize: { width: 120, height: 120 },
  },
  {
    name: "circle",
    icon: Circle,
    defaultSize: { width: 100, height: 100 },
  },
  {
    name: "pill",
    icon: Pill,
    defaultSize: { width: 120, height: 60 },
  },
  {
    name: "cylinder",
    icon: Cylinder,
    defaultSize: { width: 100, height: 120 },
  },
  {
    name: "hexagon",
    icon: Hexagon,
    defaultSize: { width: 120, height: 100 },
  },
];

export function ShapePanel() {
  const onDragStart = (event: React.DragEvent, shape: typeof SHAPES[0]) => {
    event.dataTransfer.setData("application/reactflow-shape", shape.name);
    event.dataTransfer.setData("application/reactflow-width", shape.defaultSize.width.toString());
    event.dataTransfer.setData("application/reactflow-height", shape.defaultSize.height.toString());
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-background/90 backdrop-blur-md border border-surface-border p-2 rounded-full shadow-lg">
      {SHAPES.map((shape) => {
        const Icon = shape.icon;
        return (
          <Button
            key={shape.name}
            variant="ghost"
            size="icon"
            className="cursor-grab rounded-full hover:bg-accent-dim hover:text-copy-primary text-copy-secondary transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, shape)}
            title={`Add ${shape.name}`}
          >
            <Icon className="w-5 h-5" />
          </Button>
        );
      })}
    </div>
  );
}
