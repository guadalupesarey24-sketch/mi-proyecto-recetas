'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';

// 1. Definimos la estructura exacta que devuelve la nueva API (DummyJSON)
interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  image: string;
}

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Recipe[]>([]);
  const [recetasFiltradas, setRecetasFiltradas] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Consumo de la nueva API con fetch y async/await
  useEffect(() => {
    async function cargarRecetas() {
      try {
        const response = await fetch('https://dummyjson.com/recipes');
        if (!response.ok) throw new Error('Error al conectar con DummyJSON API');
        const data = await response.json();
        
        // DummyJSON devuelve un objeto que contiene un arreglo llamado "recipes"
        const listado = data.recipes || [];
        setRecetas(listado);
        setRecetasFiltradas(listado);
      } catch (error) {
        console.warn("Conexión fallida. Activando datos locales:", error);
        // Datos de respaldo estructurados con el nuevo formato por seguridad académica
        const respaldo: Recipe[] = [
          { id: 1, name: 'Tacos al Pastor', cuisine: 'Mexican', image: 'https://unsplash.com' },
          { id: 2, name: 'Pizza Margherita', cuisine: 'Italian', image: 'https://unsplash.com' }
        ];
        setRecetas(respaldo);
        setRecetasFiltradas(respaldo);
      } finally {
        setLoading(false);
      }
    }
    cargarRecetas();
  }, []);

  // 3. Función de filtrado en tiempo real adaptada al nuevo campo "name"
  const handleSearch = (term: string) => {
    const filtradas = recetas.filter((receta) =>
      receta.name.toLowerCase().includes(term.toLowerCase())
    );
    setRecetasFiltradas(filtradas);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">📖 Catálogo de Recetas</h1>
      <p className="mt-2 text-gray-600"></p>

      {/* Barra de búsqueda interactiva */}
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-orange-500 font-medium">Cargando exquisitas recetas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recetasFiltradas.map((receta) => (
            <div key={receta.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
              <img 
                src={receta.image} 
                alt={receta.name} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Respaldo visual si la imagen de la API llegara a fallar
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
          ))}
        </div>
      )}
    </div>
  );
}
