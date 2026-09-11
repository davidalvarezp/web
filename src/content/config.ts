import { defineCollection, z } from 'astro:content';

const manLinuxCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    moduleNumber: z.string().optional(),
    moduleTitle: z.string().optional(),
    order: z.number().default(0),
    lastUpdated: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
  })
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    date: z.coerce.date().optional(),
    author: z.union([
      z.string(),
      z.object({
        name: z.string().default('David Álvarez Pampillón'),
        role: z.string().optional().default('Systems & Security Engineer'),
        avatar: z.string().optional().default('/assets/author-david.jpg')
      })
    ]).default('David Álvarez Pampillón'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    readTimeMinutes: z.number().default(5),
  })
});

export const collections = {
  'man-linux': manLinuxCollection,
  blog: blogCollection,
};