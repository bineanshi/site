import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'


import viteCompression from "vite-plugin-compression";

import {
  join,
  parse,
  resolve
} from "path";


function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [vue(), //按需导入element-plus组件
    viteCompression()
  ],
  resolve: {
    alias: {
      "@": pathResolve("src"),
    }
  },
  optimizeDeps: {
    // include: ['axios'],
  },
  server: {
    host: "0.0.0.0",
    cors: true,
    open: true,
    proxy: {

    }
  },
  build: {
    // 指定输出路径，默认'dist'
    outDir: 'dist',
    // 指定生成静态资源的存放路径(相对于build.outDir)
    assetsDir: 'assets',
    // 小于此阈值的导入或引用资源将内联为base64编码，设置为0可禁用此项。默认4096（4kb）
    assetsInlineLimit: '4096',
    // 启用/禁用CSS代码拆分，如果禁用，整个项目的所有CSS将被提取到一个CSS文件中,默认true
    cssCodeSplit: true,
    // 构建后是否生成source map文件，默认false
    sourcemap: false,
    // 为true时，会生成manifest.json文件，用于后端集成
    manifest: false,

    target: 'modules',

    minify: 'terser', // 混淆器
    brotliSize: true, // => 启用/禁用brotli压缩大小报告
    //去除console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      },
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    }
  }
});

function entryPoints(...paths) {
  const entries = paths.map(parse).map(entry => {
    const {
      dir,
      base,
      name,
      ext
    } = entry;
    const key = join(dir, name);
    const path = resolve(__dirname, dir, base);
    return [key, path];
  });

  const config = Object.fromEntries(entries);
  return config;
}