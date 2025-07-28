import { redirect } from "next/navigation";
import Header from "@/components/Header/Header";
import { createClient } from "@/utils/supabase/server";
import { getClientProfile, getUserProfile } from "@/lib/auth";

import { getDepartments } from "../../admin/dashboard/actions/departments";
import { getLogoUrlByLicense } from "../../actions/getLicenseLogo";
import MobileHeader from "@/components/MobileHeader";
import { Toaster } from "react-hot-toast";
import { getUser } from "./actions/user";

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

  const userProfile = await getUser();

  const departments = await getDepartments(userProfile?.license_id);

  let userData = {
    name: userProfile?.name!,
    avatar: data.user.user_metadata?.avatar_url,
    logo: "",
    role: "user",
    email: userProfile?.email!,
  };

  const logoUrl = await getLogoUrlByLicense(userProfile!.license_id);
  userData.logo = logoUrl;

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="">
        <Header user={userData} departments={departments} />
      </div>
      <Toaster position="top-center" />
      <main className="flex-1">{children}</main>

      <div className="block md:hidden">
        <MobileHeader />
      </div>
    </div>
  );
}
