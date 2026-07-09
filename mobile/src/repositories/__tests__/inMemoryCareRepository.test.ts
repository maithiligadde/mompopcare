import assert from "node:assert/strict";
import test from "node:test";
import { createInMemoryCareRepository } from "../inMemoryCareRepository";

const COMPLETED_AT = "2026-07-08T12:00:00.000Z";

test("mutating the returned CareRecipient does not mutate repository-owned state", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });

  recipient.displayName = "Mutated";

  assert.equal(repository.getSnapshot().careRecipients[0]?.displayName, "Recipient A");
});

test("mutating the returned CareTask does not mutate repository-owned state", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const task = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Call clinic"
  });

  task.title = "Mutated";

  assert.equal(repository.getSnapshot().careTasks[0]?.title, "Call clinic");
});

test("mutating the returned CareEvent does not mutate repository-owned state", () => {
  const repository = createInMemoryCareRepository();
  const recipient = repository.addCareRecipient({ displayName: "Recipient A" });
  const task = repository.addCareTask({
    careRecipientId: recipient.id,
    title: "Call clinic"
  });
  const event = repository.completeCareTask(task.id, COMPLETED_AT);

  assert.ok(event);
  event.summary = "Mutated";

  assert.equal(repository.getSnapshot().careEvents[0]?.summary, "Completed: Call clinic");
});

test("adding a task for an unknown recipient is rejected", () => {
  const repository = createInMemoryCareRepository();

  assert.throws(
    () =>
      repository.addCareTask({
        careRecipientId: "recipient_unknown",
        title: "Call clinic"
      }),
    new Error("Care recipient not found: recipient_unknown")
  );
});

test("rejecting an unknown recipient does not leave an orphan task", () => {
  const repository = createInMemoryCareRepository();

  assert.throws(() =>
    repository.addCareTask({
      careRecipientId: "recipient_unknown",
      title: "Call clinic"
    })
  );

  assert.equal(repository.getSnapshot().careTasks.length, 0);
});
