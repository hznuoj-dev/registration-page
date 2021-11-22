import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  devServer: {
    port: 8000,
    host: '0.0.0.0',
  },
  base: '/',
  title: 'Register',
  favicon: '/favicon.ico',
  hash: true,
  publicPath: '/',
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  routes: routes,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
    },
  },
});
