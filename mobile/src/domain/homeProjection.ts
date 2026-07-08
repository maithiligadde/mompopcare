import { deriveCareState } from "./careState";
import { isBeforeToday, isToday } from "./date";
import { getRecipientTasks } from "./selectors";
import { CareData, CareRecipient, CareStateSummary, CareTask } from "./types";

export interface HomeTaskItem {
  recipient: CareRecipient;
  task: CareTask;
}

export interface HomeRecipientItem {
  recipient: CareRecipient;
  careState: CareStateSummary;
}

export interface HomeProjection {
  needsAttention: HomeTaskItem[];
  today: HomeTaskItem[];
  recipients: HomeRecipientItem[];
}

export function getAuthorizedRecipientIds(data: CareData, userId: string): Set<string> {
  const circleIdsForUser = new Set(
    data.memberships.filter((membership) => membership.userId === userId).map((membership) => membership.careCircleId)
  );

  return new Set(
    data.careCircles
      .filter((circle) => circleIdsForUser.has(circle.id))
      .map((circle) => circle.careRecipientId)
  );
}

export function buildHomeProjection(data: CareData, userId: string, now: Date): HomeProjection {
  const authorizedRecipientIds = getAuthorizedRecipientIds(data, userId);
  const authorizedRecipients = data.careRecipients.filter((recipient) => authorizedRecipientIds.has(recipient.id));
  const needsAttention: HomeTaskItem[] = [];
  const today: HomeTaskItem[] = [];

  for (const recipient of authorizedRecipients) {
    const tasks = getRecipientTasks(data, recipient.id);

    for (const task of tasks) {
      if (task.status !== "pending") {
        continue;
      }

      if (isBeforeToday(task.dueAt, now)) {
        needsAttention.push({ recipient, task });
      } else if (isToday(task.dueAt, now)) {
        today.push({ recipient, task });
      }
    }
  }

  return {
    needsAttention,
    today,
    recipients: authorizedRecipients.map((recipient) => ({
      recipient,
      careState: deriveCareState(getRecipientTasks(data, recipient.id), now)
    }))
  };
}
