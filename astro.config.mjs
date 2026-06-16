import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeOgCard from 'rehype-og-card';
import remarkMath from 'remark-math';
import rehypeClassNames from 'rehype-class-names';
import astroExpressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';

// process.argv is ['node', 'astro', 'dev'|'build'|'preview'] — more reliable than npm_lifecycle_event
// which becomes undefined when Astro internally reloads the config
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://nishima-tech.com',
  integrations: [
    astroExpressiveCode(),
    sitemap(),
  ],
  
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      ...(!isDev ? [[
        rehypeOgCard,
        {
          buildCache: true,
          buildCachePath: './.cache/og-card',
          serverCache: true,
          serverCachePath: './public',
          openInNewTab: true,
          enableSameTextURLConversion: true,
        },
      ]] : []),
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
