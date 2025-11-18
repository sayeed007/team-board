export enum UserRole {
  ORG_ADMIN = 'ORG_ADMIN',
  TEAM_LEAD = 'TEAM_LEAD',
  EMPLOYEE = 'EMPLOYEE',
  SYS_ADMIN = 'SYS_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  position?: string;
  avatarUrl?: string;
  status: UserStatus;
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  settings?: Record<string, any>;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  organizationName: string;
}
