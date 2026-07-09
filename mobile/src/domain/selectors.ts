import { CareData, CareEvent, CareRecipient, CareTask } from "./types";

export function getAuthorizedRecipientIds(data: CareData, userId: string): Set<string> {
  return new Set(
    data.memberships
      .filter((membership) => membership.userId === userId)
      .map((membership) => membership.careRecipientId)
  );
}

export function isRecipientAvailableToUser(data: CareData, userId: string, careRecipientId: string): boolean {
  return getAuthorizedRecipientIds(data, userId).has(careRecipientId);
}

export function getUserScopedRecipient(
  data: CareData,
  userId: string,
  careRecipientId: string
): CareRecipient | undefined {
  if (!isRecipientAvailableToUser(data, userId, careRecipientId)) {
    return undefined;
  }

  return data.careRecipients.find((recipient) => recipient.id === careRecipientId);
}

export function getRecipientTasks(data: CareData, careRecipientId: string): CareTask[] {
  return data.careTasks.filter((task) => task.careRecipientId === careRecipientId);
}

export function getRecentEventsForRecipient(data: CareData, careRecipientId: string): CareEvent[] {
  return data.careEvents
    .filter((event) => event.careRecipientId === careRecipientId)
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
    .slice(0, 5);
}
