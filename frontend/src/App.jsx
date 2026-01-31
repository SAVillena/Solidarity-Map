import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login Route (no layout) */}
          <Route path="/login" element={<Login />} />

          {/* Main Routes (with layout) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<MapView />} />
            <Route path="list" element={<ListView />} />

            {/* Protected Admin Route */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
