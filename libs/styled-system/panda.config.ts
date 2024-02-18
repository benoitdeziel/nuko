import {
  defineConfig,
  defineRecipe,
  defineSemanticTokens,
} from '@pandacss/dev';

import { tokens } from './src/lib/theme';

export default defineConfig({
  presets: ['@pandacss/dev/presets', '@shadow-panda/preset'],
  preflight: true,
  jsxFramework: 'react',
  outExtension: 'js',
  include:
    process.env.NX_TASK_TARGET_TARGET === 'storybook'
      ? ['./apps/**/*.{ts,tsx}', './libs/**/*.{ts,tsx}']
      : ['../../apps/**/*.{ts,tsx}', '../../libs/**/*.{ts,tsx}'],
  outdir:
    process.env.NX_TASK_TARGET_TARGET === 'storybook'
      ? './libs/styled-system/src/__generated__'
      : '../../libs/styled-system/src/__generated__',
  theme: {
    extend: {
      tokens,
      semanticTokens: defineSemanticTokens({
        colors: {
          heavy: { value: '{colors.blue}' },
          light: { value: '{colors.red}' },
        },
      }),
      recipes: {
        heading: defineRecipe({
          className: 'heading',
          base: {},
          variants: {
            size: {
              large: { fontSize: '2xl' },
              small: { fontSize: 'xl' },
            },
          },
        }),
      },
    },
  },
});
