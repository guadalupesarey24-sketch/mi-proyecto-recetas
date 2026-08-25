'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
}

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Meal[]>([]);
  const [recetasFiltradas, setRecetasFiltradas] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Consumimos de la API con fetch y async/await
  useEffect(() => {
    async function cargarRecetas() {
      try {
        const response = await fetch('https://themealdb.com');
        if (!response.ok) throw new Error('Error al consultar la API externa');
        const data = await response.json();
        const meals = data.meals || [];
        setRecetas(meals);
        setRecetasFiltradas(meals);
      } catch (error) {
        console.error("Error cargando recetas:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarRecetas();
  }, []);

  // Función para que  filtre el estado en tiempo real
  const handleSearch = (term: string) => {
    const filtradas = recetas.filter((receta) =>
      receta.strMeal.toLowerCase().includes(term.toLowerCase())
    );
    setRecetasFiltradas(filtradas);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">📖 Catálogo del Proyecto Integrador</h1>
      <p className="mt-2 text-gray-600">Contenido interactivo sincronizado en tiempo real con TheMealDB API.</p>

      {/* Barra de búsqueda interactiva */}
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-orange-500 font-medium">Cargando exquisitas recetas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recetasFiltradas.map((receta) => (
            <div key={receta.idMeal} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
              <img 
                src={receta.strMealThumb} 
                alt={receta.strMeal} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                  {receta.strCategory}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-2 line-clamp-1">{receta.strMeal}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
