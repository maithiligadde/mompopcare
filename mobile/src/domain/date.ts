export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isBeforeToday(isoDate: string | undefined, now: Date): boolean {
  if (!isoDate) {
    return false;
  }

  const dueDate = new Date(isoDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return startOfLocalDay(dueDate).getTime() < startOfLocalDay(now).getTime();
}

export function isToday(isoDate: string | undefined, now: Date): boolean {
  if (!isoDate) {
    return false;
  }

  const dueDate = new Date(isoDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return startOfLocalDay(dueDate).getTime() === startOfLocalDay(now).getTime();
}

export function parseDueInput(input: string): { dueAt?: string; error?: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return {};
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? new Date(`${trimmed}T12:00:00`) : new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return { error: "Use a date like YYYY-MM-DD, or leave it blank." };
  }

  return { dueAt: date.toISOString() };
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

  return `Due ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(isoDate))}`;
}

export function formatEventTimestamp(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(isoDate));
}
