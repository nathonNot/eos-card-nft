import { IRouterConfig, lazy } from 'ice';
import Layout from '@/Layouts/BasicLayout';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Home = lazy(() => import('@/pages/Home'));
const ForgingCard = lazy(() => import('@/pages/ForgingCard'));
const CardTable = lazy(() => import('@/pages/CardTable'));
const NotFound = lazy(() => import('@/components/NotFound'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/dashboard',
        component: Dashboard,
      },
      {
        path: '/forging',
        component: ForgingCard,
      },
      {
        path: '/cardTable',
        component: CardTable,
      },
      {
        path: '/',
        exact: true,
        component: Home,
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
