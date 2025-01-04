import { CircleIcon, Minus, SquareIcon, Type } from "lucide-react";

export default function ToolPicker ({
    selectedTool,
    setSelectedTool
}: {
    selectedTool: 'pen' | 'circle' | 'rectangle' | 'text',
    setSelectedTool: (tool: 'pen' | 'circle' | 'rectangle' | 'text') => void
}) {
    return (
        <div className="absolute bottom-20 left-20 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg">
            <button
                className={`p-2 rounded text-black ${selectedTool === 'pen' ? 'bg-green-100' : ''}`}
                onClick={() => setSelectedTool('pen')}
            >
                <Minus className="w-6 h-6" />
            </button>
            <button
                className={`p-2 rounded text-black ${selectedTool === 'circle' ? 'bg-green-100' : ''}`}
                onClick={() => setSelectedTool('circle')}
            >
                <CircleIcon className="w-6 h-6" />
            </button>
            <button
                className={`p-2 rounded text-black ${selectedTool === 'rectangle' ? 'bg-green-100' : ''}`}
                onClick={() => setSelectedTool('rectangle')}
            >
                <SquareIcon className="w-6 h-6" />
            </button>
            <button
                className={`p-2 rounded text-black ${selectedTool === 'text' ? 'bg-green-100' : ''}`}
                onClick={() => setSelectedTool('text')}
            > 
                <Type className="w-6 h-6" />
            </button>
        </div>
    )
}