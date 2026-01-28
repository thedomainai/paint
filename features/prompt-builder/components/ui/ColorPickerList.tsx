"use client";

interface ColorPickerListProps {
  colors: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ColorPickerList({
  colors,
  onChange,
  onAdd,
  onRemove,
}: ColorPickerListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color, index) => (
        <div key={index} className="relative group">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-12 h-12 rounded-lg border-2 border-muted cursor-pointer"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        +
      </button>
    </div>
  );
}
