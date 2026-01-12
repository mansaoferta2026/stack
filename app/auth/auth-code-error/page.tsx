export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">Error de Autenticación</h1>
            <p className="mt-2">Hubo un problema al iniciar sesión. Por favor intenta nuevamente.</p>
            <a href="/login" className="mt-4 text-indigo-600 underline">Volver a intentar</a>
        </div>
    )
}
