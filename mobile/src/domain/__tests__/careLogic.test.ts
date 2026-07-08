import assert from "node:assert/strict";
import test from "node:test";
import { deriveCareState } from "../careState";
import { isBeforeToday, isToday, parseDueInput } from "../date";
import { buildHomeProjection } from "../homeProjection";
import { getUserScopedRecipient, isRecipientAvailableToUser } from "../selectors";
import { CareData, PROTOTYPE_USER_ID } from "../types";
import { createInMemoryCareRepository, createInitialCareData } from "../../repositories/inMemoryCareRepository";

const NOW = new Date(2026, 6, 8, 12, 0, 0);
const TWO_DAYS_AGO = "2026-07-06";
const YESTERDAY = "2026-07-07";
const TODAY = "2026-07-08";

test("overdue incomplete task appears as needing attention", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const task = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Call clinic",
    dueDate: YESTERDAY
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
    dueDate: YESTERDAY
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
    memberships: [
      { id: "membership_authorized", userId: PROTOTYPE_USER_ID, careRecipientId: "recipient_authorized" },
      { id: "membership_unauthorized", userId: "user_other", careRecipientId: "recipient_unauthorized" }
    ],
    careTasks: [
      {
        id: "task_authorized",
        careRecipientId: "recipient_authorized",
        title: "Call clinic",
        dueDate: YESTERDAY,
        status: "pending"
      },
      {
        id: "task_unauthorized",
        careRecipientId: "recipient_unauthorized",
        title: "Schedule follow-up",
        dueDate: YESTERDAY,
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

test("inaccessible recipient is rejected by the user-scoped recipient selector", () => {
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
    memberships: [
      { id: "membership_authorized", userId: PROTOTYPE_USER_ID, careRecipientId: "recipient_authorized" },
      { id: "membership_unauthorized", userId: "user_other", careRecipientId: "recipient_unauthorized" }
    ]
  };

  assert.equal(isRecipientAvailableToUser(data, PROTOTYPE_USER_ID, "recipient_authorized"), true);
  assert.equal(isRecipientAvailableToUser(data, PROTOTYPE_USER_ID, "recipient_unauthorized"), false);
  assert.equal(getUserScopedRecipient(data, PROTOTYPE_USER_ID, "recipient_unauthorized"), undefined);
});

test("Membership scopes directly to CareRecipient", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const snapshot = repository.getSnapshot();

  assert.equal(snapshot.memberships.length, 1);
  assert.equal(snapshot.memberships[0]?.userId, PROTOTYPE_USER_ID);
  assert.equal(snapshot.memberships[0]?.careRecipientId, recipient.id);
  assert.equal("careCircleId" in snapshot.memberships[0]!, false);
});

test("one recipient's task remains associated with the correct recipient context", () => {
  const repository = createInMemoryCareRepository();
  const recipientA = repository.addCareRecipient({ displayName: "Recipient A" });
  const recipientB = repository.addCareRecipient({ displayName: "Recipient B" });
  const taskA = repository.addCareTask({
    careRecipientId: recipientA.id,
    title: "Call clinic",
    dueDate: YESTERDAY
  });
  repository.addCareTask({
    careRecipientId: recipientB.id,
    title: "Pick up reports",
    dueDate: TODAY
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
    dueDate: YESTERDAY
  });
  const taskB = repository.addCareTask({
    careRecipientId: recipientB.id,
    title: "Pick up reports",
    dueDate: YESTERDAY
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

test("valid YYYY-MM-DD due date is accepted", () => {
  assert.deepEqual(parseDueInput("2026-07-08"), { dueDate: "2026-07-08" });
});

test("invalid due date format is rejected", () => {
  assert.equal(parseDueInput("July 8, 2026").error, "Use a date like YYYY-MM-DD, or leave it blank.");
  assert.equal(parseDueInput("2026-02-31").error, "Use a date like YYYY-MM-DD, or leave it blank.");
});

test("today is not overdue and prior day is overdue", () => {
  assert.equal(isToday(TODAY, NOW), true);
  assert.equal(isBeforeToday(TODAY, NOW), false);
  assert.equal(isBeforeToday(YESTERDAY, NOW), true);
});

test("mutating returned snapshot does not mutate repository-owned state", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const snapshot = repository.getSnapshot();

  snapshot.careRecipients[0]!.displayName = "Mutated";
  snapshot.memberships[0]!.careRecipientId = "mutated_recipient";

  const freshSnapshot = repository.getSnapshot();

  assert.equal(freshSnapshot.careRecipients[0]?.displayName, recipient.displayName);
  assert.equal(freshSnapshot.memberships[0]?.careRecipientId, recipient.id);
});

test("overdue Home attention items are sorted oldest first", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const newer = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Newer overdue",
    dueDate: YESTERDAY
  });
  const older = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Older overdue",
    dueDate: TWO_DAYS_AGO
  });

  const projection = buildHomeProjection(repository.getSnapshot(), PROTOTYPE_USER_ID, NOW);

  assert.deepEqual(
    projection.needsAttention.map((item) => item.task.id),
    [older.id, newer.id]
  );
});
