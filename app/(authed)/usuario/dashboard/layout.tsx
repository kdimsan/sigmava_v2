import { redirect } from "next/navigation";
import Header from "@/components/Header/Header";
import { createClient } from "@/utils/supabase/server";
import { getClientProfile } from "@/lib/auth";

import { getDepartments } from "../../admin/actions/departments";
import { getLogoUrlByLicense } from "../../actions/getLicenseLogo";
import MobileHeader from "@/components/MobileHeader";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const userProfile = await getClientProfile(data.user.email!);
  const departments = await getDepartments();

  const headerUser = {
    name: userProfile?.name!,
    role: userProfile?.role!,
    avatar: data.user.user_metadata?.avatar_url,
  };

  let userData = {
    name: headerUser.name,
    avatar: headerUser.avatar,
    logo: "",
  };

  if (userProfile?.role !== "superuser") {
    const logoUrl = await getLogoUrlByLicense(userProfile!.license_id);
    userData.logo = logoUrl;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="hidden md:block">
        <Header user={userData} departments={departments} />
      </div>

      <main className="flex-1">{children}</main>

      <div className="block md:hidden">
        <MobileHeader />
      </div>
    </div>
  );
}
