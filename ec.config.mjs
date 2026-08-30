// ec.config.mjs
import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-dark', 'github-light'],
  themeCssSelector: (theme) =>
    theme.type === 'dark' ? ':root.dark' : ':root:not(.dark)',
  shiki: {
    langAlias: {
      excel: 'text',
    },
  },
});