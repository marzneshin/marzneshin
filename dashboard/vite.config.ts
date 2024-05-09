import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        tsconfigPaths(),
        react()
    ],
    root: '.',
    build: {
        assetsDir: 'static',
        outDir: 'dist'
    },
    resolve: {
        alias: [
            {
                find: '@marzneshin',
                replacement: path.resolve(__dirname, './src/'),
            },
        ],
    },
})
