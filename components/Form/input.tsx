import FieldWrapper from "./fieldWrapper";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function Input({ label, error, required, className, ...props }: InputProps) {
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-md bg-gray-100 border border-transparent focus:border-gray-400 focus:outline-none transition-all ${className}`}
      />
    </FieldWrapper>
  );
}
