import { isBeforeToday, isToday } from "./date";
import { CareStateSummary, CareTask } from "./types";

export function deriveCareState(tasks: CareTask[], now: Date): CareStateSummary {
  const overdueIncompleteCount = tasks.filter((task) => task.status === "pending" && isBeforeToday(task.dueDate, now)).length;
  const dueTodayIncompleteCount = tasks.filter((task) => task.status === "pending" && isToday(task.dueDate, now)).length;
  const dueTodayTaskCount = tasks.filter((task) => isToday(task.dueDate, now)).length;

  return {
    overdueIncompleteCount,
    dueTodayIncompleteCount,
    needsAttention: overdueIncompleteCount > 0,
    scheduledCareOnTrack: dueTodayTaskCount > 0 && overdueIncompleteCount === 0 && dueTodayIncompleteCount === 0
  };
}

export function formatCareSummary(careState: CareStateSummary): string {
  if (careState.overdueIncompleteCount === 1) {
    return "1 item needs attention";
  }

  if (careState.overdueIncompleteCount > 1) {
    return `${careState.overdueIncompleteCount} items need attention`;
  }

  if (careState.dueTodayIncompleteCount === 1) {
    return "1 task due today";
  }

  if (careState.dueTodayIncompleteCount > 1) {
    return `${careState.dueTodayIncompleteCount} tasks due today`;
  }

  if (careState.scheduledCareOnTrack) {
    return "Today's scheduled care is on track";
  }

  return "No tasks need attention";
}
