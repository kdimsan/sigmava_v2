import React from "react";
import { props } from "./calendar";

export default function Clock({className}: props) {
  return (
    <svg
    className={className}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="10" stroke="#005BE3" />
      <path
        d="M11 5V11L15 15"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
