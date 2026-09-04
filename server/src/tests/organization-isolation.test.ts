import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../server.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { UserModel } from '../models/user.model.js';

const app = createApp();
let mongo: MongoMemoryServer;

const register = async (name: string, email: string) => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password: 'password123' });
  return response.body.data.accessToken as string;
};

const createOrganization = async (token: string, name: string, slug: string) => {
  const response = await request(app)
    .post('/api/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, slug });
  return response.body.data._id as string;
};

describe('organization tenant isolation', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  beforeEach(async () => {
    await Promise.all([
      UserModel.deleteMany({}),
      OrganizationModel.deleteMany({}),
      OrganizationMemberModel.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('prevents a user from reading, updating, or deleting another organization', async () => {
    const userAToken = await register('User A', 'a@example.com');
    const userBToken = await register('User B', 'b@example.com');
    const organizationA = await createOrganization(userAToken, 'Organization A', 'organization-a');
    const organizationB = await createOrganization(userBToken, 'Organization B', 'organization-b');

    await request(app)
      .get(`/api/organizations/${organizationB}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(404);
    await request(app)
      .patch(`/api/organizations/${organizationB}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ name: 'Hijacked' })
      .expect(404);
    await request(app)
      .delete(`/api/organizations/${organizationB}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(404);

    const organization = await request(app)
      .get(`/api/organizations/${organizationB}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(200);
    expect(organization.body.data.name).toBe('Organization B');
    expect(organizationA).not.toBe(organizationB);
  });
});
