import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { MembersPage } from './pages/MembersPage';
import { OrganizationSettingsPage } from './pages/OrganizationSettingsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoleManagementPage } from './pages/RoleManagementPage';
import { TeamsPage } from './pages/TeamsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage';
import { useAuthStore } from './stores/auth.store';
import './styles.css';

const queryClient = new QueryClient();

export const App = (): ReactElement => {
  const restore = useAuthStore((state) => state.restore);
  useEffect(() => {
    void restore();
  }, [restore]);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/organizations/:id/members" element={<MembersPage />} />
            <Route path="/organizations/:id/roles" element={<RoleManagementPage />} />
            <Route path="/organizations/:id/settings" element={<OrganizationSettingsPage />} />
            <Route path="/organizations/:organizationId/teams" element={<TeamsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/projects/:projectId/settings" element={<ProjectSettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/organizations" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
