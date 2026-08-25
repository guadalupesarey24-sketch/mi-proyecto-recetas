'use server';

import { createClientServer } from '../../lib/supabase-server';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 1. Iniciamos el cliente de servidor seguro
  const supabase = await createClientServer();

  // 2. Ejecutamos la autenticación de forma segura en el servidor
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

