'use server';

import { createClientServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation'; // Importación nativa para App Router

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClientServer();

  // 1. Validar e inyectar la sesión en las cookies de servidor
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // 2. Redirección nativa forzada: esto garantiza que las cookies se graben sí o sí
  redirect('/dashboard');
}


