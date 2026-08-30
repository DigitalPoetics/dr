// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";




// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: netlify(),
  site: 'https://diagrammaticreadings.com',
  integrations: [expressiveCode(), mdx(), sitemap(), pagefind()],
  build: {
    inlineStylesheets: "never",
  },
  image: {
    domains: ["docs.astro.build"],
  },
});