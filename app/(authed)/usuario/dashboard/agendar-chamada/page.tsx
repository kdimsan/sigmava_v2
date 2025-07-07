import React from "react";
import { getDepartments } from "@/app/(authed)/admin/dashboard/actions/departments";
import ScheduleCallPage from "@/components/ScheduleCallPage";
import { getAvaiability } from "@/app/(authed)/admin/dashboard/actions/avaiabilities";
import { getUser } from "../actions/user";

export default async function ScheduleCall() {
    const dep = await getDepartments();
    const avaiability = await getAvaiability(); 
    
  return (
    <ScheduleCallPage departaments={dep} slots={avaiability} />
  );
}
