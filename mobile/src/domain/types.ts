export const PROTOTYPE_USER_ID = "user_maithili";

export type TaskStatus = "pending" | "completed";
export type CareEventType = "task_completed";

export interface User {
  id: string;
  displayName: string;
}

export interface CareRecipient {
  id: string;
  displayName: string;
  relationshipLabel?: string;
}

export interface Membership {
  id: string;
  userId: string;
  careRecipientId: string;
}

export interface CareTask {
  id: string;
  careRecipientId: string;
  title: string;
  dueAt?: string;
  status: TaskStatus;
  completedAt?: string;
}

export interface CareEvent {
  id: string;
  careRecipientId: string;
  taskId: string;
  type: CareEventType;
  occurredAt: string;
  summary: string;
}

export interface CareData {
  users: User[];
  careRecipients: CareRecipient[];
  memberships: Membership[];
  careTasks: CareTask[];
  careEvents: CareEvent[];
}

export interface CareStateSummary {
  overdueIncompleteCount: number;
  dueTodayIncompleteCount: number;
  needsAttention: boolean;
  scheduledCareOnTrack: boolean;
}
