import { NextRequest, NextResponse } from "next/server";
import { getAvaiabilityByLicenseAndDepartment } from "@/app/(authed)/admin/dashboard/actions/avaiabilities";

export async function POST(req: NextRequest) {
  const { licenseId, departmentId } = await req.json();

  if (!licenseId || !departmentId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const slots = await getAvaiabilityByLicenseAndDepartment(licenseId, departmentId);
  return NextResponse.json(slots);
}
