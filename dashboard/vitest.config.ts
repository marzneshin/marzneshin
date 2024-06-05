/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul'
        },
        globals: true,
        environment: "jsdom",
        setupFiles: ['./vitest.setup.ts'],
    },
    root: '.',
    resolve: {
        alias: [
            {
                find: '@marzneshin',
                replacement: path.resolve(__dirname, './src/'),
            },
        ],
    },
})
