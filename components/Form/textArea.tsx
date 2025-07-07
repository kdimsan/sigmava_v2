import FieldWrapper from "./fieldWrapper";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function TextArea({ label, error, required, className, ...props }: TextAreaProps) {
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <textarea
        {...props}
        className={`w-full px-4 py-3 rounded-md bg-gray-100 border border-transparent focus:border-gray-400 focus:outline-none transition-all ${className}`}
      />
    </FieldWrapper>
  );
}
