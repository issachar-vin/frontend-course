import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { TrackPage } from './pages/TrackPage'
import { AssignmentPage } from './pages/AssignmentPage'
import { NotFound } from './pages/NotFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/track/:trackSlug', element: <TrackPage /> },
      { path: '/track/:trackSlug/:assignmentSlug', element: <AssignmentPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
