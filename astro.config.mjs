import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeOgCard from './src/lib/og-card/index.js';
import remarkMath from 'remark-math';
import rehypeClassNames from 'rehype-class-names';
import astroExpressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nishima-tech.com',
  integrations: [
    astroExpressiveCode(),
    sitemap(),
  ],
  
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeOgCard,
      [
        rehypeClassNames,
        {
          'table': 'custom-table-root',
          'thead': 'custom-table-header',
          'th': 'custom-table-th',
          'td': 'custom-table-td',
          'tr': 'custom-table-tr'
        }
      ], 
      rehypeKatex,
    ],
  },
});
