interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

interface EventContext {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

export async function onRequest(context: EventContext): Promise<Response> {
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // 1. Omitir recursos estáticos compilados
  if (
    pathname.startsWith('/_astro/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|json|txt|xml)$/)
  ) {
    return context.next();
  }

  // 2. Determinar el idioma objetivo según el host
  const isSpanishDomain = hostname.includes('dap.gal');
  const targetLang = isSpanishDomain ? 'es' : 'en';

  // 3. Manejo de redirecciones para URLs que incluyan /es/ o /en/ explícitamente
  if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
    const isEsPath = pathname.startsWith('/es');
    const cleanPath = pathname.replace(/^\/(es|en)/, '') || '/';

    // Redirigir si el dominio coincide con el idioma de la URL para limpiar el path
    if (isSpanishDomain && isEsPath) {
      return Response.redirect(`${url.origin}${cleanPath}`, 301);
    }
    if (!isSpanishDomain && !isEsPath) {
      return Response.redirect(`${url.origin}${cleanPath}`, 301);
    }
    // Redirigir al dominio opuesto si intentan acceder a la ruta del idioma contrario
    if (!isSpanishDomain && isEsPath) {
      return Response.redirect(`https://dap.gal${cleanPath}`, 301);
    }
    if (isSpanishDomain && !isEsPath) {
      return Response.redirect(`https://davidalvarezp.com${cleanPath}`, 301);
    }
  }

  // 4. Mapeo estático transparente a las carpetas generadas por Astro (/es/... o /en/...)
  const internalPath = `/${targetLang}${pathname === '/' ? '' : pathname}`;
  const assetUrl = new URL(internalPath, url.origin);

  // Consultar directamente a los Assets Estáticos de Cloudflare
  const assetResponse = await context.env.ASSETS.fetch(new Request(assetUrl.toString(), context.request));

  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  return context.next();
}