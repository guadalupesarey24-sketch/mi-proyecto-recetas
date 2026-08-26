import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // DENTRO DE CREATESERVERCLIENT EN TU MIDDLEWARE:
cookies: {
  getAll() {
    return request.cookies.getAll()
  },
  setAll(cookiesToSet) {
    // 1. Seteamos las cookies en la petición original
    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
    
    // 2. Creamos una respuesta limpia para Next.js
    supabaseResponse = NextResponse.next({
      request,
    })
    
    // 3. ¡SOLUCIÓN CRUCIAL! Recorremos de uno en uno en lugar de usar setAll
    cookiesToSet.forEach(({ name, value, options }) =>
      supabaseResponse.cookies.set(name, value, options)
    )
  },
}

    }
  )

  // Esto refresca la sesión si está vencida o valida si existe
  const { data: { user } } = await supabase.auth.getUser()

  // Si intenta ir al dashboard y no hay usuario, redirige al login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
