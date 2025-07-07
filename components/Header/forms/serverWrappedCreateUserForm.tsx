"use server"
// components/Form/ServerWrappedCreateUserForm.tsx
import { getDepartments } from "@/app/(authed)/admin/actions/departments";
import CreateUserForm from "./createUserForm";

export default async function ServerWrappedCreateUserForm() {
  const departments = await getDepartments();

  return <CreateUserForm departments={departments} />;
}
