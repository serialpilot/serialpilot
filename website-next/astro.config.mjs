import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  // Custom domain hosted on GitHub Pages from serialpilot/serialpilot.
  // The CNAME `serialpilot.riteshrana.engineer` resolves to ambicuity.github.io
  // in Cloudflare (DNS only); GitHub routes the request to this repo via the
  // `CNAME` file under `public/`.
  site: 'https://serialpilot.riteshrana.engineer',
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
})
