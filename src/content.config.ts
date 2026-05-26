import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/article' }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]).optional().transform((d) =>
      d instanceof Date ? d.toISOString().slice(0, 10) : d
    ),
    tags: z.array(z.string()).optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  article: articleCollection,
  pages: pagesCollection,
};
