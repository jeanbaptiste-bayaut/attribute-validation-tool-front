import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Root from './pages/Root';
import App from './App';
import ControlPage from './components/ControlPage/ControlPage';
import Loader from './components/Loader/Loader';
import Upload from './components/Upload/Upload';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const userLog = Cookies.get('username');

  if (!userLog) {
    return <Navigate to="/" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<App />} />
      <Route
        path="/control"
        element={
          <PrivateRoute>
            <ControlPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

// Rendu de l'application
root.render(
  <AuthProvider>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);
