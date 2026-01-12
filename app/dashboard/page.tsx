import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile to check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role === 'pyme') {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">Panel de Pyme</h1>
                <p>Bienvenido, vendedor.</p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border p-6 shadow-sm">
                        <h3 className="font-semibold">Mis Combos</h3>
                        <p className="text-sm text-gray-500">Gestiona tus ofertas activas</p>
                    </div>
                    <div className="rounded-lg border p-6 shadow-sm">
                        <h3 className="font-semibold">Pedidos</h3>
                        <p className="text-sm text-gray-500">Ver pedidos entrantes</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Mis Compras</h1>
            <p>Bienvenido.</p>
            <div className="mt-4">
                <p>No tienes pedidos recientes.</p>
                <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white">Explorar Ofertas</button>
            </div>
        </div>
    )
}
