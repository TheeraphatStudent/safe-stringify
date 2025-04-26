import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'SafeStringify',
      fileName: (format) => `safe-stringify.${format}.js`
    }
  },
});