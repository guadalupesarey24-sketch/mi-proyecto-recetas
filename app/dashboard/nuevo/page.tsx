'use client';
 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NuevaRecetaPage() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Almuerzo');
  const [instrucciones, setInstrucciones] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Guardando receta en la base de datos...');

    try {
      // Obtener el ID del usuario actualmente autenticado (el Chef)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMsg('Error: Debes iniciar sesión para publicar.');
        setLoading(false);
        return;
      }

      // Insertar la receta vinculando el chef_id con el id del usuario
      const { error } = await supabase
        .from('recetas')
        .insert([
          {
            titulo,
            categoria,
            instrucciones,
            chef_id: user.id
          }
        ]);

      if (error) throw error;

      setMsg('¡ Receta guardada con éxito! Redirigiendo...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error: any) {
      setMsg(` Error al guardar: ${error.message || 'Inténtalo de nuevo'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">👨‍🍳 Publicar Nueva Receta</h2>
      <p className="text-sm text-gray-500 mb-6">Completa los campos para añadir tu plato al Proyecto Integrador.</p>

      {msg && (
        <p className="mb-4 text-sm font-medium p-3 rounded bg-orange-50 text-orange-700 border border-orange-100">
          {msg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la Receta</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Ceviche de Camarón Ecuatoriano"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
          >
            <option value="Entradas">Entradas</option>
            <option value="Almuerzo">Almuerzo / Plato Fuerte</option>
            <option value="Postres">Postres</option>
            <option value="Bebidas">Bebidas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Instrucciones de Preparación</label>
          <textarea
            required
            rows={5}
            value={instrucciones}
            onChange={(e) => setInstrucciones(e.target.value)}
            placeholder="Describe el paso a paso de la preparación..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : 'Publicar Receta'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
