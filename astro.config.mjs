import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeOgCard from 'rehype-og-card';
import remarkMath from 'remark-math';
import rehypeClassNames from 'rehype-class-names';
import astroExpressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
    astroExpressiveCode()
  ],
  
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeOgCard,
        {
          buildCache: true,
          buildCachePath: './.cache/og-card',
          serverCache: true,
          serverCachePath: './public',
          openInNewTab: true,
          enableSameTextURLConversion: true,
        },
      ],
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
