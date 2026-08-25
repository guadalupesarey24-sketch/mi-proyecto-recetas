'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Iniciando sesión...');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMsg(`❌ Error: ${error.message}`);
    } else {
      setMsg('¡✅ Ingreso correcto! Redirigiendo panel...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    }
  }; // ← Aquí cerramos correctamente la función handleLogin

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Iniciar Sesión</h2>
        {msg && <p className="mb-4 text-sm text-center font-medium text-orange-600 bg-orange-50 p-2 rounded">{msg}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none" 
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none" 
          />
        </div>
        <button type="submit" className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition shadow-sm">
          Ingresar
        </button>
      </form>
    </div>
  );
}
