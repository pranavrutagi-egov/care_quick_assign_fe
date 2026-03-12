import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface CounterProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export function Counter({
  value = 0,
  min = 0,
  max,
  step = 1,
  onChange,
}: CounterProps) {
  const [count, setCount] = React.useState(value);

  const update = (newValue: number) => {
    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;

    setCount(newValue);
    onChange?.(newValue);
  };

  const increment = () => update(count + step);
  const decrement = () => update(count - step);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) update(val);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={count <= min}
        className="border-gray-300"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={count}
        onChange={handleInput}
        className="w-24 text-center border-gray-300"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={increment}
        disabled={max !== undefined && count >= max}
        className="border-gray-300"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
