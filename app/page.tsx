import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">MansaOferta.com.ar</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">Conectando Pymes con vos.</p>
    </main>
  );
}
