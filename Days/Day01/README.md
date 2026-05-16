# 主题

Day 01 的主题是 **TypeScript 学习环境与工程心智**。

今天不急着写复杂业务功能，而是先把 OpsBoard Studio 放进一个可长期演进的工程框架里。OpsBoard Studio 是一个面向 B2B 团队的数据监控、任务协作与 API 管理工作台，后续 50 天会逐步加入领域模型、React/Next.js 页面、状态管理、数据请求、表单校验、测试和 CI。第一天要建立的不是某个页面，而是一个判断标准：哪些问题应该交给 TypeScript 静态检查，哪些问题必须交给 JavaScript 运行时、测试或服务端校验。

本日 syllabus 字段：

- topic：TypeScript 学习环境与工程心智
- focus：tsc、tsconfig、strict 模式、TypeScript 与 JavaScript 的关系
- practice：初始化 OpsBoard Studio 仓库结构，创建 Course/syllabus.json 与 Days/Day01/
- understanding：TypeScript 是静态类型层，不改变 JavaScript 运行时行为。
- codeSlug：tooling_mindset

# 学习重点

今天的学习重点有四个。

第一，理解 `tsc` 的角色。`tsc` 是 TypeScript 编译器，它可以做两类事情：把 `.ts` 编译为 `.js`，以及在不输出文件的情况下执行类型检查。真实项目中，Next.js、Vite、Babel、SWC 或 tsup 可能负责转译，但 `tsc --noEmit` 依然常被保留为独立的类型质量门禁。

第二，理解 `tsconfig.json` 是工程契约。它不是装饰文件，而是项目对类型检查范围、模块系统、目标运行环境、JSX 处理方式、路径别名和严格程度的统一声明。多人协作时，`tsconfig` 的价值在于让大家在同一套边界下写代码。

第三，理解 `strict` 模式。`strict: true` 是一组严格检查的总开关，它会启用更保守的空值、隐式 any、函数参数、属性初始化等检查。它会让初期报错更多，但这些报错通常对应真实项目里最容易被忽略的边界。

第四，理解 TypeScript 与 JavaScript 的关系。TypeScript 在开发和构建阶段提供静态类型信息，最终运行的是 JavaScript。类型不会自动出现在运行时，也不会阻止后端返回错误数据、浏览器 API 抛异常或用户输入非法内容。

# 项目实践

今天的项目实践是创建 `Days/Day01/`，并用一个小型 TypeScript 文件表达 OpsBoard Studio 的工程心智。

这个目录在课程中有两个职责：

- `README.md`：当天的 Notion 教程正文，也可以作为本地复习材料。
- `Day01_tooling_mindset.ts`：当天可读、可 typecheck 的代码示例。

为什么第一天只放一个 `.ts` 文件，而不是直接搭建完整 Next.js 应用？因为 syllabus 的主题是 TypeScript 学习环境与工程心智，重点是 `tsc`、`tsconfig`、`strict` 和 TS/JS 的关系。过早引入 React、Next.js、Tailwind 或数据请求，会把注意力从类型系统边界转移到框架细节上。

OpsBoard Studio 的连续项目可以先用领域语言启动：

- workspace：团队工作区
- project：业务项目
- metric：监控指标
- task：协作任务
- api endpoint：API 状态与契约

今天的代码只选择 `workspace`、`metric`、`task` 三个概念，刻意保持小范围。工程上这叫控制建模半径：第一天先让类型检查、推导和运行时边界讲清楚，再逐步扩展。

# 核心理解

TypeScript 是静态类型层，不改变 JavaScript 运行时行为。

这句话是今天最重要的边界。比如下面这个函数：

```ts
function formatMetricValue(value: number, unit: string): string {
  return `${value}${unit}`;
}
```

当你在 TypeScript 源码里调用 `formatMetricValue("99", "%")`，编译器会报错，因为 `"99"` 不是 `number`。但如果这段代码被编译成 JavaScript 后，运行时从接口拿到了字符串 `"99"`，JavaScript 不会因为 TypeScript 类型标注而自动拒绝它。

所以真实项目里要分清三层边界：

- 静态边界：TypeScript 负责在开发期发现不合理的调用、对象形状和空值风险。
- 运行时边界：API 响应、用户输入、本地存储、URL 参数等外部数据必须在运行时校验。
- 工程边界：`tsconfig`、目录结构、脚本和 CI 把个人习惯变成团队规则。

OpsBoard Studio 后续会用 Zod 处理运行时校验，用 TanStack Query 处理远程状态，用 Playwright 处理端到端行为验证。今天先不要把这些工具混在一起，只要明确 TypeScript 自己能做什么，不能做什么。

# 参考源

今天只使用 syllabus 指定的参考源：

- https://www.typescriptlang.org/docs/handbook/intro.html
- https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
- https://www.typescriptlang.org/tsconfig/strict.html

阅读顺序建议如下。

先读 Handbook Intro，建立 TypeScript 是 JavaScript 的带类型超集这个基本判断。再读 `tsconfig.json` 文档，理解工程配置如何决定编译器的行为。最后读 `strict` 配置，了解严格模式为什么适合作为新项目默认值。

# 今日目标

完成今天后，你应该能做到四件事。

第一，能解释 `tsc`、`tsconfig`、`strict` 各自解决什么问题。

第二，能说清楚 TypeScript 类型检查为什么不能替代运行时校验。

第三，能为 OpsBoard Studio 写出最小领域类型，并利用类型推导减少重复标注。

第四，能判断一个问题属于静态类型边界、工程配置边界，还是运行时行为边界。

推荐学习时间分配：

- 15 分钟：阅读 syllabus 与今天 README，确认学习目标。
- 20 分钟：阅读 TypeScript 官方 intro 与 tsconfig 文档。
- 25 分钟：阅读 `Day01_tooling_mindset.ts`，观察类型推导和运行时行为边界。
- 20 分钟：按项目任务拆解完成手写练习。
- 10 分钟：回答自测问题并对照验收标准。

# 知识展开

## `tsc` 的两种心智

`tsc` 可以被理解为编译器，也可以被理解为类型审查器。

作为编译器时，它把 TypeScript 转成 JavaScript。比如 `const name: string = "OpsBoard"` 中的 `: string` 会在输出 JS 时消失，因为类型标注只是开发期信息。

作为类型审查器时，它检查代码是否符合类型规则。真实项目里常见脚本是：

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

`--noEmit` 的意思是不输出 JS，只检查类型。这在 Next.js 项目中很常见，因为框架构建本身可能已经负责转译，但团队仍然需要独立的类型门禁。

## `tsconfig` 是边界文件

`tsconfig.json` 决定编译器看到哪些文件，以及用什么规则解释这些文件。

几个重要配置的工程含义：

- `target`：决定输出 JS 语法目标，例如 ES2022。
- `module`：决定模块输出形式，例如 ESNext 或 NodeNext。
- `strict`：打开严格类型检查。
- `noEmit`：只做类型检查，不生成输出。
- `include`：明确哪些源码进入类型检查范围。
- `paths`：为大型项目提供路径别名，但必须和构建工具保持一致。

常见误区是只在编辑器里看到类型提示，却没有在 CI 或脚本中运行 `tsc --noEmit`。这样会导致本地看起来正常，但主分支没有稳定的类型质量门禁。

## `strict` 的意义

`strict` 不是为了让代码显得更高级，而是为了让不确定性尽早暴露。

例如从 API 获取的任务负责人可能为空。如果不开启严格空值检查，代码可能直接访问 `assignee.name`。开启严格模式后，TypeScript 会要求你先处理 `undefined` 或 `null` 的可能性。这个要求本质上是在提醒你：业务流程里确实存在“任务还未分配”的状态。

在 OpsBoard Studio 里，严格模式会影响很多核心场景：

- 监控指标可能尚未加载。
- API 健康状态可能来自失败响应。
- 任务可能没有负责人或截止日期。
- 用户权限可能缺少某个动作授权。

这些都不是语法问题，而是产品真实状态。`strict` 的价值是把这些状态提前带到代码设计阶段。

## 深入点：类型推导和运行时行为的分界

TypeScript 的类型推导可以从值推导出类型。例如：

```ts
const defaultMetric = {
  id: "metric_latency",
  label: "API latency",
  value: 128,
  unit: "ms",
};
```

编译器会推导 `defaultMetric.value` 是 `number`，`defaultMetric.unit` 是 `string`。这减少了重复标注。

但是推导来自源码中已经存在的值，不来自运行时外部世界。下面这种数据即使你写了类型断言，也不会被自动校验：

```ts
const metric = JSON.parse(rawJson) as Metric;
```

`as Metric` 只是告诉编译器“请把它当作 Metric”，并没有检查 JSON 的实际内容。这就是 TypeScript 的边界。后续课程遇到 Zod 时，会专门处理这个问题：把未知运行时数据解析成可信类型。

# 代码示例

当天示例文件是：

```text
Days/Day01/Day01_tooling_mindset.ts
```

核心代码包含三层内容。

第一层是领域类型：

```ts
type MetricUnit = "ms" | "%" | "count";

type MetricCard = {
  id: string;
  label: string;
  value: number;
  unit: MetricUnit;
};
```

这里的 `MetricUnit` 是字面量联合类型。它表达 OpsBoard Studio 当前支持的指标单位集合。比起随便用 `string`，它更贴近业务边界：不是所有字符串都能成为合法单位。

第二层是从事实源推导类型：

```ts
const taskStatuses = ["todo", "doing", "blocked", "done"] as const;
type TaskStatus = (typeof taskStatuses)[number];
```

这段代码体现类型推导的价值。`taskStatuses` 是运行时代码可用的数组，`TaskStatus` 是从数组推导出来的类型。这样未来增加状态时，只改一个事实源。

第三层是运行时边界示例：

```ts
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
    return input;
  }

  return null;
}
```

这个函数说明：当数据来自 `unknown`，必须先做运行时检查。TypeScript 可以帮助你在检查之后收窄类型，但不会替你检查外部数据。

# 项目任务拆解

今天的任务按顺序完成。

1. 确认课程事实源

打开 `Course/syllabus.json`，只以其中的 `course` 和 `days` 为准。今天是 Day 01，因为 `course.startDate` 是 `2026-05-16`，当前日期按 `course.timezone` 计算也是 `2026-05-16`。

2. 创建当天目录

创建 `Days/Day01/`，并在目录中放入 `README.md` 和 `Day01_tooling_mindset.ts`。

3. 阅读代码中的领域模型

重点看 `WorkspaceSummary`、`MetricCard`、`OpsTask`。不要急着扩展字段，先观察每个类型是否有明确业务意义。

4. 观察类型推导

重点看 `taskStatuses` 和 `TaskStatus`。理解 `(typeof taskStatuses)[number]` 为什么可以从数组值推导出联合类型。

5. 观察运行时边界

重点看 `parseUnknownMetric`。它没有使用 `as MetricCard` 强行断言，而是逐项检查外部输入。

6. 手写一个扩展

新增一个 `ApiEndpointStatus` 类型，至少包含 `healthy`、`degraded`、`down` 三个状态。再写一个函数把状态转换成 OpsBoard Studio 页面上要展示的短文本。

# 常见误区

误区一：以为 TypeScript 会让运行时更安全。

TypeScript 会让开发期更可控，但运行时仍然是 JavaScript。接口返回错误结构、浏览器环境缺少 API、用户输入非法值，这些都需要运行时校验、错误处理和测试。

误区二：过早使用 `any`。

`any` 会关闭类型检查。对于外部数据，第一选择通常应该是 `unknown`，然后通过类型守卫、解析函数或后续课程中的 Zod schema 收窄。

误区三：把 `tsconfig` 当作可以复制粘贴的模板。

`tsconfig` 必须匹配项目运行环境。Node 脚本、浏览器应用、Next.js 应用、库包和 monorepo 包的配置边界都不同。今天暂时不创建完整配置，是为了先理解配置含义。

误区四：把类型标注写得越多越好。

优秀 TypeScript 代码不是到处写类型，而是在工程边界、函数输入、外部数据和公共 API 上写清楚类型，在局部变量上利用推导减少噪音。

误区五：忽略 `strict` 迁移成本。

老项目开启 `strict` 可能会产生大量错误。真实团队中可以分阶段迁移，但新项目应该尽早开启严格模式，否则后续补成本更高。

# 自测问题

1. `tsc --noEmit` 和直接运行构建工具有什么区别？

2. 为什么说 TypeScript 类型不会改变 JavaScript 运行时行为？

3. `unknown` 和 `any` 在处理外部数据时有什么差异？

4. `const statuses = ["todo", "done"] as const` 中的 `as const` 起什么作用？

5. 为什么 `tsconfig.json` 可以被看作工程边界文件？

6. 在 OpsBoard Studio 中，哪些数据应该在运行时校验，而不能只依赖 TypeScript 类型？

7. 新项目为什么建议尽早开启 `strict`？

# 验收标准

今天完成后，应满足这些标准。

- 已存在 `Days/Day01/README.md`。
- 已存在 `Days/Day01/Day01_tooling_mindset.ts`。
- README 包含 syllabus 要求的主题、学习重点、项目实践、核心理解、参考源，并扩展为可支撑 60-120 分钟学习的教程。
- 代码示例围绕 OpsBoard Studio，不是孤立的 TypeScript 语法片段。
- 代码中至少出现一个从运行时值推导类型的例子。
- 代码中至少出现一个外部 `unknown` 数据的运行时检查例子。
- 能用自己的话解释 TypeScript 静态类型和 JavaScript 运行时之间的边界。

# 明日衔接

明天 Day 02 会进入 **基础类型、字面量类型与联合类型**，并为任务状态、优先级、监控状态建立类型模型。

今天的 `MetricUnit`、`TaskStatus` 已经提前触碰了字面量类型和联合类型。明天会把这些概念系统化，并继续扩展 OpsBoard Studio 的任务状态、优先级和监控状态模型。

今天要带到明天的问题是：业务状态应该用随意的字符串表达，还是用受约束的类型集合表达？这个问题会直接影响 UI 渲染、筛选条件、API 参数和测试覆盖。

# GitHub Commit

本地 README 在提交前生成，最终 commit SHA、commit 链接和 push 状态会同步到 Notion 的 Day 01 页面底部。

