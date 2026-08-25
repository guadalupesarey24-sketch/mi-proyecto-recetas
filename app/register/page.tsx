'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('lector');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Procesando registro...');
    
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setMsg(` Error: ${error.message}`);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, nombre, rol }]);

      if (profileError) {
        setMsg(` Error en perfil: ${profileError.message}`);
      } else {
        setMsg('¡ Registro exitoso! Redirigiendo...');
        setTimeout(() => router.push('/login'), 2000);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Crear Cuenta Universitaria</h2>
        {msg && <p className="mb-4 text-sm text-center font-medium text-orange-600 bg-orange-50 p-2 rounded">{msg}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Selecciona tu Rol</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none bg-white">
            <option value="lector">Lector (Explorar recetas)</option>
            <option value="chef">Chef (Publicar y Administrar CRUD)</option>
          </select>
        </div>
        <button type="submit" className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition shadow-sm">Registrarse</button>
      </form>
    </div>
  );
}
