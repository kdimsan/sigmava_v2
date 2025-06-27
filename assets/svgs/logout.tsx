import React from "react";
import { props } from "./calendar";

export default function Logout({className}: props) {
  return (
    <svg
    className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.3 1.64038C2.34245 2.62847 1 4.65746 1 7.00001C1 10.3137 3.68629 13 7 13C10.3137 13 13 10.3137 13 7.00001C13 4.65746 11.6575 2.62847 9.7 1.64038"
        stroke="#005BE3"
        strokeLinecap="round"
      />
      <path
        d="M7 1V8.2"
        stroke="#005BE3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
