"use client";

import { ReactFlow, Background, BackgroundVariant, MiniMap, ConnectionMode } from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import "@xyflow/react/dist/style.css";
import { CanvasNode, CanvasEdge } from "@/types/canvas";
import { CanvasNodeComponent } from "./nodes/canvas-node";
import { ShapePanel } from "./shape-panel";
import { useCallback, useMemo, useRef } from "react";
import { useReactFlow } from "@xyflow/react";

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useLiveblocksFlow<CanvasNode, CanvasEdge>();
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({ canvasNode: CanvasNodeComponent }), []);
  const counterRef = useRef(0);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow-shape');
    if (!type) return;

    const width = event.dataTransfer.getData('application/reactflow-width');
    const height = event.dataTransfer.getData('application/reactflow-height');

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    counterRef.current += 1;
    const newNode: CanvasNode = {
      id: `${type}-${Date.now()}-${counterRef.current}`,
      type: 'canvasNode',
      position,
      data: { label: '', shape: type },
      width: width ? parseInt(width) : 100,
      height: height ? parseInt(height) : 100,
    };

    onNodesChange([{ type: "add", item: newNode }]);
  }, [screenToFlowPosition, onNodesChange]);

  return (
    <div className="w-full h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
      <ShapePanel />
      <ReactFlow
        nodes={nodes ?? undefined}
        edges={edges ?? undefined}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
