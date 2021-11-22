import error from './error';

export default [
  {
    path: '/',
    component: '@/pages/index',
    exact: true,
  },
  ...error,
];
