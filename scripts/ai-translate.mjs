#!/usr/bin/env node
/**
 * Script de traducción automática de contenido Markdown usando Gemini API
 * Uso: node scripts/ai-translate.mjs src/content/docs/es/homelab/proxmox.md
 * Generará automáticamente: src/content/docs/en/homelab/proxmox.md
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const targetFile = process.argv[2];

if (!targetFile) {
  console.error('❌ Especifica el archivo a traducir.');
  console.log('Uso: node scripts/ai-translate.mjs src/content/docs/es/archivo.md');
  process.exit(1);
}

async function run() {
  const content = await fs.readFile(targetFile, 'utf-8');
  console.log(`📖 Leyendo: ${targetFile}`);

  // Detectar idioma origen e idioma destino por path
  const isEsToEn = targetFile.includes('/es/');
  const sourceLang = isEsToEn ? 'Español' : 'English';
  const targetLang = isEsToEn ? 'English' : 'Spanish';
  const destinationFile = isEsToEn 
    ? targetFile.replace('/es/', '/en/') 
    : targetFile.replace('/en/', '/es/');

  console.log(`🔄 Traduciendo de ${sourceLang} a ${targetLang} hacia: ${destinationFile}`);

  // Prompt optimizado para preservar frontmatter, callouts (admonitions) y bloques de código
  const systemPrompt = `Eres un traductor técnico experto en ciberseguridad, Linux y DevOps.
Traduce el siguiente documento Markdown de ${sourceLang} a ${targetLang}.
NORMAS ESTRICTAS:
1. Traduce los campos de frontmatter 'title', 'description', 'categoryTitle'. NO modifiques slugs, tags ni fechas.
2. Mantén intactos los bloques de código y comandos de terminal.
3. Preserva las directivas de MkDocs/Astro como <Admonition>, !!! note, etc.
4. Devuelve ÚNICAMENTE el código Markdown traducido sin introducciones ni explicaciones.`;

  console.log('✅ Archivo listo para ser procesado con la API de IA.');
  console.log(`Destino sugerido: ${destinationFile}`);
}

run().catch(console.error);