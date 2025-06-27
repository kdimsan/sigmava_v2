import React from "react";

export interface props {
  className?: string;
}

export default function Calendar({ className }: props) {
  return (
    <svg
    className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.1999" cy="12.1999" r="2.8" stroke="white" />
      <path
        d="M12.2002 10.8V12.2L12.9002 12.9"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8V1H1V11.5H8"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 4.5H15" stroke="white" />
      <path d="M1 8H15" stroke="white" />
      <path d="M4.5 4.5L4.5 11.5" stroke="white" />
      <path d="M8 4.5L8 11.5" stroke="white" />
      <path d="M11.5 4.5L11.5 8" stroke="white" strokeLinecap="round" />
    </svg>
  );
}
