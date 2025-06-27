import React from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FieldWrapper({ label, error, required, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
