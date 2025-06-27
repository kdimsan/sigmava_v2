import React from "react";
import { props } from "./calendar";

export default function User({className}: props) {
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
      <path
        d="M21 21H1C1 16 1 17 1 17C1 15 3 14 4 13.5L8 11.5H11.5"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21C21 16 21 17 21 17C21 15 19 14 18 13.5L14 11.5H10.5"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
