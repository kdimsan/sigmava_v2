import SelectLicensePage from "@/components/SelectLicensePage";
import { getLicenses } from "@/app/(authed)/superuser/dashboard/actions/licenses";

export default async function SelectLicense() {
  const licenses = await getLicenses();

  return <SelectLicensePage licenses={licenses} />;
}
