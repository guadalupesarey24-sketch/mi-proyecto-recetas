'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState('');

  const handleChange = (value: string) => {
    setTerm(value);
    onSearch(value); // Envía el término al componente padre para filtrar
  };

  return (
    <div className="w-full max-w-md my-6">
      <input
        type="text"
        value={term}
        onChange={(e) => handleChange(e.target.value)}
        placeholder=" Buscar recetas por nombre..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
      />
    </div>
  );
}
