import { supabase } from '../../../services/supabase/supabaseClient'

export async function signInWithPassword(credentials) {
  return supabase.auth.signInWithPassword(credentials)
}

export async function signInWithGoogle(redirectTo) {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}

export async function resetPasswordForEmail(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
}
export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword })
}

export async function signUp(credentials) {
  return supabase.auth.signUp(credentials)
}

export async function exchangeCodeForSession(url) {
  return supabase.auth.exchangeCodeForSession(url)
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
