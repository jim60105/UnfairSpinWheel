import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueTsSetup from '@vue/eslint-config-typescript'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  },
  ...vueTsSetup(),
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    ...js.configs.recommended
  },
  pluginVue.configs['flat/essential'],
  prettierSkipFormatting
])
