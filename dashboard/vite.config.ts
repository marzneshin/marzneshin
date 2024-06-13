import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { execSync } from 'child_process';

export default defineConfig(({ mode }) => {
    const dev = mode === "development";

    process.env.VITE_LATEST_APP_VERSION =
        dev ?
            execSync("git describe --tag").toString().trimEnd()
            : execSync("git describe --tag --abbrev=0").toString().trimEnd()

    return {
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
    }
})
