import React from "react";
import { props } from "./calendar";

export default function CallGreen({ className }: props) {
  return (
    <svg
    className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 14.6175C13.4335 15.3956 6.79397 15.2386 3.36349 10.7482C0.5 7 0.724179 2.92096 1.29289 1H5.16519V3.80995L3.30026 4.66447C3.47328 6.30939 4.09486 7.82173 5.0413 9.07862C6.57016 11.109 9.37841 12.4949 11.6236 12.6502L12.1901 10.8348H15V14.6175Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
