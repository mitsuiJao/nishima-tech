import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import rehypeOgCard from 'rehype-og-card';
import remarkMath from 'remark-math';

export default defineConfig({
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
      rehypeKatex,
    ],
  },
});
