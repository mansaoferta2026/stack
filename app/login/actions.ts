'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle(formData: FormData) {
    const role = formData.get('role') as string || 'consumer'
    const supabase = await createClient()

    // Pass the role in query params of redirectTo or options.data if Supabase supports it.
    // Ideally we put it in options.queryParams => Supabase Auth passes it back to callback.
    // OR options.data => It gets stored in raw_user_meta_data on signup! This is what we want.

    // Priority 1: x-forwarded-host (passed by proxies like GKE Ingress)
    // Priority 2: host header
    // Priority 3: fallback to localhost
    const host = (await headers()).get('x-forwarded-host') || (await headers()).get('host') || 'localhost:3000'

    let proto = (await headers()).get('x-forwarded-proto') || 'http'

    // Smart proto detection: if host is not localhost, it's almost certainly https in prod
    if (!host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('0.0.0.0')) {
        proto = 'https'
    }

    const baseUrl = `${proto}://${host}`

    console.log('--- Auth Debug ---')
    console.log('Detected Host:', host)
    console.log('Detected Proto:', proto)
    console.log('Base URL:', baseUrl)

    const redirectUrl = `${baseUrl}/auth/callback?role=${role}`
    console.log('Requesting Redirect To:', redirectUrl)

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
        },
    })

    if (error) {
        console.error('--- Login Error ---')
        console.error('Code:', error.name)
        console.error('Message:', error.message)
        redirect(`/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
    }

    console.log('Supabase Generated OAuth URL:', data.url)

    if (data.url) {
        console.log('Redirecting to Supabase OAuth...')
        redirect(data.url)
    }

    console.error('Auth Error: No URL returned from Supabase')
    redirect('/auth/auth-code-error?error=NoUrlReturned')
}
