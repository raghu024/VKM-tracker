import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OwnerLayout from './layouts/OwnerLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';
import Library from './pages/Library.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Admin from './pages/Admin.jsx';
import SuperAdmin from './pages/SuperAdmin.jsx';
import HealthLogin from './pages/HealthLogin.jsx';
import HealthDashboard from './pages/HealthDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Standalone Health Tracker Portal (Simulated separate website) */}
        <Route path="/health" element={<HealthLogin />} />
        <Route path="/health/dashboard" element={<HealthDashboard />} />

        {/* Protected Routes for All Authenticated Users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<OwnerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
          <Route element={<OwnerLayout />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>

        {/* Super Admin Specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
          <Route element={<OwnerLayout />}>
            <Route path="/super-admin" element={<SuperAdmin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
