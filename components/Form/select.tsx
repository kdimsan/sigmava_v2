// components/Form/SelectField.tsx
"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export default function SelectField({
  label,
  placeholder = "Selecione uma opção",
  options,
  value,
  onChange,
  required,
  disabled,
  className = "",
  name,
}: SelectFieldProps) {
  return (
    
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] mb-2 font-semibold tracking-wide text-gray-700 uppercase md:text-xs">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {name && (
        <input type="hidden" name={name} value={value} />
      )}
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          className={`
            w-full rounded-md px-4 py-3 text-sm flex justify-between items-center transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}
            ${!value && !disabled ? "text-gray-400 bg-gray-50" : ""}
            ${value && !disabled ? "text-gray-900 bg-gray-100" : ""}
          `}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            side="bottom"
            className="bg-white border shadow-md rounded-md mt-1 z-50 w-[var(--radix-select-trigger-width)]"
          >
            <Select.Viewport className="py-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={`
                    flex items-center justify-between px-4 py-2 text-sm cursor-pointer font-semibold
                    hover:bg-blue-50 transition-colors
                    data-[state=checked]:text-blue-600
                  `}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="h-4 w-4 text-blue-600" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
