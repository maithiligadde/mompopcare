import assert from "node:assert/strict";
import test from "node:test";
import { deriveCareState } from "../careState";
import { buildHomeProjection } from "../homeProjection";
import { CareData, PROTOTYPE_USER_ID } from "../types";
import { createInMemoryCareRepository, createInitialCareData } from "../../repositories/inMemoryCareRepository";

const NOW = new Date("2026-07-08T12:00:00.000Z");
const YESTERDAY = "2026-07-07T12:00:00.000Z";
const TODAY = "2026-07-08T12:00:00.000Z";

test("overdue incomplete task appears as needing attention", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const task = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Call clinic",
    dueAt: YESTERDAY
  });

  const projection = buildHomeProjection(repository.getSnapshot(), PROTOTYPE_USER_ID, NOW);

  assert.equal(projection.needsAttention.length, 1);
  assert.equal(projection.needsAttention[0]?.task.id, task.id);
  assert.equal(projection.needsAttention[0]?.recipient.id, recipient.id);
});

test("completed task no longer appears as needing attention", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const task = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Pick up reports",
    dueAt: YESTERDAY
  });

  repository.completeCareTask(task.id, TODAY);
  const projection = buildHomeProjection(repository.getSnapshot(), PROTOTYPE_USER_ID, NOW);

  assert.equal(projection.needsAttention.length, 0);
});

test("task completion creates a completion CareEvent", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const task = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Refill prescription"
  });

  const event = repository.completeCareTask(task.id, TODAY);
  const snapshot = repository.getSnapshot();

  assert.equal(event?.type, "task_completed");
  assert.equal(event?.summary, "Completed: Refill prescription");
  assert.equal(snapshot.careEvents.length, 1);
  assert.equal(snapshot.careEvents[0]?.careRecipientId, recipient.id);
});

test("Home projection includes only recipient contexts available to the current prototype User", () => {
  const data: CareData = {
    ...createInitialCareData(),
    users: [
      { id: PROTOTYPE_USER_ID, displayName: "Maithili" },
      { id: "user_other", displayName: "Other User" }
    ],
    careRecipients: [
      { id: "recipient_authorized", displayName: "Recipient A" },
      { id: "recipient_unauthorized", displayName: "Recipient B" }
    ],
    careCircles: [
      { id: "circle_authorized", careRecipientId: "recipient_authorized" },
      { id: "circle_unauthorized", careRecipientId: "recipient_unauthorized" }
    ],
    memberships: [
      { id: "membership_authorized", userId: PROTOTYPE_USER_ID, careCircleId: "circle_authorized" },
      { id: "membership_unauthorized", userId: "user_other", careCircleId: "circle_unauthorized" }
    ],
    careTasks: [
      {
        id: "task_authorized",
        careRecipientId: "recipient_authorized",
        title: "Call clinic",
        dueAt: YESTERDAY,
        status: "pending"
      },
      {
        id: "task_unauthorized",
        careRecipientId: "recipient_unauthorized",
        title: "Schedule follow-up",
        dueAt: YESTERDAY,
        status: "pending"
      }
    ],
    careEvents: []
  };

  const projection = buildHomeProjection(data, PROTOTYPE_USER_ID, NOW);

  assert.deepEqual(
    projection.recipients.map((item) => item.recipient.id),
    ["recipient_authorized"]
  );
  assert.deepEqual(
    projection.needsAttention.map((item) => item.task.id),
    ["task_authorized"]
  );
});

test("one recipient's task remains associated with the correct recipient context", () => {
  const repository = createInMemoryCareRepository();
  const recipientA = repository.addCareRecipient({ displayName: "Recipient A" });
  const recipientB = repository.addCareRecipient({ displayName: "Recipient B" });
  const taskA = repository.addCareTask({
    careRecipientId: recipientA.id,
    title: "Call clinic",
    dueAt: YESTERDAY
  });
  repository.addCareTask({
    careRecipientId: recipientB.id,
    title: "Pick up reports",
    dueAt: TODAY
  });

  const projection = buildHomeProjection(repository.getSnapshot(), PROTOTYPE_USER_ID, NOW);

  assert.equal(projection.needsAttention[0]?.task.id, taskA.id);
  assert.equal(projection.needsAttention[0]?.recipient.id, recipientA.id);
});

test("completing one recipient's task does not mutate another recipient's state", () => {
  const repository = createInMemoryCareRepository();
  const recipientA = repository.addCareRecipient({ displayName: "Recipient A" });
  const recipientB = repository.addCareRecipient({ displayName: "Recipient B" });
  const taskA = repository.addCareTask({
    careRecipientId: recipientA.id,
    title: "Call clinic",
    dueAt: YESTERDAY
  });
  const taskB = repository.addCareTask({
    careRecipientId: recipientB.id,
    title: "Pick up reports",
    dueAt: YESTERDAY
  });

  repository.completeCareTask(taskA.id, TODAY);
  const snapshot = repository.getSnapshot();

  assert.equal(snapshot.careTasks.find((task) => task.id === taskA.id)?.status, "completed");
  assert.equal(snapshot.careTasks.find((task) => task.id === taskB.id)?.status, "pending");
});

test("CareState does not interpret missing information as positive medical status", () => {
  const careState = deriveCareState([], NOW);

  assert.equal(careState.overdueIncompleteCount, 0);
  assert.equal(careState.dueTodayIncompleteCount, 0);
  assert.equal(careState.needsAttention, false);
  assert.equal(careState.scheduledCareOnTrack, false);
});
