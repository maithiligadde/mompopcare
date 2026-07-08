import { CareData, CareEvent, CareTask } from "./types";

export function getRecipientTasks(data: CareData, careRecipientId: string): CareTask[] {
  return data.careTasks.filter((task) => task.careRecipientId === careRecipientId);
}

export function getRecentEventsForRecipient(data: CareData, careRecipientId: string): CareEvent[] {
  return data.careEvents
    .filter((event) => event.careRecipientId === careRecipientId)
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
    .slice(0, 5);
}
