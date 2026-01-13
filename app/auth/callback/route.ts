import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const { searchParams } = new URL(request.url)
    const origin = `${protocol}://${host}`
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const role = searchParams.get('role')
            if (role === 'pyme') {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await supabase
                        .from('profiles')
                        .update({ role: 'pyme' })
                        .eq('id', user.id)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                // Determine proto for forwarded host, usually https in prod
                const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
                return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            console.error('Auth Error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=NoCodeProvided`)
}
