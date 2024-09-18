/// <reference types="./src/env"/>
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { UserConfigExport, defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }): UserConfigExport => {
  process.env = {
    VITE_VERSION: 'default',
    VITE_BUILD_TIMESTAMP: new Date().toISOString(),
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };

  // this defines if we should automatically open the browser
  const shouldOpen = process.env.BROWSER && process.env.BROWSER !== 'none';

  return defineConfig({
    base: '/',
    server: {
      port: parseInt(process.env.VITE_PORT, 10),
      open: shouldOpen,
      watch: {
        ignored: ['**/coverage/**'],
      },
    },
    preview: {
      port: parseInt(process.env.VITE_PORT, 10),
      strictPort: true,
      open: shouldOpen,
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      mode !== 'test'
        ? checker({
            typescript: true,
            eslint: {
              useFlatConfig: true,
              lintCommand: 'eslint "./**/*.{ts,tsx}"',
            },
            overlay: { initialIsOpen: false },
          })
        : undefined,
      react(),
      istanbul({
        include: 'src/*',
        exclude: ['node_modules', 'test/'],
        extension: ['.js', '.ts', '.tsx'],
        requireEnv: false,
        forceBuildInstrument: mode === 'test',
        checkProd: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });
};
