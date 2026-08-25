'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logotipo / Nombre del proyecto */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-orange-600 tracking-tight hover:opacity-90 transition">
          <span>🍳</span> miProyectoRecetas
        </Link>

        {/* Enlaces de Navegación */}
        <div className="flex items-center gap-6">
          <Link href="/recetas" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition">
            Catálogo
          </Link>
          <Link href="/login" className="text-sm font-medium px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition shadow-sm">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}
