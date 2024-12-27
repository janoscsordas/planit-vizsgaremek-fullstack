
export default function ColorPicker({ 
    selectedColor, 
    setSelectedColor 
}: {
    selectedColor: string,
    setSelectedColor: (color: string) => void
}) {
    return (
        <div className="absolute bottom-20 left-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(color => (
                <div
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer ${color === selectedColor ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                />
            ))}
        </div>
    )
};