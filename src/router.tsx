import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/layout'
import HomePage from './pages/home'
import MenuPage from './pages/menu'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/carta', element: <MenuPage /> },
    ],
  },
])
