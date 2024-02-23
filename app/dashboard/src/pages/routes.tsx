import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { fetchAdminLoader } from 'service/http';
import { pages } from 'stores';

const ConsoleLayout = lazy(() => import('layouts/console-layout'));
const Home = lazy(() => import('./home'));
const Hosts = lazy(() => import('./hosts'));
const Users = lazy(() => import('./users'));
const Login = lazy(() => import('./login'));
const Nodes = lazy(() => import('./nodes'));
const Services = lazy(() => import('./services'));

export const router = createHashRouter([
  {
    path: '/',
    errorElement: <Login />,
    loader: fetchAdminLoader,
    element: <ConsoleLayout />,
    children: [
      {
        path: pages.home.path,
        element: <Home />,
      },
      {
        path: pages.users.path,
        element: <Users />,
      },
      {
        path: pages.services.path,
        element: <Services />,
      },
      {
        path: pages.nodes.path,
        element: <Nodes />,
      },
      {
        path: pages.hosts.path,
        element: <Hosts />,
      },
    ],
  },
  {
    path: '/login/',
    element: <Login />,
  },
]);
