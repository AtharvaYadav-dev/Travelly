import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
const Planner = lazy(() => import('./Planner'));
const Saved = lazy(() => import('./Saved'));
const Result = lazy(() => import('./Result'));
const Contact = lazy(() => import('./Contact'));
const Profile = lazy(() => import('./Profile'));
const Discover = lazy(() => import('./Discover'));

import './index.css'; // Tailwind CSS (if you're using it)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="planner"
          element={
            <ProtectedRoute>
              <Suspense fallback={null}><Planner /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="saved"
          element={
            <ProtectedRoute>
              <Suspense fallback={null}><Saved /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="discover"
          element={
            <Suspense fallback={null}><Discover /></Suspense>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Suspense fallback={null}><Result /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={null}><Profile /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="contact" element={<Suspense fallback={null}><Contact /></Suspense>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
