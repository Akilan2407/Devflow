import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { MembersPage } from './pages/MembersPage';
import { RoleManagementPage } from './pages/RoleManagementPage';
import { OrganizationSettingsPage } from './pages/OrganizationSettingsPage';
import { TeamsPage } from './pages/TeamsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage';
import { ProjectIssuesPage } from './pages/ProjectIssuesPage';
import { NotificationPage } from './pages/NotificationPage';
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
          {/* Public Landing & Marketing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Enterprise Workspace Engine */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/organizations/:id/members" element={<MembersPage />} />
              <Route path="/organizations/:id/roles" element={<RoleManagementPage />} />
              <Route path="/organizations/:id/settings" element={<OrganizationSettingsPage />} />
              <Route path="/organizations/:organizationId/teams" element={<TeamsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
              <Route path="/projects/:projectId/settings" element={<ProjectSettingsPage />} />
              <Route path="/projects/:projectId/issues" element={<ProjectIssuesPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

