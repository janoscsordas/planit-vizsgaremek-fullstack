"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/utils/supabase';
import { MousePointer2 } from 'lucide-react';
import WhiteBoardHeader from './white-board-header';
import { useUserColor } from './useUserColor';
import { Stage, Layer, Line } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

interface UserMousePosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
  lastActive: number;
}

interface DrawEvent {
  userId: string;
  userName: string;
  points: number[];
  color: string;
  lastActive: number;
}

export default function Whiteboard({ 
  userId, 
  projectId, 
  projectName, 
  userName, 
  onClose 
}: { 
  userId: string, 
  projectId: string, 
  projectName: string, 
  userName: string, 
  onClose: () => void 
}) {
  const [otherUsers, setOtherUsers] = useState<UserMousePosition[]>([]);
  const [drawings, setDrawings] = useState<DrawEvent[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const userColor = useUserColor(userId);

  const updateUserPosition = useCallback((newPosition: UserMousePosition) => {
    setOtherUsers(prev => {
      // Explicitly check if the user exists and position has changed
      const existingUser = prev[userId.indexOf(newPosition.userId)];
      
      if (!existingUser || 
          existingUser.x !== newPosition.x || 
          existingUser.y !== newPosition.y) {
        return {
          ...prev,
          [newPosition.userId]: {
            ...newPosition,
            userName: newPosition.userName || existingUser?.userName,
            color: existingUser ? existingUser.color : newPosition.color,
            lastActive: Date.now()
          }
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Inactivity timeout (e.g., 5 seconds)
    const INACTIVITY_TIMEOUT = 10000;

    // Periodic cleanup of inactive users
    const inactivityInterval = setInterval(() => {
      const now = Date.now();
      setOtherUsers(prev => {
        const updatedUsers = {...prev};
        let hasChanges = false;

        Object.keys(prev).forEach((userId: string) => {
          if (now - (prev as any)[userId].lastActive > INACTIVITY_TIMEOUT) {
            delete (updatedUsers as any)[userId];
            hasChanges = true;
          }
        });

        return hasChanges ? updatedUsers : prev;
      });
    }, 5000); // Check every 2 seconds

    // Subscribe to mouse position updates
    const channel = supabase.channel('mouse-positions')
      .on('broadcast', { event: 'mouse-move' }, (payload) => {
        const { userId: senderId, userName, x, y, color } = payload.payload as UserMousePosition;
        
        // Ignore updates from the current user
        if (senderId !== userId) {
          updateUserPosition({ userId: senderId, userName, x, y, color, lastActive: Date.now() });
        }
      })
      .on('broadcast', { event: 'draw' }, (payload) => {
        const { userId: senderId, userName, points, color } = payload.payload as DrawEvent;

        setDrawings(prev => [ ...prev, { userId, userName, points, color, lastActive: Date.now() } ])
      })
      .subscribe();

    // Track mouse movement on the canvas
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Broadcast mouse position
        supabase.channel('mouse-positions').send({
          type: 'broadcast',
          event: 'mouse-move',
          payload: { userId, userName, x, y, color: userColor, lastActive: Date.now() }
        });
      }
    };

    // Add event listener to the canvas
    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      currentCanvas.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup subscription and event listener
    return () => {
      clearInterval(inactivityInterval);
      channel.unsubscribe();
      if (currentCanvas) {
        currentCanvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [userId, userColor, updateUserPosition]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    setIsDrawing(true);
    const pointerPosition = e.target.getStage()?.getPointerPosition();
    if (pointerPosition) {
      const { x, y } = pointerPosition;
      setCurrentPoints([x, y]);
    }
  };

  const handleMouseMoveDraw = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    const pointerPosition = e.target.getStage()?.getPointerPosition();
    if (pointerPosition) {
      const { x, y } = pointerPosition;
      setCurrentPoints(prev => [...prev, x, y]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Broadcast the drawing event to other users
      supabase.channel('mouse-positions').send({
        type: 'broadcast',
        event: 'draw',
        payload: { userId, userName, points: currentPoints, color: userColor, lastActive: Date.now() }
      });

      // Save to the database
      supabase
        .from('drawings')
        .insert([{ user_id: userId, user_name: userName, points: currentPoints, color: userColor, project_id: projectId }])
        .then();

      setCurrentPoints([]);
    }
  };

  return (
    <div className='w-full h-full inset-0 z-50 fixed bg-white'>
      <WhiteBoardHeader onClose={onClose} />
      <div
        ref={canvasRef}
        className="relative w-full h-full"
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveDraw}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* Draw current user's ongoing path */}
            {isDrawing && (
              <Line points={currentPoints} stroke={userColor} strokeWidth={5} tension={0.5} lineJoin="round" lineCap="round" />
            )}

            {/* Render other users' paths */}
            {drawings.map((drawing, index) => (
              <Line key={index} points={drawing.points} stroke={drawing.color} strokeWidth={5} tension={0.5} lineJoin="round" lineCap="round" />
            ))}
          </Layer>
        </Stage>
        {/* Render other users' cursors */}
        {Object.values(otherUsers).map((user) => (
          <div 
            key={user.userId} 
            className="absolute"
            style={{
              left: user.x,
              top: user.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex items-center">
              <MousePointer2
                className="cursor-pointer w-5 h-5"
                fill={user.color}
                style={{
                  color: user.color,
                }}
              />
              {user.userName && (
                <div 
                  className="ml-2 px-2 py-1 rounded-md text-xs font-medium"
                  style={{ 
                    backgroundColor: user.color, 
                    color: 'white' 
                  }}
                >
                  {user.userName}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};