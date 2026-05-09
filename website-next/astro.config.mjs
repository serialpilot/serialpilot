import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://riteshrana.github.io',
  base: '/serialpilot',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    preact({ compat: false }),
    sitemap(),
  ],
  experimental: {
    clientPrerender: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
