'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMsg('Autenticando usuario...');

    try {
      //  Autenticación directa en el cliente para forzar el guardado inmediato de cookies
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg(`Error: ${error.message}`);
        setLoading(false);
      } else if (data?.session) {
        setMsg('¡Sesión iniciada con éxito! Redirigiendo...');
        
        // Damos 300ms para asegurar que el navegador asiente las cookies locales antes del salto
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 300);
      } else {
        setMsg('No se pudo establecer la sesión.');
        setLoading(false);
      }
    } catch (error) {
      setMsg('Ocurrió un error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Iniciar Sesión</h2>
        
        {msg && (
          <p className="mb-4 text-sm text-center font-medium text-orange-600 bg-orange-50 p-2 rounded">
            {msg}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            required 
            disabled={loading} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-gray-100" 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            required 
            disabled={loading} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-gray-100" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition shadow-sm disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
