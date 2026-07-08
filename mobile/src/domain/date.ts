export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isBeforeToday(isoDate: string | undefined, now: Date): boolean {
  if (!isoDate) {
    return false;
  }

  const dueDate = parseDateOnly(isoDate);

  if (!dueDate) {
    return false;
  }

  return startOfLocalDay(dueDate).getTime() < startOfLocalDay(now).getTime();
}

export function isToday(isoDate: string | undefined, now: Date): boolean {
  if (!isoDate) {
    return false;
  }

  const dueDate = parseDateOnly(isoDate);

  if (!dueDate) {
    return false;
  }

  return startOfLocalDay(dueDate).getTime() === startOfLocalDay(now).getTime();
}

export function parseDueInput(input: string): { dueAt?: string; error?: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return {};
  }

  if (!parseDateOnly(trimmed)) {
    return { error: "Use a date like YYYY-MM-DD, or leave it blank." };
  }

  return { dueAt: trimmed };
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDueLabel(isoDate: string | undefined, now: Date): string {
  if (!isoDate) {
    return "No due date";
  }

  if (isBeforeToday(isoDate, now)) {
    return "Overdue";
  }

  if (isToday(isoDate, now)) {
    return "Due today";
  }

  const dueDate = parseDateOnly(isoDate);

  if (!dueDate) {
    return "No due date";
  }

  return `Due ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(dueDate)}`;
}

export function formatEventTimestamp(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(isoDate));
}

function parseDateOnly(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);

  if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== day) {
    return undefined;
  }

  return date;
}
