import { CareData, CareEvent, CareRecipient, CareTask } from "../domain/types";

export interface AddCareRecipientInput {
  displayName: string;
  relationshipLabel?: string;
}

export interface AddCareTaskInput {
  careRecipientId: string;
  title: string;
  dueDate?: string;
}

export interface CareRepository {
  getSnapshot: () => CareData;
  addCareRecipient: (input: AddCareRecipientInput) => CareRecipient;
  addCareTask: (input: AddCareTaskInput) => CareTask;
  completeCareTask: (taskId: string, completedAt?: string) => CareEvent | undefined;
}
