import React from "react";
import { props } from "./calendar";

export default function Dismiss({className}: props) {
  return (
    <svg
    className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="#FF4D4D" />
      <path d="M22 14L14 22" stroke="white" strokeLinecap="round" />
      <path d="M22 22L14 14" stroke="white" strokeLinecap="round" />
    </svg>
  );
}
