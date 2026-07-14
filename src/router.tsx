import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/carta', element: <MenuPage /> },
    ],
  },
])
