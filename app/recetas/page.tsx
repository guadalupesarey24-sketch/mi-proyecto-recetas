'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/lib/supabase'; 

interface Recipe {
  id: number | string;
  name: string;
  cuisine: string;
  image: string;
  isExternal?: boolean;
}

// 🍳 Diccionario de avatares reales mapeados a tus categorías exactas de Supabase
const IMAGENES_POR_CATEGORIA: Record<string, string> = {
  Bebidas: 'https://unsplash.com',
  Postres: 'https://unsplash.com',
  Entradas: 'https://unsplash.com',
  Almuerzo: 'https://unsplash.com',
  Tradicional: 'https://unsplash.com'
};

export default function RecetasPage() {
  const [tab, setTab] = useState<'comunidad' | 'externa'>('comunidad');
  const [recetasSupabase, setRecetasSupabase] = useState<Recipe[]>([]);
  const [recetasExternas, setRecetasExternas] = useState<Recipe[]>([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function cargarTodo() {
      setLoading(true);
      setErrorMsg('');
      
      // A. CARGAR DATOS DE SUPABASE (Tus columnas reales: titulo y categoria)
      try {
        const { data, error } = await supabase.from('recetas').select('*');
        if (error) throw error;
        
        const mapeadas = (data || []).map((r: any) => {
          // Capturamos el nombre exacto de tu columna 'categoria'
          const categoriaDefinida = r.categoria || 'Tradicional';
          
          // Asignamos el avatar de Unsplash correspondiente de forma forzada
          const imagenFinal = IMAGENES_POR_CATEGORIA[categoriaDefinida] || IMAGENES_POR_CATEGORIA['Tradicional'];

          return {
            id: r.id,
            name: r.titulo || 'Receta de la Comunidad', // Mapeamos tu 'titulo' al campo visual 'name'
            cuisine: categoriaDefinida,
            image: imagenFinal,
            isExternal: false
          };
        });
        setRecetasSupabase(mapeadas);
      } catch (err) {
        console.error("Error cargando Supabase:", err);
      }

      // B. CONSUMO DE API EXTERNA (TheMealDB para producción)
      try {
        const response = await fetch('https://themealdb.com');
        if (!response.ok) throw new Error('La API externa no respondió correctamente.');
        const data = await response.json();
        
        const listadoMeals = data.meals || [];
        const mapeadasExternas = listadoMeals.slice(0, 9).map((m: any) => ({
          id: `ext-${m.idMeal}`,
          name: m.strMeal,
          cuisine: 'Seafood',
          image: m.strMealThumb,
          isExternal: true
        }));
        setRecetasExternas(mapeadasExternas);
      } catch (err: any) {
        console.warn("Manejo de errores activo:", err);
        setErrorMsg('Nota: No se pudo conectar con la API externa. Mostrando datos de respaldo.');
        
        setRecetasExternas([
          { id: 'ext-r1', name: 'Tacos al Pastor (Respaldo)', cuisine: 'Mexican', image: 'https://unsplash.com' },
          { id: 'ext-r2', name: 'Pizza Margherita (Respaldo)', cuisine: 'Italian', image: 'https://unsplash.com' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    cargarTodo();
  }, []);

  const recetasActuales = tab === 'comunidad' ? recetasSupabase : recetasExternas;
  const recetasFiltradas = recetasActuales.filter((r) =>
    r.name.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">📖 Catálogo de Recetas</h1>
      
      <div className="flex gap-4 mt-6 border-b border-gray-200 pb-px">
        <button
          onClick={() => setTab('comunidad')}
          className={`pb-2 text-sm font-semibold transition border-b-2 px-2 ${
            tab === 'comunidad' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
           Recetas Usuarios
        </button>
        <button
          onClick={() => setTab('externa')}
          className={`pb-2 text-sm font-semibold transition border-b-2 px-2 ${
            tab === 'externa' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
           Recetas APiS
        </button>
      </div>

      <div className="mt-6">
        <SearchBar onSearch={(term) => setFiltroTexto(term)} />
      </div>

      {errorMsg && tab === 'externa' && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      {loading ? (
        <p className="text-orange-500 font-medium animate-pulse mt-6">Cargando recetas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recetasFiltradas.length > 0 ? (
            recetasFiltradas.map((receta) => (
              <div key={receta.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
                <img 
                  src={receta.image} 
                  alt={receta.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://unsplash.com';
                  }}
                />
                <div className="p-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    {receta.cuisine}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2 line-clamp-1">{receta.name}</h3>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-4 col-span-full">No se encontraron recetas en esta sección.</p>
          )}
        </div>
      )}
    </div>
  );
}
