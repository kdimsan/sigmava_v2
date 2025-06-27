import React from "react";
import { props } from "./calendar";

export default function Bell({className}: props) {
  return (
    <svg
    className={className}
      width="16"
      height="20"
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 3C5.26146 3 2.23077 5.68629 2.23077 9V13.7143L1 18H17L15.7692 13.7143V9C15.7692 5.68629 12.7385 3 9 3Z"
        stroke="#005BE3"
        strokeLinejoin="round"
      />
      <path d="M5.5 1H12.5" stroke="#005BE3" strokeLinecap="round" />
      <path
        d="M11.8178 18.2727C11.8178 19.7789 10.5968 21 9.09055 21C7.58432 21 6.36328 19.7789 6.36328 18.2727"
        stroke="#005BE3"
      />
    </svg>
  );
}
