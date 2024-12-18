"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/utils/supabase';
import { MousePointer2 } from 'lucide-react';

interface UserMousePosition {
  userId: string;
  x: number;
  y: number;
  color: string;
  lastActive: number;
}

export default function Whiteboard({ userId }: { userId: string }) {
  const [otherUsers, setOtherUsers] = useState<UserMousePosition[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate a random pastel color for the user
  const userColor = `hsl(${Math.random() * 360}, 70%, 80%)`;

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
        const { userId: senderId, x, y, color } = payload.payload as UserMousePosition;
        
        // Ignore updates from the current user
        if (senderId !== userId) {
          updateUserPosition({ userId: senderId, x, y, color, lastActive: Date.now() });
        }
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
          payload: { userId, x, y, color: userColor, lastActive: Date.now() }
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

  return (
    <div className='w-[calc(100dvw-305px)] h-[600px] overflow-auto bg-white border-4 border-muted-foreground'>
      <div
        ref={canvasRef}
        className="relative w-[5000px] h-[5000px]"
      >
        {/* Render other users' cursors */}
        {Object.values(otherUsers).map((user) => (
          <MousePointer2
            key={user.userId}
            className="absolute cursor-pointer w-5 h-5"
            fill={user.color}
            style={{
              left: user.x,
              top: user.y,
              color: user.color,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};