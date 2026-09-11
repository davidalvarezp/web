import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://davidalvarezp.com', // Dominio principal por defecto
  integrations: [
    tailwind(),
    mdx(),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
    domains: {
      es: 'https://dap.gal',
      en: 'https://davidalvarezp.com',
    },
  },
});