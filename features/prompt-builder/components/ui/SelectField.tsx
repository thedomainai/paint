"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[] | SelectOption[];
  placeholder?: string;
  className?: string;
}

function isSelectOptionArray(
  options: readonly string[] | SelectOption[]
): options is SelectOption[] {
  return options.length > 0 && typeof options[0] === "object";
}

export function SelectField({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
}: SelectFieldProps) {
  const normalizedOptions: SelectOption[] = isSelectOptionArray(options)
    ? options
    : options.map((opt) => ({ value: opt, label: opt }));

  // Find the label for the current value to display in the trigger
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {normalizedOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
