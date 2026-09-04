import type { NextFunction, Request, Response } from 'express';
import { teamService } from '../services/team.service.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import type { TeamRequest } from '../middleware/team.middleware.js';
import {
  createTeamSchema,
  teamMemberSchema,
  updateTeamSchema,
} from '../validators/team.validators.js';

const stringParam = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};

export const createTeam = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organizationRequest = request as unknown as OrganizationRequest;
    const team = await teamService.create(
      stringParam(request.params.organizationId),
      organizationRequest.user._id.toString(),
      createTeamSchema.parse(request.body),
    );
    response.status(201).json({ data: team });
  } catch (error) {
    next(error);
  }
};

export const getTeams = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100);
    const organizationRequest = request as unknown as OrganizationRequest;
    response.json({
      data: await teamService.list(stringParam(request.params.organizationId), page, limit),
    });
    void organizationRequest;
  } catch (error) {
    next(error);
  }
};

export const getTeam = (request: Request, response: Response): void => {
  response.json({ data: (request as unknown as TeamRequest).team });
};

export const updateTeam = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    response.json({
      data: await teamService.update(
        (request as unknown as TeamRequest).team,
        updateTeamSchema.parse(request.body),
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await teamService.delete((request as unknown as TeamRequest).team);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    response.json({
      data: await teamService.addMember(
        (request as unknown as TeamRequest).team,
        teamMemberSchema.parse(request.body),
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    response.json({
      data: await teamService.removeMember(
        (request as unknown as TeamRequest).team,
        stringParam(request.params.userId),
      ),
    });
  } catch (error) {
    next(error);
  }
};
