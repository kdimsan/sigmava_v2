import React from "react";
import { getDepartments } from "@/app/(authed)/admin/actions/departments";
import ScheduleCallPage from "@/components/ScheduleCallPage";

export default async function ScheduleCall() {
    const dep = await getDepartments();
  return (
    <ScheduleCallPage departaments={dep} />
  );
}
