// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [
    ...(process.env.NODE_ENV === 'production' ? [sentry()] : []),
    ...(process.env.NODE_ENV === 'development' ? [spotlightjs()] : [])
  ],
});