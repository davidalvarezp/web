// @ts-nocheck
// Cloudflare Pages Functions - Middleware de Enrutamiento Multi-Dominio
// Ubicación: /functions/_middleware.ts

export const onRequest = async (context: any) => {
  const url = new URL(context.request.url);
  const host = (context.request.headers.get('host') || '').toLowerCase();

  // Ignorar peticiones de ficheros estáticos con extensión (_astro, assets, .css, .js, imágenes, etc.)
  const isStaticAsset = url.pathname.startsWith('/_astro/') || 
                       url.pathname.startsWith('/assets/') || 
                       /\.(css|js|png|jpg|jpeg|svg|webp|ico|woff2?|json|xml|txt)$/i.test(url.pathname);

  if (isStaticAsset) {
    return context.next();
  }

  // CASO 1: Dominio en inglés (davidalvarezp.com)
  // Sirve la versión en inglés (/en/...) directamente desde la raíz
  if (host.includes('davidalvarezp.com')) {
    // Si la ruta no empieza ya por /en, reescribimos internamente hacia /en/path
    if (!url.pathname.startsWith('/en')) {
      const rewrittenPath = url.pathname === '/' ? '/en' : `/en${url.pathname}`;
      const rewrittenUrl = new URL(rewrittenPath, url.origin);
      rewrittenUrl.search = url.search;
      
      const response = await context.env.ASSETS.fetch(new Request(rewrittenUrl.toString(), context.request));
      if (response.status === 404 && !url.pathname.endsWith('/')) {
        // Intentar con barra final si es necesario
        const retryUrl = new URL(`${rewrittenPath}/`, url.origin);
        return context.env.ASSETS.fetch(new Request(retryUrl.toString(), context.request));
      }
      return response;
    }
  }

  // CASO 2: Dominio en español (dap.gal)
  // Las rutas en español están en la raíz /, por lo que context.next() las sirve de forma nativa.
  // Si alguien entra a dap.gal/en/..., opcionalmente podemos redirigir a davidalvarezp.com o permitirlo
  return context.next();
};