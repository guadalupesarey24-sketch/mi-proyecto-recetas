'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
}

// Datos de respaldo 
const RECETAS_RESPALDO: Meal[] = [
  {
    idMeal: '1',
    strMeal: 'Tacos al Pastor',
    strCategory: 'Mexicana',
    strMealThumb: 'https://picsum.photos'
  },
  {
    idMeal: '2',
    strMeal: 'Pizza Margharita',
    strCategory: 'Italiana',
    strMealThumb: 'https://picsum.photos'
  },
  {
    idMeal: '3',
    strMeal: 'Sushi Roll',
    strCategory: 'Japonesa',
    strMealThumb: 'https://picsum.photos'
  }
];


export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Meal[]>([]);
  const [recetasFiltradas, setRecetasFiltradas] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarRecetas() {
      try {
        const response = await fetch('https://themealdb.com', {
          cache: 'no-store' // Evita que guarde errores viejos en caché
        });
        if (!response.ok) throw new Error('Error de servidor');
        const data = await response.json();
        
        if (data.meals) {
          setRecetas(data.meals);
          setRecetasFiltradas(data.meals);
        } else {
          throw new Error('Datos vacíos');
        }
      } catch (error) {
        console.warn("Conexión externa fallida. Activando datos locales del proyecto:", error);
        // Si falla internet, usamos los datos de respaldo

        setRecetas(RECETAS_RESPALDO);
        setRecetasFiltradas(RECETAS_RESPALDO);
      } finally {
        setLoading(false);
      }
    }
    cargarRecetas();
  }, []);

  const handleSearch = (term: string) => {
    const filtradas = recetas.filter((receta) =>
      receta.strMeal.toLowerCase().includes(term.toLowerCase())
    );
    setRecetasFiltradas(filtradas);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">📖 Catálogo del Proyecto Integrador</h1>
      <p className="mt-2 text-gray-600">Contenido interactivo sincronizado para la entrega final.</p>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-orange-500 font-medium">Cargando catálogo...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recetasFiltradas.map((receta) => (
            <div key={receta.idMeal} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
              <img 
                src={receta.strMealThumb} 
                alt={receta.strMeal} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Reemplazo por imagen artificial
                  (e.target as HTMLImageElement).src = 'https://unsplash.com';
                }}
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
