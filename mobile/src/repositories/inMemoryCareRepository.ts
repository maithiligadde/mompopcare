import { AddCareRecipientInput, AddCareTaskInput, CareRepository } from "./careRepository";
import { CareData, CareEvent, CareRecipient, CareTask, PROTOTYPE_USER_ID } from "../domain/types";

export function createInitialCareData(): CareData {
  return {
    users: [
      {
        id: PROTOTYPE_USER_ID,
        displayName: "Maithili"
      }
    ],
    careRecipients: [],
    memberships: [],
    careTasks: [],
    careEvents: []
  };
}

export function createInMemoryCareRepository(): CareRepository {
  let data: CareData = cloneCareData(createInitialCareData());
  let nextIdNumber = 1;

  const nextId = (prefix: string): string => {
    const id = `${prefix}_${nextIdNumber}`;
    nextIdNumber += 1;
    return id;
  };

  return {
    getSnapshot: () => cloneCareData(data),
    addCareRecipient: (input: AddCareRecipientInput): CareRecipient => {
      const recipient: CareRecipient = {
        id: nextId("recipient"),
        displayName: input.displayName,
        relationshipLabel: input.relationshipLabel
      };
      const membership = {
        id: nextId("membership"),
        userId: PROTOTYPE_USER_ID,
        careRecipientId: recipient.id
      };

      data = {
        ...data,
        careRecipients: [...data.careRecipients, recipient],
        memberships: [...data.memberships, membership]
      };

      return recipient;
    },
    addCareTask: (input: AddCareTaskInput): CareTask => {
      const task: CareTask = {
        id: nextId("task"),
        careRecipientId: input.careRecipientId,
        title: input.title,
        dueAt: input.dueAt,
        status: "pending"
      };

      data = {
        ...data,
        careTasks: [...data.careTasks, task]
      };

      return task;
    },
    completeCareTask: (taskId: string, completedAt: string = new Date().toISOString()): CareEvent | undefined => {
      const task = data.careTasks.find((item) => item.id === taskId);

      if (!task || task.status === "completed") {
        return undefined;
      }

      const completedTask: CareTask = {
        ...task,
        status: "completed",
        completedAt
      };
      const event: CareEvent = {
        id: nextId("event"),
        careRecipientId: task.careRecipientId,
        taskId: task.id,
        type: "task_completed",
        occurredAt: completedAt,
        summary: `Completed: ${task.title}`
      };

      data = {
        ...data,
        careTasks: data.careTasks.map((item) => (item.id === taskId ? completedTask : item)),
        careEvents: [...data.careEvents, event]
      };

      return event;
    }
  };
}

function cloneCareData(data: CareData): CareData {
  return {
    users: data.users.map((user) => ({ ...user })),
    careRecipients: data.careRecipients.map((recipient) => ({ ...recipient })),
    memberships: data.memberships.map((membership) => ({ ...membership })),
    careTasks: data.careTasks.map((task) => ({ ...task })),
    careEvents: data.careEvents.map((event) => ({ ...event }))
  };
}
