import type { RequestHandler } from 'express';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { TeamModel } from '../models/team.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import type { TeamDocument } from '../models/team.model.js';

export type TeamRequest = OrganizationRequest & { team: TeamDocument };

export const requireTeamAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const organizationRequest = request as unknown as OrganizationRequest;
    const team = await TeamModel.findById(request.params.id);
    if (!team) {
      response.status(404).json({ error: { message: 'Team not found' } });
      return;
    }
    const membership = await OrganizationMemberModel.findOne({
      organizationId: team.organizationId,
      userId: organizationRequest.user._id,
    });
    if (!membership) {
      response.status(404).json({ error: { message: 'Team not found' } });
      return;
    }
    const organization = await OrganizationModel.findById(team.organizationId);
    if (!organization) {
      response.status(404).json({ error: { message: 'Team not found' } });
      return;
    }
    const teamRequest = request as unknown as TeamRequest;
    teamRequest.team = team;
    teamRequest.organization = organization;
    teamRequest.membership = membership;
    next();
  })().catch(next);
};
