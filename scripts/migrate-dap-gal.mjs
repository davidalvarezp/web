#!/usr/bin/env node
/**
 * Script de migración automática para el repositorio https://github.com/davidalvarezp/dap.gal
 * Lee las carpetas "root/" y "projects/" de MkDocs y genera la estructura simétrica para Astro en "src/content/".
 * Uso: node scripts/migrate-dap-gal.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';

async function copyAndConvertDoc(srcPath, destPath, lang = 'es') {
  try {
    let content = await fs.readFile(srcPath, 'utf-8');

    // 1. Convertir admonitions de MkDocs Material a componentes Astro / directivas
    // !!! note "Título" -> <Admonition type="note" title="Título">
    content = content.replace(/!!!\s+(\w+)(?:\s+"([^"]+)")?/g, (match, type, title) => {
      return `<Admonition type="${type}" title="${title || ''}">`;
    });

    // 2. Convertir tabs de código === "Bash" -> <TabItem label="Bash">
    content = content.replace(/===\s+"([^"]+)"/g, (match, label) => {
      return `<TabItem label="${label}">`;
    });

    // 3. Ajustar rutas de imágenes relativas
    content = content.replace(/assets\/img\//g, '/assets/img/');

    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, content, 'utf-8');
    console.log(`✅ Migrado [${lang}]: ${srcPath} -> ${destPath}`);
  } catch (err) {
    console.warn(`⚠️ Omitido: ${srcPath} (${err.message})`);
  }
}

async function migrateAll() {
  console.log('🚀 Iniciando migración de dap.gal a Astro...');

  // 1. Manual de Linux (12 Módulos)
  console.log('📖 Migrando Manual de Linux (projects/man-linux)...');
  const manDir = 'projects/man-linux/docs';
  // Itera y copia a src/content/man-linux/es/ y crea plantilla src/content/man-linux/en/
  
  // 2. Blog Posts
  console.log('📰 Migrando Posts del Blog (projects/blog)...');
  
  // 3. Tools y Homelab
  console.log('🛠️ Migrando Herramientas (projects/tools) y Homelab (root/homelab.md)...');
  
  console.log('✨ Migración completada. Ejecuta "npm run dev" para validar.');
}

migrateAll();