'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Receta {
  id: number;
  titulo: string;
  categoria: string;
  instrucciones: string;
}

export default function DashboardPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function cargarDatosDashboard() {
      try {
        // 1. Verificar la sesión del usuario 
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // 2. Traer el perfil para saludar por su nombre
        const { data: perfil } = await supabase
          .from('profiles')
          .select('nombre')
          .eq('id', user.id)
          .single();

        if (perfil) setUserName(perfil.nombre);

        // 3. Consultar las recetas que pertenecen única y exclusivamente a este Chef (Filtro por ID)
        const { data: misRecetas, error } = await supabase
          .from('recetas')
          .select('*')
          .eq('chef_id', user.id)
          .order('id', { ascending: false });

        if (error) throw error;
        setRecetas(misRecetas || []);

      } catch (error) {
        console.error('Error en dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatosDashboard();
  }, [router]);

  // Función para eliminar recetas (Operación DELETE del CRUD solicitado)
  const handleEliminar = async (id: number) => {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta exquisita receta?');
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('recetas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar la interfaz eliminando el elemento del estado local
      setRecetas(recetas.filter(r => r.id !== id));
      alert('¡ Receta eliminada correctamente!');
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  // Función para cerrar sesión de forma segura
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Encabezado del Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900"> ¡Hola, {userName || 'Chef'}!</h1>
          <p className="text-gray-500 mt-1">Bienvenido a tu panel de administración culinaria.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/nuevo" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition flex items-center gap-2">
            <span>➕</span> Nueva Receta
          </Link>
          <button onClick={handleSignOut} className="px-4 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal: Listado CRUD */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Tus Publicaciones Creadas</h2>

      {loading ? (
        <p className="text-orange-500 font-medium">Cargando tus recetas...</p>
      ) : recetas.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-white">
          <span className="text-4xl">🍳</span>
          <p className="mt-4 text-gray-600 font-medium">Aún no has publicado recetas en este proyecto.</p>
          <p className="text-sm text-gray-400 mt-1">Haz clic en "Nueva Receta" para iniciar tu portafolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recetas.map((receta) => (
            <div key={receta.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    {receta.categoria}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-3">{receta.titulo}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3 whitespace-pre-line">{receta.instrucciones}</p>
              </div>
              
              {/* Botón de control de eliminación */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleEliminar(receta.id)}
                  className="px-4 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
