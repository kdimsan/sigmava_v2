"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { checkIfSuperUser } from "@/lib/auth";

export async function login(formData: FormData) {
  const supabase = await createClient();

  console.log("ofoafdas", formData);
  

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const authData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(authData);

  console.log(error);
  

  if (error) {
    redirect("/error");
  }

  console.log("loginData", data);
  

  const isSuperUser = await checkIfSuperUser(data.user.id);

  if (isSuperUser) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

// export async function signup(formData: FormData) {
//   const supabase = await createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     redirect("/error");
//   }

//   revalidatePath("/", "layout");
//   redirect("/");
// }
