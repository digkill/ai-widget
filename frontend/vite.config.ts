import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: 'src/Widget.tsx',
            name: 'AiWidget',
            fileName: (format) => `ai-widget.${format}.js`,
            formats: ['es', 'umd'],
        },
   //     rollupOptions: {
//            external: ['react', 'react-dom'],
        //    output: {
      //          globals: {
     //               react: 'React',
    //                'react-dom': 'ReactDOM',
   //             },
  //          },
    //    },
        target: 'es2023',
        minify: 'esbuild',
        outDir: 'dist',
        emptyOutDir: true,
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
});