'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithGoogle(formData: FormData) {
    const role = formData.get('role') as string || 'consumer'
    const supabase = await createClient()

    // Pass the role in query params of redirectTo or options.data if Supabase supports it.
    // Ideally we put it in options.queryParams => Supabase Auth passes it back to callback.
    // OR options.data => It gets stored in raw_user_meta_data on signup! This is what we want.

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?role=${role}`,
        },
    })

    if (error) {
        console.error('Login Error:', error)
        redirect(`/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
    }

    if (data.url) {
        redirect(data.url)
    }

    redirect('/auth/auth-code-error?error=NoUrlReturned')
}
