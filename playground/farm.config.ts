import { promises as fs } from 'node:fs'
import { defineConfig } from '@farmfe/core'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Vue from 'unplugin-vue/farm'
import AutoImport from 'unplugin-auto-import/farm'

export default defineConfig({
  compilation: {
    persistentCache: false,
    progress: false,
  },
  plugins: [
    Vue(),
    base(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [
        ElementPlusResolver(),
      ],
      dirs: [
        './composables/**',
        './directives/**',
      ],
      vueTemplate: true,
      vueDirectives: {
        isDirective(normalizeImportFrom, _importEntry) {
          return normalizeImportFrom.includes('/directives/')
        },
      },
      dumpUnimportItems: true,
    }),
  ],
})

function base() {
  return {
    name: 'farm-load-vue-module-type',
    priority: -100,
    load: {
      filters: {
        resolvedPaths: ['.vue'],
      },
      executor: async (param) => {
        const content = await fs.readFile(param.resolvedPath, 'utf-8')

        return {
          content,
          moduleType: 'js',
        }
      },
    },
  }
}
