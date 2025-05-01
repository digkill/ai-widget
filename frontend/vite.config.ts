import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(new URL('src/Widget.tsx', import.meta.url).pathname),
            name: 'AiWidget',
            fileName: (format) => `ai-widget.${format}.js`,
            formats: ['es', 'umd'], // 👈 только ES-модуль
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime' // 👈 ОБЯЗАТЕЛЬНО!
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime' // 👈 фиктивное имя — игнорируется браузером
                },
            },
        },
        target: 'es2023',
        minify: 'esbuild',
        outDir: 'dist',
        emptyOutDir: true,
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
});
