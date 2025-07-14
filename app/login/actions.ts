"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { checkIfSuperUser } from "@/lib/auth";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const authData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(authData);

  if (error) {
    redirect("/error");
  }

  let destination: string | null = null;

  // Primeiro, tenta buscar na tabela "profiles"
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile) {
    switch (profile.role) {
      case "superuser":
        destination = "/superuser/dashboard";
        break;
      case "admin":
        destination = "/admin/dashboard";
        break;
      case "employee":
        destination = "/admin/dashboard";
        break;
      default:
        destination = "/usuario/dashboard";
        break;
    }
  } else {
    // Não achou perfil → tenta buscar no "clients"
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", data.user.email)
      .single();

    if (client) {
      destination = "/usuario/dashboard";
    }
  }

  if (destination) {
    redirect(destination);
  } else {
    redirect("/error");
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
