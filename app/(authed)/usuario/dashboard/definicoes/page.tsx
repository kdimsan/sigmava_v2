import ProfileSettings from "@/components/ProfileSettings";
import { getUser } from "../actions/user";
import { getLicenses } from "@/app/(authed)/superuser/dashboard/actions/licenses";


export default async function ProfileDef() {
  const user = await getUser();
  const licenses = await getLicenses();

  
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6">
      <ProfileSettings licenses={licenses} user={user!} />
    </div>
  );
}