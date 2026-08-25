import { ChevronDownIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger, PopoverTitle, PopoverDescription } from "./popover";
import { HexColorPicker } from "react-colorful";

export default function ColorPickerPopover({
  color,
  setColor,
  label,
  description,
}: {
  color: string;
  setColor: (color: string) => void;
  label: string;
  description: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="sm"><div className="mr-1 h-3 w-3 rounded-full border" style={{ backgroundColor: color }} /><span className="text-sm">{label}</span><ChevronDownIcon size={16} /></Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-auto w-min">
        <PopoverHeader>
          <PopoverTitle>{label}</PopoverTitle>
          <PopoverDescription>{description}</PopoverDescription>
        </PopoverHeader>
        <HexColorPicker className="mt-2" color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  );
}
