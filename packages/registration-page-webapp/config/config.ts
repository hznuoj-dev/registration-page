import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  devServer: {
    port: 8000,
    host: '0.0.0.0',
  },
  title: 'Register',
  favicon: '/favicon.ico',
  hash: true,
  base: '/',
  publicPath: '/',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
    },
  },
  fastRefresh: {},
});
