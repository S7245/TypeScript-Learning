type TaskStatus = "todo" | "doing" | "blocked" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";
type MonitorStatus = "healthy" | "degraded" | "down" | "paused";

type OpsTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string | null;
};

type MonitorCheck = {
  id: string;
  name: string;
  status: MonitorStatus;
  latencyMs: number | null;
  enabled: boolean;
};

type StatusTone = "neutral" | "info" | "warning" | "danger" | "success";

type OpsBoardAlert =
  | {
      kind: "task";
      taskId: string;
      message: string;
      priority: Extract<TaskPriority, "high" | "urgent">;
    }
  | {
      kind: "monitor";
      monitorId: string;
      message: string;
      status: Extract<MonitorStatus, "degraded" | "down">;
    };

const tasks: OpsTask[] = [
  {
    id: "task_triage_alert_rules",
    title: "Triage alert rule defaults",
    status: "doing",
    priority: "high",
    owner: "Platform team",
  },
  {
    id: "task_write_api_contract",
    title: "Write API contract checklist",
    status: "todo",
    priority: "medium",
    owner: null,
  },
  {
    id: "task_fix_incident_export",
    title: "Fix incident export timeout",
    status: "blocked",
    priority: "urgent",
    owner: "SRE team",
  },
];

const monitorChecks: MonitorCheck[] = [
  {
    id: "mon_api_latency",
    name: "API latency",
    status: "degraded",
    latencyMs: 420,
    enabled: true,
  },
  {
    id: "mon_worker_queue",
    name: "Worker queue",
    status: "healthy",
    latencyMs: 80,
    enabled: true,
  },
  {
    id: "mon_billing_webhook",
    name: "Billing webhook",
    status: "paused",
    latencyMs: null,
    enabled: false,
  },
];

function describeTaskStatus(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "Not started";
    case "doing":
      return "In progress";
    case "blocked":
      return "Blocked";
    case "done":
      return "Done";
  }
}

function getTaskTone(task: OpsTask): StatusTone {
  if (task.status === "done") {
    return "success";
  }

  if (task.status === "blocked" || task.priority === "urgent") {
    return "danger";
  }

  if (task.priority === "high") {
    return "warning";
  }

  return "neutral";
}

function describeMonitor(check: MonitorCheck): string {
  if (!check.enabled) {
    return `${check.name} is paused`;
  }

  if (check.status === "healthy") {
    return `${check.name} is healthy at ${check.latencyMs ?? "unknown"}ms`;
  }

  if (check.status === "degraded") {
    return `${check.name} is degraded at ${check.latencyMs ?? "unknown"}ms`;
  }

  return `${check.name} is down`;
}

function isTaskStatus(value: string): value is TaskStatus {
  return (
    value === "todo" ||
    value === "doing" ||
    value === "blocked" ||
    value === "done"
  );
}

function parseTaskStatusFromQuery(value: string | string[] | undefined): TaskStatus {
  const firstValue = Array.isArray(value) ? value[0] : value;

  if (firstValue && isTaskStatus(firstValue)) {
    return firstValue;
  }

  return "todo";
}

function createOpsBoardAlerts(
  taskList: OpsTask[],
  checks: MonitorCheck[],
): OpsBoardAlert[] {
  const taskAlerts = taskList
    .filter((task) => task.status === "blocked" || task.priority === "urgent")
    .map<OpsBoardAlert>((task) => ({
      kind: "task",
      taskId: task.id,
      message: `${task.title} needs attention`,
      priority: task.priority === "urgent" ? "urgent" : "high",
    }));

  const monitorAlerts = checks
    .filter((check) => check.enabled && check.status !== "healthy")
    .map<OpsBoardAlert>((check) => ({
      kind: "monitor",
      monitorId: check.id,
      message: describeMonitor(check),
      status: check.status === "down" ? "down" : "degraded",
    }));

  return [...taskAlerts, ...monitorAlerts];
}

function summarizeAlert(alert: OpsBoardAlert): string {
  switch (alert.kind) {
    case "task":
      return `[task:${alert.priority}] ${alert.message}`;
    case "monitor":
      return `[monitor:${alert.status}] ${alert.message}`;
  }
}

const selectedStatus = parseTaskStatusFromQuery("blocked");

const dashboardSummary = {
  selectedStatus,
  selectedStatusLabel: describeTaskStatus(selectedStatus),
  visibleTasks: tasks
    .filter((task) => task.status === selectedStatus)
    .map((task) => ({
      id: task.id,
      title: task.title,
      tone: getTaskTone(task),
      ownerLabel: task.owner ?? "Unassigned",
    })),
  monitorSummaries: monitorChecks.map(describeMonitor),
  alerts: createOpsBoardAlerts(tasks, monitorChecks).map(summarizeAlert),
};

console.log(JSON.stringify(dashboardSummary, null, 2));
