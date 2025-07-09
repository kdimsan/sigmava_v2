import { redirect } from "next/navigation";
import Header from "@/components/Header/Header";
import { createClient } from "@/utils/supabase/server";
import { checkIfSuperUser, getUserProfile } from "@/lib/auth";
import { getDepartments } from "./actions/departments";
import { getLogoUrlByLicense } from "../../actions/getLicenseLogo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const userProfile = await getUserProfile(data.user.id);
  const departments = await getDepartments();

  const headerUser = {
    name: userProfile?.full_name || data.user.email?.split("@")[0] || "Usuário",
    role: userProfile?.role!,
    avatar: data.user.user_metadata?.avatar_url,
  };

  let userData = {
    name: headerUser.name,
    role: headerUser.role,
    avatar: headerUser.avatar,
    logo: "",
  };

  if (userProfile?.role !== "superuser") {
    const logoUrl = await getLogoUrlByLicense(userProfile!.license_id);
    userData.logo = logoUrl;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-2">
      <Header user={userData} departments={departments} />

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <span className="text-sm text-gray-500">SIGMA</span>
          <span className="text-xs text-gray-400 ml-2">▲</span>
        </div>
      </footer>
    </div>
  );
}
