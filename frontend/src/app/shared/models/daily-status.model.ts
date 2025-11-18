export enum Mood {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  STRESSED = 'STRESSED',
  BLOCKED = 'BLOCKED',
}

export interface DailyStatus {
  id: string;
  userId: string;
  date: Date;
  summary: string;
  blockers?: string;
  mood?: Mood;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateDailyStatusDto {
  date?: string;
  summary: string;
  blockers?: string;
  mood?: Mood;
}

export interface DailySummary {
  user: {
    id: string;
    name: string;
    email: string;
    position?: string;
  };
  date: Date;
  dailyStatus?: DailyStatus;
  metrics: {
    activeTasks: number;
    completedToday: number;
    dueToday: number;
    totalEstimatedHours: number;
  };
}
