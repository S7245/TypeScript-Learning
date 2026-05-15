# TypeScript 50 天高级学习计划

这是一个围绕 `OpsBoard Studio` 连续项目展开的 TypeScript 全栈专项课程仓库。

课程目标是在 50 天内系统掌握 TypeScript、React、Next.js、Zustand、TanStack Query、Zod、Tailwind CSS、shadcn/ui、Playwright、ESLint、Prettier、GitHub Actions 与 Monorepo 工程组织。

## 目录

- `Course/syllabus.json`：课程唯一事实源。
- `Days/DayNN/`：每日课程代码与练习文件，由每日自动化按日期生成。

## 自动化规则

- 开始日期：2026-05-16
- 每日时间：12:00
- 时区：Asia/Shanghai
- 当天编号：`当前日期 - startDate + 1`

每日自动化会先读取 `Course/syllabus.json`，再根据当天条目生成 Notion 内容、代码目录、提交和推送记录。
