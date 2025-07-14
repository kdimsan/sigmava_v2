import React from "react";
import { getDepartments } from "@/app/(authed)/admin/dashboard/actions/departments";
import ScheduleCallPage from "@/components/ScheduleCallPage";
import {
  getAvaiability,
  getAvaiabilityByLicenseAndDepartment,
} from "@/app/(authed)/admin/dashboard/actions/avaiabilities";
import { createClient } from "@/utils/supabase/server";
import { getUserProfile } from "@/lib/auth";

export default async function ScheduleCall() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Usuário não autenticado");
  }

  const userProfile = await getUserProfile(user.id);
  if (!userProfile) {
    throw new Error("Perfil do usuário não encontrado");
  }
  const dep = await getDepartments(userProfile.license_id);
  const avaiability = await getAvaiabilityByLicenseAndDepartment(
    userProfile.license_id
  );

  return (
    <ScheduleCallPage
      departaments={dep}
      slots={avaiability}
      licenseId={userProfile.license_id}
    />
  );
}
