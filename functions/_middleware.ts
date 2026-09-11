interface EventContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest(context: EventContext): Promise<Response> {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // Ignorar archivos estáticos (imágenes, fuentes, assets de astro, etc.)
  if (
    pathname.startsWith('/_astro/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|json|txt|xml)$/)
  ) {
    return context.next();
  }

  // Identificar el idioma correspondiente según el dominio consultado
  const isSpanishDomain = hostname.includes('dap.gal');
  const targetLang = isSpanishDomain ? 'es' : 'en';

  // 1. Manejo de URLs que contengan explícitamente el prefijo del idioma (/es/... o /en/...)
  if (pathname.startsWith('/es/') || pathname === '/es' || pathname.startsWith('/en/') || pathname === '/en') {
    const isEsPath = pathname.startsWith('/es/') || pathname === '/es';
    const cleanPath = pathname.replace(/^\/(es|en)/, '') || '/';

    // Si entran a dap.gal/es/blog -> Redirigir a dap.gal/blog
    if (isSpanishDomain && isEsPath) {
      return Response.redirect(`${url.origin}${cleanPath}`, 301);
    }
    // Si entran a davidalvarezp.com/en/blog -> Redirigir a davidalvarezp.com/blog
    if (!isSpanishDomain && !isEsPath) {
      return Response.redirect(`${url.origin}${cleanPath}`, 301);
    }
    // Si entran al dominio inglés pidiendo contenido /es/ -> Redirigir a dap.gal/cleanPath
    if (!isSpanishDomain && isEsPath) {
      return Response.redirect(`https://dap.gal${cleanPath}`, 301);
    }
    // Si entran al dominio español pidiendo contenido /en/ -> Redirigir a davidalvarezp.com/cleanPath
    if (isSpanishDomain && !isEsPath) {
      return Response.redirect(`https://davidalvarezp.com${cleanPath}`, 301);
    }
  }

  // 2. Rewrite transparente para el SSG
  // Mapear la ruta actual a la carpeta build correspondiente (/es/... o /en/...)
  const targetPath = `/${targetLang}${pathname === '/' ? '' : pathname}`;
  const rewriteUrl = new URL(targetPath, url.origin);

  // Consultar internamente el asset estático estática generado por Astro
  const response = await fetch(new Request(rewriteUrl.toString(), context.request));

  // Si la ruta existe en esa localización, devolver la respuesta sin cambiar la URL del usuario
  if (response.status !== 404) {
    return response;
  }

  // Si no se encuentra en el idioma solicitado, continuar con la ejecución normal (404 personalizado)
  return context.next();
}