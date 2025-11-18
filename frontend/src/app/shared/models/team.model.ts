export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  createdAt: Date;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  joinedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    position?: string;
    avatarUrl?: string;
  };
}

export interface CreateTeamDto {
  name: string;
  description?: string;
}
