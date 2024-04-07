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
