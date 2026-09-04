import { create } from 'zustand';
import type { Organization } from '../types/organization';

type OrganizationState = {
  selectedOrganization: Organization | null;
  selectOrganization: (organization: Organization | null) => void;
};

export const useOrganizationStore = create<OrganizationState>((set) => ({
  selectedOrganization: null,
  selectOrganization: (selectedOrganization) => set({ selectedOrganization }),
}));
