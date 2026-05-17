# 主题

Day 02 的主题是 **基础类型、字面量类型与联合类型**。

今天继续围绕 OpsBoard Studio 展开。Day 01 建立了 TypeScript 的工程心智：类型是开发期约束，不会改变 JavaScript 运行时。Day 02 开始把这个心智落到业务模型上，用 `string`、`number`、`boolean`、字面量类型、联合类型和类型收窄描述工作台里的任务状态、优先级和监控状态。

本日 syllabus 字段：

- topic：基础类型、字面量类型与联合类型
- focus：string、number、boolean、literal types、union types、类型收窄
- practice：为任务状态、优先级、监控状态建立类型模型
- understanding：类型可以被理解为值的集合，联合类型表达业务可能性。
- codeSlug：primitive_union_types

# 学习重点

今天的学习重点有五个。

第一，理解基础类型不是业务类型。`string`、`number`、`boolean` 能描述 JavaScript 值的基本形态，但不能直接表达 OpsBoard Studio 的业务规则。任务状态如果只写成 `string`，任何字符串都能传入；优先级如果只写成 `number`，调用方也不知道 `1` 和 `4` 分别代表什么。

第二，理解字面量类型把具体值变成类型。例如 `"blocked"` 不只是一个字符串值，也可以成为一个只允许 `"blocked"` 的类型。它适合表达产品中有限、稳定、需要被代码分支识别的枚举值。

第三，理解联合类型表达业务可能性。`"todo" | "doing" | "blocked" | "done"` 的含义不是四个字符串拼在一起，而是任务状态只能从这四种可能性中选择一个。类型可以被理解为值的集合，联合类型就是多个集合的并集。

第四，理解类型收窄。联合类型进入 `if`、`switch`、自定义类型守卫之后，TypeScript 会根据判断条件缩小变量的可能范围。收窄让代码可以在不同业务分支里获得更具体的类型。

第五，理解外部输入仍然需要运行时检查。URL query、接口响应、本地存储和用户输入都可能是任意字符串。TypeScript 可以在你检查之后帮你收窄，但不会自动证明这些外部值属于某个联合类型。

# 项目实践

今天的项目实践是为 OpsBoard Studio 的三个核心概念建立类型模型。

任务状态：

- `todo`：尚未开始
- `doing`：进行中
- `blocked`：被阻塞
- `done`：已完成

任务优先级：

- `low`
- `medium`
- `high`
- `urgent`

监控状态：

- `healthy`
- `degraded`
- `down`
- `paused`

为什么这样设计？因为 OpsBoard Studio 是 B2B 工作台，任务、监控和告警会贯穿列表筛选、状态徽标、通知规则、仪表盘摘要和后续 API 契约。如果这些状态一开始用宽泛的 `string` 表示，后续组件和接口会各自发明字符串，导致 `"in-progress"`、`"doing"`、`"progress"` 这类不一致状态混入系统。

用字面量联合类型的好处是把产品语言变成编译器可检查的边界。状态新增、删除或改名时，编译器会推动你修正所有相关分支，而不是等用户在页面上看到空白标签或错误颜色。

# 核心理解

类型可以被理解为值的集合，联合类型表达业务可能性。

`string` 是一个很大的集合，包含所有字符串。`"blocked"` 是一个很小的集合，只包含一个值。`"todo" | "doing" | "blocked" | "done"` 是由四个单值集合组成的新集合。

这个视角比“类型就是注释”更准确。TypeScript 不是只给变量贴标签，而是在帮你管理一个值可以处于哪些状态。OpsBoard Studio 的任务状态不能是任意字符串，因为产品里没有无限多个状态；监控状态也不能混入 `"ok"`、`"failed"`、`"warning"` 这些未约定值，因为它们会破坏 UI 显示和告警规则的一致性。

今天要形成的工程判断是：当某个字段的合法值是有限集合，并且这些值会驱动分支逻辑、筛选条件、视觉样式或权限规则时，应优先考虑字面量联合类型。

# 参考源

今天只使用 syllabus 指定的参考源：

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html

阅读顺序建议如下。

先读 Everyday Types，重点看 `string`、`number`、`boolean`、literal types、union types。再读 Narrowing，重点看 `typeof`、truthiness narrowing、equality narrowing、`in` operator narrowing 和自定义类型守卫。今天不需要追求读完所有细节，核心是理解“变量的可能值集合如何随着代码分支变小”。

# 今日目标

完成今天后，你应该能做到五件事。

第一，能解释基础类型、字面量类型、联合类型的区别。

第二，能把 OpsBoard Studio 的任务状态、任务优先级和监控状态建模为有限集合。

第三，能使用 `if` 和 `switch` 让 TypeScript 自动收窄联合类型。

第四，能写一个自定义类型守卫，把 URL query 或外部字符串安全转换为业务联合类型。

第五，能说明为什么 TypeScript 的联合类型不能替代运行时数据校验。

推荐学习时间分配：

- 15 分钟：阅读 syllabus 与今天 README，确认 Day 02 的业务模型。
- 20 分钟：阅读 Everyday Types 中基础类型、字面量类型、联合类型部分。
- 25 分钟：阅读 Narrowing 中 `if`、`switch` 和类型守卫示例。
- 30 分钟：阅读并改写 `Day02_primitive_union_types.ts`。
- 20 分钟：完成项目任务拆解和自测问题。

# 知识展开

## 基础类型的边界

基础类型是 TypeScript 最直接的类型工具：

```ts
const taskTitle: string = "Fix incident export timeout";
const latencyMs: number = 420;
const enabled: boolean = true;
```

这些类型适合描述值的底层形态。`taskTitle` 确实应该是字符串，`latencyMs` 确实应该是数字，`enabled` 确实应该是布尔值。

但基础类型的问题是范围太宽。`string` 包含所有字符串，所以它不能表达“这个字段只允许四种任务状态”。`number` 包含所有数字，所以它也不适合表达“优先级只允许 1 到 4”。如果用基础类型建模业务状态，编译器只能检查形态，无法检查业务含义。

## 字面量类型让值成为约束

字面量类型把具体值提升为类型：

```ts
type BlockedStatus = "blocked";
```

这个类型只允许一个值。单独看它似乎过窄，但它可以组合成联合类型：

```ts
type TaskStatus = "todo" | "doing" | "blocked" | "done";
```

这段代码表达了一个产品决策：任务状态只有四种。调用方不能传 `"inProgress"`，也不能传 `"archived"`。如果产品未来新增 `reviewing`，应该显式改类型，然后让编译器指出所有需要处理新状态的位置。

## 联合类型表达状态空间

联合类型的价值在于表达“一个值可能是 A，也可能是 B”。在 OpsBoard Studio 中，很多字段天然是状态空间：

```ts
type TaskPriority = "low" | "medium" | "high" | "urgent";
type MonitorStatus = "healthy" | "degraded" | "down" | "paused";
```

这些类型不仅给编辑器自动补全，也保护业务规则。例如告警生成函数可以只接受高优或紧急任务；监控告警可以只从 `degraded` 和 `down` 生成。今天代码里使用 `Extract` 从已有联合类型中取子集，避免重新声明重复字符串：

```ts
type CriticalPriority = Extract<TaskPriority, "high" | "urgent">;
```

这样做的设计原因是保持事实源单一。任务优先级的全量集合只定义一次，告警逻辑从全量集合中派生自己需要的子集。

## 类型收窄

当一个变量是联合类型时，TypeScript 需要知道当前分支里它到底是哪一种。比如：

```ts
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
```

在 `case "blocked"` 分支里，TypeScript 知道 `status` 已经从 `TaskStatus` 收窄为 `"blocked"`。这种收窄不只是语法方便，它让每个业务分支都能获得更准确的类型。

`if` 也可以收窄：

```ts
function getTaskTone(task: OpsTask): StatusTone {
  if (task.status === "blocked" || task.priority === "urgent") {
    return "danger";
  }

  return "neutral";
}
```

这里 `task.status === "blocked"` 和 `task.priority === "urgent"` 都是 equality narrowing。它们把原本较宽的联合类型缩小到某个具体字面量。

## 深入点：类型推导如何保护字面量信息

TypeScript 会根据声明方式决定推导宽度。

```ts
let status = "blocked";
```

这里 `status` 通常会被推导为 `string`，因为 `let` 变量后续可以被重新赋值。编译器不能假设它永远是 `"blocked"`。

```ts
const status = "blocked";
```

这里 `status` 会被推导为 `"blocked"`，因为 `const` 变量不能重新赋值。字面量信息被保留下来。

这个差异在真实项目里很重要。状态配置、筛选选项和权限动作如果用 `const` 或 `as const` 保存，TypeScript 就能从值推导出更窄的类型。反过来，如果你过早把它们写成 `string[]`，字面量信息就丢失了，后续只能得到宽泛的 `string`。

今天代码没有急着把所有状态放进数组再推导类型，是为了先强调联合类型本身的含义。后续 Day 07 会进一步学习 `keyof`、`typeof`、索引访问和映射类型，把“从事实源派生类型”系统化。

## 深入点：运行时行为不会因为联合类型自动变安全

下面这个函数接收 URL query 风格的输入：

```ts
function parseTaskStatusFromQuery(value: string | string[] | undefined): TaskStatus {
  const firstValue = Array.isArray(value) ? value[0] : value;

  if (firstValue && isTaskStatus(firstValue)) {
    return firstValue;
  }

  return "todo";
}
```

`value` 来自外部世界，所以类型是 `string | string[] | undefined`。即使业务上你希望它是 `TaskStatus`，也不能直接断言：

```ts
const status = value as TaskStatus;
```

这会让编译器安静，但不会阻止用户访问 `?status=broken`。正确做法是用 `isTaskStatus` 逐项检查。检查通过之后，TypeScript 才能把 `firstValue` 从 `string` 收窄为 `TaskStatus`。

这就是 TypeScript 与运行时行为的边界：类型系统能根据你的代码判断缩小范围，但外部输入的真实性必须靠运行时代码验证。

# 代码示例

当天示例文件是：

```text
Days/Day02/Day02_primitive_union_types.ts
```

核心代码从三个业务类型开始：

```ts
type TaskStatus = "todo" | "doing" | "blocked" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";
type MonitorStatus = "healthy" | "degraded" | "down" | "paused";
```

这三个类型分别对应 OpsBoard Studio 的任务流、优先级规则和监控状态。它们比 `string` 更严格，也比 enum 更轻量，适合在前端应用、接口契约和测试数据中直接使用。

任务模型使用了基础类型和联合类型：

```ts
type OpsTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string | null;
};
```

`owner: string | null` 表达一个真实业务状态：任务可能还没有负责人。这里不用空字符串表示未分配，因为空字符串也是字符串，无法区分“真的没有负责人”和“数据被错误填成空值”。`null` 把这个状态显式暴露出来，调用方必须处理。

监控模型加入 `number | null` 和 `boolean`：

```ts
type MonitorCheck = {
  id: string;
  name: string;
  status: MonitorStatus;
  latencyMs: number | null;
  enabled: boolean;
};
```

当监控被暂停时，延迟可能不存在，所以 `latencyMs` 是 `number | null`。这比随意填 `0` 更准确，因为 `0ms` 和“没有延迟数据”是两个不同含义。

告警模型使用可辨识联合：

```ts
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
```

这里的 `kind` 是辨识字段。`kind: "task"` 分支有 `taskId` 和高优先级；`kind: "monitor"` 分支有 `monitorId` 和异常监控状态。后续代码只要判断 `alert.kind`，TypeScript 就能知道当前分支里有哪些字段。

# 项目任务拆解

1. 打开 `Course/syllabus.json`，确认 Day 02 的主题、focus、practice、understanding、reference 和 codeSlug。

2. 阅读 `Days/Day02/Day02_primitive_union_types.ts`，先不要改代码，只标出所有基础类型、字面量类型和联合类型。

3. 在纸上或笔记里画出 `TaskStatus` 的值集合：`todo`、`doing`、`blocked`、`done`。再画出 `MonitorStatus` 的值集合。

4. 运行或阅读 `describeTaskStatus`，观察 `switch` 如何把 `TaskStatus` 收窄到每个具体字面量。

5. 阅读 `parseTaskStatusFromQuery`，解释为什么它的参数不是直接写成 `TaskStatus`。

6. 添加一个新类型 `ApiEndpointStatus = "online" | "slow" | "offline"`，再写一个函数把它转换成 `StatusTone`。

7. 把一个任务的 `status` 改成 `"in-progress"`，观察 TypeScript 为什么应该报错。完成后改回合法状态。

8. 扩展 `createOpsBoardAlerts`，让 `high` 优先级且 `blocked` 的任务生成更明确的消息。

# 常见误区

误区一：认为 `string` 已经足够表达状态。`string` 只能表达“这是字符串”，不能表达“只能是四种任务状态之一”。真实项目中状态字段越靠近业务核心，越不应该随便放宽成 `string`。

误区二：把联合类型当成运行时校验。`type TaskStatus = ...` 不会在浏览器里生成检查逻辑。外部数据进入系统时，仍然需要显式判断。

误区三：滥用 `as`。`as TaskStatus` 可以压过编译器，但它不能让非法字符串变合法。`as` 应该用于你确实比编译器知道更多的窄场景，不应该作为跳过建模和校验的默认手段。

误区四：状态命名和产品语言脱节。如果产品、设计、后端和前端使用不同状态词，联合类型只能在局部制造整洁，无法解决系统级不一致。真实项目中应尽早统一词汇表。

误区五：把 `null`、`undefined` 和空字符串混用。`owner: string | null` 表示任务可能未分配；`owner: ""` 只是一个空字符串。状态表达越明确，后续组件分支越简单。

# 自测问题

1. 为什么 `TaskStatus` 不应该直接写成 `string`？

2. `const status = "blocked"` 和 `let status = "blocked"` 在类型推导上有什么区别？

3. `owner: string | null` 比 `owner: string` 更准确的业务原因是什么？

4. `parseTaskStatusFromQuery` 为什么要处理 `string[] | undefined`？

5. `isTaskStatus(value: string): value is TaskStatus` 中的 `value is TaskStatus` 起什么作用？

6. 为什么 `as TaskStatus` 不能替代 `isTaskStatus`？

7. `OpsBoardAlert` 为什么要用 `kind` 字段区分告警类型？

8. 如果产品新增任务状态 `reviewing`，哪些代码位置应该被重新检查？

# 验收标准

今天完成后，你的本地成果应满足这些标准：

- `Days/Day02/README.md` 存在，并包含 syllabus 要求的 Day 02 教程内容。
- `Days/Day02/Day02_primitive_union_types.ts` 存在，文件名使用 syllabus 中的 `codeSlug`。
- 代码中至少包含任务状态、任务优先级和监控状态三个联合类型。
- 代码中至少包含一个使用 `switch` 或 `if` 的类型收窄示例。
- 代码中至少包含一个自定义类型守卫，用来把外部字符串收窄为业务联合类型。
- 你能解释为什么这些类型服务于 OpsBoard Studio，而不是只为了展示 TypeScript 语法。
- 你能解释 TypeScript 类型检查和运行时校验的边界。

# 明日衔接

明天 Day 03 会进入 **对象类型、接口与结构化类型系统**。

今天我们只定义了若干状态和简单对象。明天会进一步建模 `User`、`Workspace`、`Project`、`MetricCard`，重点理解 `type`、`interface`、可选属性、只读属性和 excess property checks。Day 02 的联合类型会成为 Day 03 对象属性的一部分：对象不是孤立字段的堆砌，而是由多个受约束的值集合组合出来的业务形状。

# GitHub Commit

- 仓库：`/Users/liushan/Documents/Codex/TypeScript-Learning`
- 代码目录：`Days/Day02/`
- Commit：待提交
- Commit 链接：待推送后生成
- Push 状态：待执行
