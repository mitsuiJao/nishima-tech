import { defineConfig } from 'astro/config';
import rehypeOgCard from 'rehype-og-card';

export default defineConfig({
  markdown: {
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
    ],
  },
});
