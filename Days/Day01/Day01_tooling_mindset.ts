type MetricUnit = "ms" | "%" | "count";

type WorkspaceSummary = {
  id: string;
  name: string;
  activeProjects: number;
};

type MetricCard = {
  id: string;
  label: string;
  value: number;
  unit: MetricUnit;
};

const taskStatuses = ["todo", "doing", "blocked", "done"] as const;

type TaskStatus = (typeof taskStatuses)[number];

type OpsTask = {
  id: string;
  title: string;
  status: TaskStatus;
  owner?: string;
};

const workspace: WorkspaceSummary = {
  id: "ws_opsboard",
  name: "OpsBoard Studio",
  activeProjects: 3,
};

const metrics: MetricCard[] = [
  {
    id: "metric_api_latency",
    label: "API latency",
    value: 128,
    unit: "ms",
  },
  {
    id: "metric_error_rate",
    label: "Error rate",
    value: 0.7,
    unit: "%",
  },
  {
    id: "metric_open_tasks",
    label: "Open tasks",
    value: 42,
    unit: "count",
  },
];

const tasks: OpsTask[] = [
  {
    id: "task_review_alerts",
    title: "Review alert threshold defaults",
    status: "doing",
    owner: "Platform team",
  },
  {
    id: "task_api_contract",
    title: "Draft API contract checklist",
    status: "todo",
  },
];

function formatMetricValue(metric: MetricCard): string {
  return `${metric.value}${metric.unit}`;
}

function getTasksByStatus(status: TaskStatus): OpsTask[] {
  return tasks.filter((task) => task.status === status);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMetricUnit(value: unknown): value is MetricUnit {
  return value === "ms" || value === "%" || value === "count";
}

function parseUnknownMetric(input: unknown): MetricCard | null {
  if (!isRecord(input)) {
    return null;
  }

  if (
    typeof input.id === "string" &&
    typeof input.label === "string" &&
    typeof input.value === "number" &&
    isMetricUnit(input.unit)
  ) {
    return {
      id: input.id,
      label: input.label,
      value: input.value,
      unit: input.unit,
    };
  }

  return null;
}

const maybeMetricFromApi: unknown = {
  id: "metric_deploy_count",
  label: "Deploys today",
  value: 9,
  unit: "count",
};

const parsedMetric = parseUnknownMetric(maybeMetricFromApi);

if (parsedMetric) {
  metrics.push(parsedMetric);
}

const dashboardSnapshot = {
  workspace,
  visibleMetrics: metrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
    formattedValue: formatMetricValue(metric),
  })),
  blockedTasks: getTasksByStatus("blocked"),
};

console.log(JSON.stringify(dashboardSnapshot, null, 2));
