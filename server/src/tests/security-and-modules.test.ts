import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app, addMembership, createOrganization, registerUser, setupDatabase } from './test-utils.js';
import { roleHasPermission } from '../utils/permissions.js';

setupDatabase();

describe('authentication and security', () => {
  it('rejects unauthenticated protected API access', async () => {
    await request(app).get('/api/organizations').expect(401);
    await request(app).get('/api/notifications').expect(401);
  });

  it('rejects malformed credentials and invalid organization input', async () => {
    await request(app).post('/api/auth/register').send({ name: 'A', email: 'bad', password: 'short' }).expect(400);
    const user = await registerUser('Input User', 'input@example.com');
    await request(app).post('/api/organizations').set('Authorization', `Bearer ${user.token}`).send({ name: 'x', slug: 'Bad Slug' }).expect(400);
  });

  it('enforces JWT type and authentication on protected endpoints', async () => {
    const user = await registerUser('JWT User', 'jwt@example.com');
    const login = await request(app).post('/api/auth/login').send({ email: user.email, password: 'password123' }).expect(200);
    expect(login.body.data.accessToken).toBeTruthy();
    await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid').expect(401);
    await request(app).get('/api/auth/me').set('Authorization', `Bearer ${user.token}`).expect(200);
  });

  it('does not grant viewers administrative permissions', async () => {
    expect(roleHasPermission('VIEWER', 'organization:read')).toBe(true);
    expect(roleHasPermission('VIEWER', 'organization:update')).toBe(false);
    expect(roleHasPermission('VIEWER', 'project:delete')).toBe(false);
  });

  it('isolates organizations and rejects viewer admin operations', async () => {
    const owner = await registerUser('Owner', 'owner@example.com');
    const viewer = await registerUser('Viewer', 'viewer@example.com');
    const other = await registerUser('Other', 'other@example.com');
    const organization = await createOrganization(owner, 'Secure Org', 'secure-org');
    const otherOrganization = await createOrganization(other, 'Other Org', 'other-org');
    await addMembership(organization.id, viewer, 'VIEWER');

    await request(app).patch(`/api/organizations/${organization.id}`).set('Authorization', `Bearer ${viewer.token}`).send({ name: 'Nope' }).expect(403);
    await request(app).get(`/api/organizations/${otherOrganization.id}`).set('Authorization', `Bearer ${viewer.token}`).expect(404);
  });
});

describe('protected module routes', () => {
  const routes = [
    ['/api/organizations', 'get'],
    ['/api/organizations/000000000000000000000000/teams', 'get'],
    ['/api/projects', 'get'],
    ['/api/projects/000000000000000000000000/sprints', 'get'],
    ['/api/projects/000000000000000000000000/issues', 'get'],
    ['/api/projects/000000000000000000000000/tasks', 'get'],
    ['/api/comments/ISSUE/000000000000000000000000', 'get'],
    ['/api/notifications', 'get'],
    ['/api/search?q=task', 'get'],
    ['/api/analytics/projects/000000000000000000000000', 'get'],
    ['/api/repositories', 'get'],
  ] as const;

  it.each(routes)('%s requires authentication', async (path, method) => {
    const response = await request(app)[method](path);
    expect(response.status).toBe(401);
  });
});
