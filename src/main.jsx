import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TestPage from './pages/TestPage.jsx'
import UserCrudPage from './pages/UserCrudPage.jsx'
import NotFoundPage from './pages/status/NotFoundPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ShowUser from './components/users/UserShow.jsx'
import StoreUser from './components/users/UserStore.jsx'
import DeleteUser from './components/users/UserDelete.jsx'
import UpdateUser from './components/users/UserUpdate.jsx'
import IndexUser from './components/users/UserIndex.jsx'
import WeatherStatus from './components/WeatherStatus.jsx'
import ProductIndex from './components/products/ProductIndex.jsx'
import ProductStore from './components/products/ProductStore.jsx'
import ProductDelete from './components/products/ProductDelete.jsx'
import ProductShow from './components/products/ProductShow.jsx'
import ProductImgDelete from './components/products/productsImages/ProductImgDelete.jsx'
import UserPolicy from './pages/UserPolicy.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'



const router = createBrowserRouter([
  {path: '/', element: <App />,},
  {path: '/home', element: <HomePage />,},
  {path: '/test', element: <TestPage />,},

  {path: '/users', element: <UserCrudPage />,},
  {path: '/users/index', element: <IndexUser />,},
  {path: '/users/store', element: <StoreUser />,},
  {path: '/users/show/:id', element: <ShowUser />,},
  {path: '/users/update', element: <UpdateUser />,},
  {path: '/users/delete', element: <DeleteUser />,},  

  {path: '/products/index', element: <ProductIndex />,},
  {path: '/products/store', element: <ProductStore />,},
  {path: '/products/delete', element: <ProductDelete />,},
  {path: '/products/show/:id', element: <ProductShow />,},

  {path: '/products-images/delete', element: <ProductImgDelete />,},

  {path: '/test-policy/:id', element: <UserPolicy />,},


  {path: '/login', element: <LoginPage />,},
  {path: '/dashboard', element: <Dashboard />,},
  // dashboard is not protected still accessible for unauthenticated users

  
  {path: '/weather', element: <WeatherStatus />,},
  {path: '*', element: <NotFoundPage />,},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
