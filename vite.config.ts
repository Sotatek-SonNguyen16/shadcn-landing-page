import path from "path";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

const basenameProd = '/polymarket-research-ui'

export default defineConfig(({command}) => {
    const isProd = command === 'build'

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            global: {
                basename: isProd ? basenameProd : '',
            },
        },
    }
});
