import { defineCollection, z } from 'astro:content';

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]).optional().transform((d) =>
      d instanceof Date ? d.toISOString().slice(0, 10) : d
    ),
    tags: z.array(z.string()).optional(),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  article: articleCollection,
  pages: pagesCollection,
};
