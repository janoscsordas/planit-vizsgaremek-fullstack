"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/utils/supabase';
import { MousePointer2 } from 'lucide-react';
import WhiteBoardHeader from './white-board-header';
import { useUserColor } from './useUserColor';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import WhiteBoardFooter from './white-board-footer';
import ColorPicker from './color-picker';
import ToolPicker from './tool-picker';

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
  tool_type: 'pen' | 'circle' | 'rectangle';
  properties?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
  };
}

type Tool = 'pen' | 'circle' | 'rectangle'

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
  const [isPanning, setIsPanning] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1)
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [shapeStartPos, setShapeStartPos] = useState<{ x: number; y: number } | null>(null);

  const [isSpacePressed, setIsSpacePressed] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const userColor = useUserColor(userId);

  useEffect(() => {
    const fetchDrawings = async () => {
      const { data, error } = await supabase
        .from("drawings")
        .select()
        .eq("project_id", projectId)

      if (error) {
        return null
      }

      setDrawings(data)
    }

    fetchDrawings()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsSpacePressed(true);
        if (stageRef.current) {
          stageRef.current.container().style.cursor = 'grab';
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
        if (stageRef.current) {
          stageRef.current.container().style.cursor = 'default';
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [])

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
    setScale(newScale)

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    setStagePos(newPos)
  }

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (isSpacePressed) {
      setIsPanning(true)
      const stage = stageRef.current
      stage.container().style.cursor = 'grabbing';
      return;
    }

    setIsDrawing(true);
    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    
    if (pointerPos) {
      const x = (pointerPos.x - stage.x()) / scale;
      const y = (pointerPos.y - stage.y()) / scale;

      setShapeStartPos({ x, y })
      setCurrentPoints([x, y])
    }
  };

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
        const { userId: senderId, userName, points, color, tool_type, properties } = payload.payload as DrawEvent;

        setDrawings(prev => [ 
          ...prev, 
          { 
            userId: senderId, 
            userName, 
            points, 
            color, 
            lastActive: Date.now(),
            tool_type: tool_type || 'pen',
            properties
          } 
        ])
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

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current

    if (isPanning && stage) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      setStagePos(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      return;
    }

    if (!isDrawing) return;

    const pointerPos = stage.getPointerPosition();
    if (pointerPos) {
      const x = (pointerPos.x - stage.x()) / scale
      const y = (pointerPos.y - stage.y()) / scale

      if (selectedTool === 'pen') {
        setCurrentPoints(prev => [...prev, x, y]);
      } else {
        setCurrentPoints([shapeStartPos!.x, shapeStartPos!.y, x, y])
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
      if (stageRef.current) {
        stageRef.current.container().style.cursor = isSpacePressed ? 'grab' : 'default'
      }
    }
    
    if (isDrawing) {
      setIsDrawing(false);

      const drawEvent: DrawEvent = {
        userId,
        userName,
        points: currentPoints,
        color: selectedColor,
        lastActive: Date.now(),
        tool_type: selectedTool,
        properties: {}
      }

      // calculate shape-specific properties
      if (selectedTool === 'circle') {
        const [x1, y1, x2, y2] = currentPoints;
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        drawEvent.properties = {
          x: x1,
          y: y1,
          radius
        };
      } else if (selectedTool === 'rectangle') {
        const [x1, y1, x2, y2] = currentPoints;
        drawEvent.properties = {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1)
        };
      }

      // Broadcast the drawing event to other users
      supabase.channel('mouse-positions').send({
        type: 'broadcast',
        event: 'draw',
        payload: drawEvent
      });

      // Save to the database
      supabase
        .from('drawings')
        .insert([{ 
          user_id: userId, 
          user_name: userName, 
          points: currentPoints, 
          color: selectedColor, 
          project_id: projectId, 
          properties: drawEvent.properties
        }])
        .then();

      setCurrentPoints([]);
      setShapeStartPos(null)
    }
  };

  return (
    <div className='w-full h-full inset-0 z-50 fixed bg-white'>
      <WhiteBoardHeader onClose={onClose} handleClear={setDrawings} projectId={projectId} />
      <div
        ref={canvasRef}
        className="relative w-full h-full"
      >
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          x={stagePos.x}
          y={stagePos.y}
          scale={{ x: scale, y: scale }}
          draggable={false}
        >
          {/* Background layer */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={5000}
              height={5000}
              fill="#ffffff"
            />
          </Layer>

          {/* Drawing layer */}
          <Layer>
            {/* Draw current user's ongoing path */}
            {isDrawing && (
              <>
                {selectedTool === 'pen' && (
                  <Line
                    points={currentPoints}
                    stroke={selectedColor}
                    strokeWidth={5}
                    tension={0.5}
                    lineJoin="round"
                    lineCap="round"
                  />
                )}
                {selectedTool === 'circle' && currentPoints.length === 4 && (
                  <Circle
                    x={currentPoints[0]}
                    y={currentPoints[1]}
                    radius={Math.sqrt(
                      Math.pow(currentPoints[2] - currentPoints[0], 2) +
                      Math.pow(currentPoints[3] - currentPoints[1], 2)
                    )}
                    stroke={selectedColor}
                    strokeWidth={2}
                  />
                )}
                {selectedTool === 'rectangle' && currentPoints.length === 4 && (
                  <Rect
                    x={Math.min(currentPoints[0], currentPoints[2])}
                    y={Math.min(currentPoints[1], currentPoints[3])}
                    width={Math.abs(currentPoints[2] - currentPoints[0])}
                    height={Math.abs(currentPoints[3] - currentPoints[1])}
                    stroke={selectedColor}
                    strokeWidth={2}
                  />
                )}
              </>
            )}

            {/* Render other users' drawings */}
            {drawings.map((drawing, index) => {
              if (drawing.tool_type === 'pen' || !drawing.tool_type) {
                return (
                  <Line
                    key={index}
                    points={drawing.points}
                    stroke={drawing.color}
                    strokeWidth={5}
                    tension={0.5}
                    lineJoin="round"
                    lineCap="round"
                  />
                );
              } else if (drawing.tool_type === 'circle' && drawing.properties) {
                return (
                  <Circle
                    key={index}
                    x={drawing.properties.x}
                    y={drawing.properties.y}
                    radius={drawing.properties.radius}
                    stroke={drawing.color}
                    strokeWidth={2}
                  />
                );
              } else if (drawing.tool_type === 'rectangle' && drawing.properties) {
                return (
                  <Rect
                    key={index}
                    x={drawing.properties.x}
                    y={drawing.properties.y}
                    width={drawing.properties.width}
                    height={drawing.properties.height}
                    stroke={drawing.color}
                    strokeWidth={2}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>

        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        <ToolPicker selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

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
      <WhiteBoardFooter userName={userName} zoom={scale} setZoom={setScale} />
    </div>
  );
};