export enum CardStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum CardPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  teamId?: string;
  isArchived: boolean;
  createdBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  lists?: List[];
  creator?: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
  };
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  cards?: Card[];
  createdAt: Date;
}

export interface Card {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  status: CardStatus;
  priority: CardPriority;
  estimateHours?: number;
  dueDate?: string;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  list?: {
    id: string;
    name: string;
  };
  comments?: Comment[];
  activityLogs?: ActivityLog[];
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  message: string;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ActivityLog {
  id: string;
  cardId: string;
  userId?: string;
  actionType: string;
  metadata: Record<string, any>;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
  };
}

export interface CreateBoardDto {
  name: string;
  description?: string;
  teamId?: string;
}

export interface CreateListDto {
  name: string;
  position?: number;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  listId: string;
  assigneeId?: string;
  status?: CardStatus;
  priority?: CardPriority;
  estimateHours?: number;
  dueDate?: string;
}

export interface MoveCardDto {
  listId: string;
  position?: number;
}
