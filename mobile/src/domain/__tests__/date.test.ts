import assert from "node:assert/strict";
import test from "node:test";
import { formatDateInput, getNextLocalMidnight } from "../date";

test("next local midnight uses the next local calendar day", () => {
  const nextMidnight = getNextLocalMidnight(new Date(2026, 6, 8, 18, 42, 17, 123));

  assert.deepEqual(
    [
      nextMidnight.getFullYear(),
      nextMidnight.getMonth(),
      nextMidnight.getDate(),
      nextMidnight.getHours(),
      nextMidnight.getMinutes(),
      nextMidnight.getSeconds(),
      nextMidnight.getMilliseconds()
    ],
    [2026, 6, 9, 0, 0, 0, 0]
  );
});

test("next local midnight handles a local year boundary", () => {
  const nextMidnight = getNextLocalMidnight(new Date(2026, 11, 31, 23, 59, 59, 999));

  assert.deepEqual(
    [nextMidnight.getFullYear(), nextMidnight.getMonth(), nextMidnight.getDate(), nextMidnight.getHours()],
    [2027, 0, 1, 0]
  );
});

test("date input formats progressively as digits are typed", () => {
  assert.equal(formatDateInput("2"), "2");
  assert.equal(formatDateInput("2026"), "2026");
  assert.equal(formatDateInput("20260"), "2026-0");
  assert.equal(formatDateInput("202607"), "2026-07");
});

test("date input formats a full eight-digit value", () => {
  assert.equal(formatDateInput("20260708"), "2026-07-08");
});

test("date input preserves the result of an already-hyphenated paste", () => {
  assert.equal(formatDateInput("2026-07-08"), "2026-07-08");
});

test("date input truncates digits beyond a complete date", () => {
  assert.equal(formatDateInput("20260708123"), "2026-07-08");
});

test("date input ignores non-digit characters predictably", () => {
  assert.equal(formatDateInput("20ab26 / 07.day08"), "2026-07-08");
});
