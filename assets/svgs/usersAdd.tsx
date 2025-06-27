import React from "react";
import { props } from "./calendar";

export default function UsersAdd({className}: props) {
  return (
    <svg
    className={className}
      width="48"
      height="23"
      viewBox="0 0 50 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="39" cy="8" r="4" stroke="#005BE3" />
      <circle cx="25" cy="5" r="4" stroke="#005BE3" />
      <circle cx="11" cy="8" r="4" stroke="#005BE3" />
      <circle cx="45" cy="17" r="4" stroke="#005BE3" />
      <path d="M45 15V19" stroke="#005BE3" strokeLinecap="round" />
      <path d="M47 17L43 17" stroke="#005BE3" strokeLinecap="round" />
      <path
        d="M49 23.5C49 22.6953 49 22 49 22M29 23.5V20C29 18 31 17 32 16.5L36 14.5H39.5"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 24C15 19 15 17.5 15 17.5C15 15.5 17 14.5 18 14L22 12H25.5"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 15H8L4 17C3 17.5 1 18.5 1 20.5C1 20.5 1 19 1 24H49"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.9998 12H28.4998L32.4998 14C32.6499 14.075 33.5632 14.5317 34.272 15.1403"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 15H13L15 16"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
