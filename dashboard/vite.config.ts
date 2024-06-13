import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { execSync } from 'child_process';

function checkTagIsHead(): boolean {
    try {
        execSync('/usr/bin/git describe --tags --exact-match HEAD');
        return true;
    } catch (e) {
        return false
    }
}

export default defineConfig(({ mode }) => {
    const dev = mode === "development";

    let latestVersion = process.env.VITE_LATEST_APP_VERSION;

    if (!latestVersion) {
        try {
            const isHead = checkTagIsHead()
            latestVersion = dev || !isHead ?
                execSync("/usr/bin/git describe --tags").toString().trimEnd() :
                execSync("/usr/bin/git describe --tags --abbrev=0").toString().trimEnd();
        } catch (e) {
            console.error("Git versioning failed:", e);
            latestVersion = "unknown";
        }
        process.env.VITE_LATEST_APP_VERSION = latestVersion;
    }

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
