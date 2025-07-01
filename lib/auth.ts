import { createClient } from '@/utils/supabase/client'

export interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name?: string
 role: "superuser" | "admin" | "user"
  created_at: string
  updated_at: string
  license_id: number
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil do usuário:', error)
    return null
  }

  return data
}

export async function checkIfSuperUser(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  
  return profile?.role === "superuser";
}

export async function getCurrentUserWithProfile() {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { user: null, profile: null, isSuperUser: false }
  }

  const profile = await getUserProfile(user.id)
  const isSuperUser = profile?.role === "superuser";

  return { user, profile, isSuperUser }
}