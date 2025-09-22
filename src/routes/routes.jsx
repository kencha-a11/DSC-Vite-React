import App from '../App';
import { HomePage, LoginPage, Dashboard, NotFoundPage } from '../pages';

export const publicRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
];

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
];

export const fallbackRoute = { path: '*', element: <NotFoundPage /> };
