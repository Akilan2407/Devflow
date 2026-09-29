import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, beforeEach, afterAll } from 'vitest';
import { createApp } from '../server.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { UserModel } from '../models/user.model.js';

export const app = createApp();
export type TestUser = { token: string; id: string; email: string };
export type TestOrganization = { id: string; name: string };

let mongo: MongoMemoryServer;

export const setupDatabase = (): void => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });
  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });
};

export const registerUser = async (name: string, email: string): Promise<TestUser> => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password: 'password123' })
    .expect(201);
  return {
    token: response.body.data.accessToken,
    id: response.body.data.user._id,
    email,
  };
};

export const createOrganization = async (
  user: TestUser,
  name: string,
  slug: string,
): Promise<TestOrganization> => {
  const response = await request(app)
    .post('/api/organizations')
    .set('Authorization', `Bearer ${user.token}`)
    .send({ name, slug })
    .expect(201);
  return { id: response.body.data._id, name };
};

export const setRole = async (
  organizationId: string,
  actor: TestUser,
  member: TestUser,
  role: string,
): Promise<void> => {
  await OrganizationMemberModel.updateOne(
    { organizationId, userId: member.id },
    { role },
  );
  void actor;
};

export const addMembership = async (
  organizationId: string,
  user: TestUser,
  role = 'DEVELOPER',
): Promise<void> => {
  await OrganizationMemberModel.create({ organizationId, userId: user.id, role });
};

export const clearUsersAndOrganizations = async (): Promise<void> => {
  await Promise.all([UserModel.deleteMany({}), OrganizationModel.deleteMany({}), OrganizationMemberModel.deleteMany({})]);
};
