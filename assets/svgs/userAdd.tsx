import React from "react";
import { props } from "./calendar";

export default function UserAdd({className}: props) {
  return (
    <svg
    className={className}
      width="20"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="5" r="4" stroke="#005BE3" />
      <circle cx="17" cy="14" r="4" stroke="#005BE3" />
      <path d="M17 12V16" stroke="#005BE3" strokeLinecap="round" />
      <path d="M19 14L15 14" stroke="#005BE3" strokeLinecap="round" />
      <path
        d="M21 19C21 19 21 20.1952 21 21H1C1 16 1 17 1 17C1 15 3 14 4 13.5L8 11.5H11.5"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
