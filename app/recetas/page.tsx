'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/lib/supabase'; 

interface Recipe {
  id: number | string;
  name: string;
  cuisine: string;
  image: string;
  isExternal?: boolean; // Para diferenciar el origen
}

//  1. DICCIONARIO DE IMÁGENES REALES SEGÚN TUS CATEGORÍAS DE SUPABASE
//  DICCIONARIO DE AVATARES REALES DE ALTA CALIDAD (Usa enlaces directos de imágenes de Unsplash)
const IMAGENES_POR_CATEGORIA: Record<string, string> = {
  Bebidas: 'https://unsplash.com',
  Postres: 'https://unsplash.com',
  Entradas: 'https://unsplash.com',
  Almuerzo: 'https://unsplash.com',
  Tradicional: 'https://unsplash.com' // Imagen global si falla todo
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
      
      // 1. CARGAR DATOS DE SUPABASE 
           // 1. CARGAR DATOS DE SUPABASE 
      try {
        const { data, error } = await supabase.from('recetas').select('*');
        if (error) throw error;
        
        const mapeadas = (data || []).map((r: any) => {
          // Extraemos y limpiamos la categoría que guardaste
          const categoriaDefinida = r.cuisine || r.categoria || 'Tradicional';
          
          // 🚀 COMPROBACIÓN REFORZADA: 
          // Si r.image no existe, es un texto vacío "", o es el link viejo de unsplash genérico, se considera INVÁLIDO.
          const tieneImagenReal = r.image && r.image.trim() !== '' && !r.image.includes('://unsplash.com');
          
          // Si no tiene una imagen válida subida por el usuario, le inyectamos a la fuerza el avatar según su categoría
          const imagenFinal = tieneImagenReal 
            ? r.image 
            : (IMAGENES_POR_CATEGORIA[categoriaDefinida] || IMAGENES_POR_CATEGORIA['Tradicional']);

          return {
            id: r.id,
            name: r.name || r.titulo || 'Receta de la Comunidad',
            cuisine: categoriaDefinida,
            image: imagenFinal,
            isExternal: false
          };
        });
        setRecetasSupabase(mapeadas);
      } catch (err) {
        console.error("Error cargando Supabase:", err);
      }


      // 2. CONSUMO DE API EXTERNA 
      try {
        
        const response = await fetch('https://dummyjson.com');
        if (!response.ok) throw new Error('La API externa no respondió correctamente.');
        const data = await response.json();
        
        const mapeadasExternas = (data.recipes || []).map((r: any) => ({
          id: `ext-${r.id}`,
          name: r.name,
          cuisine: r.cuisine || 'Internacional',
          image: r.image,
          isExternal: true
        }));
        setRecetasExternas(mapeadasExternas);
      } catch (err: any) {
        console.warn("Manejo de errores activo:", err);
        setErrorMsg('Nota: No se pudo conectar con la API externa. Mostrando datos de respaldo.');
        
        
        setRecetasExternas([
          { id: 'ext-r1', name: 'Tacos al Pastor (Respaldo)', cuisine: 'Mexican', image: 'https://images.://unsplash.comphoto-1551504734-5ee1c4a1479b?w=500' },
          { id: 'ext-r2', name: 'Pizza Margherita (Respaldo)', cuisine: 'Italian', image: 'https://images.://unsplash.comphoto-1604068549290-dea0e4a305ca?w=500' }
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

      {/* Barra de búsqueda interactiva */}
      <div className="mt-6">
        <SearchBar onSearch={(term) => setFiltroTexto(term)} />
      </div>

      {/* Manejo de alertas y errores visuales de la API */}
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
                  className="w-full h-48 object-cover rounded-t-xl bg-gray-100"
                  onError={(e) => {
                  // Si por algún motivo la URL resultante llegara a fallar, este salvavidas inyecta una foto gastronómica estable
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


