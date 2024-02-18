import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { fetchAdminLoader } from 'service/http';

const ConsoleLayout = lazy(() => import('layouts/console-layout'));
const Home = lazy(() => import('./home'));
const Host = lazy(() => import('./host'));
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
        path: '/',
        element: <Home />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/services',
        element: <Services />,
      },
      {
        path: '/nodes',
        element: <Nodes />,
      },
      {
        path: '/host',
        element: <Host />,
      },
    ],
  },
  {
    path: '/login/',
    element: <Login />,
  },
]);
