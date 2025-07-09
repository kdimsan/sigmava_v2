import ProfileSettings from "@/components/ProfileSettings";
import { getUser } from "../actions/user";
import { getLicenses } from "@/app/(authed)/superuser/dashboard/actions/licenses";


export default async function Home() {
  const user = await getUser();
  const licenses = await getLicenses();

  
  return (
    <div className="min-h-screen">
      <ProfileSettings licenses={licenses} user={user!} />
    </div>
  );
}