"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { ReactFlowProvider } from "@xyflow/react";
import { Canvas } from "./canvas";
import { AlertCircle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

export function CanvasWrapper({ roomId }: { roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider 
        id={roomId} 
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex flex-col items-center justify-center w-full h-full text-copy-secondary gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p>Failed to connect to Liveblocks room</p>
            </div>
          }
        >
          <ClientSideSuspense 
            fallback={
              <div className="flex h-full w-full items-center justify-center text-copy-secondary">
                Loading canvas...
              </div>
            }
          >
            <ReactFlowProvider>
              <Canvas />
            </ReactFlowProvider>
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
