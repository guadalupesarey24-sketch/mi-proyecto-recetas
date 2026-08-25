import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-4">📖 Mi Proyecto de Recetas</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Bienvenido a la plataforma interactiva de cocina para el Proyecto Integrador.
      </p>
      
      <div className="flex gap-4">
        <Link href="/recetas" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
          Ver Recetas
        </Link>
        <Link href="/dashboard" className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition">
          Ir al Dashboard
        </Link>
      </div>
    </main>
  );
}
