import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeOgCard from './src/lib/og-card/index.js';
import rehypeExternalLinks from 'rehype-external-links';
import remarkMath from 'remark-math';
import rehypeClassNames from 'rehype-class-names';
import astroExpressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';

const SITE_HOSTNAME = 'nishima-tech.com';

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
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          // Absolute links back to this site (e.g. someone pastes the full
          // URL instead of a relative path) shouldn't open in a new tab.
          test: (element) => {
            const href = element.properties?.href;
            if (typeof href !== 'string') return true;
            try {
              return new URL(href, `https://${SITE_HOSTNAME}`).hostname !== SITE_HOSTNAME;
            } catch {
              return true;
            }
          },
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
