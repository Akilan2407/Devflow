import type { NextFunction, Request, Response } from 'express';
import { organizationService } from '../services/organization.service.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import {
  createOrganizationSchema,
  memberInviteSchema,
  memberRoleSchema,
  updateOrganizationSchema,
} from '../validators/organization.validators.js';

const requiredParam = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};

export const createOrganization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    const organization = await organizationService.create(
      organizationRequest.user._id.toString(),
      createOrganizationSchema.parse(request.body),
    );
    response.status(201).json({ data: organization });
  } catch (error) {
    next(error);
  }
};

export const listOrganizations = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    response.json({
      data: await organizationService.listForUser(organizationRequest.user._id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganization = (request: Request, response: Response): void => {
  response.json({ data: (request as unknown as OrganizationRequest).organization });
};

export const updateOrganization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    const organization = await organizationService.update(
      organizationRequest.organization,
      updateOrganizationSchema.parse(request.body),
    );
    response.json({ data: organization });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await organizationService.delete((request as unknown as OrganizationRequest).organization);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    await organizationService.invite(
      organizationRequest.organization._id.toString(),
      memberInviteSchema.parse(request.body),
    );
    response.status(201).json({ data: { message: 'Member added' } });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await organizationService.remove(
      (request as unknown as OrganizationRequest).organization,
      requiredParam(request.params.userId),
    );
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const changeMemberRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = memberRoleSchema.parse(request.body);
    await organizationService.changeRole(
      (request as unknown as OrganizationRequest).organization,
      requiredParam(request.params.userId),
      role,
    );
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    response.json({
      data: await organizationService.members(
        (request as unknown as OrganizationRequest).organization._id.toString(),
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationId = (request: Request): string => requiredParam(request.params.id);
