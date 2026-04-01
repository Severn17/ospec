# 提示词文档

## 原则

给 OSpec 的提示词应该尽量短，只表达清楚意图，不需要把内部检查清单整段写进去。

OSpec 应该在内部自动展开检查、初始化、知识层维护和 change 流程这些规则。

## 推荐提示词

### 初始化项目

推荐默认写法：

```text
使用 OSpec 初始化这个项目。
```

这里默认应包含：

- 执行 `ospec init`，把仓库带到 `change-ready`
- 用户不需要先要求执行 `ospec status`
- 如果当前是 AI 协作流程且项目上下文缺失，只追问一次简短的项目概况或技术栈
- 如果用户不补充，也继续初始化，并生成待补充的占位文档

### 可选：在同一句里补充已知上下文

```text
使用 OSpec 初始化这个项目。它是一个基于 Node.js、React 和 PostgreSQL 的内部管理后台。
```

### 后续刷新知识层

```text
使用 OSpec 刷新或修复这个项目的知识层。
```

### 开始一个需求

```text
使用 OSpec 为这个需求创建并推进一个 change。
```

### 建立队列但先不执行

```text
使用 OSpec 读取这份 TODO，把它拆成多个 change，建立队列，并先展示队列状态，不要马上执行。
```

这里默认含义是：

- 先输出一个有序的 change 名称列表
- change 名称使用 kebab-case
- 每个 change 代表一个清晰执行单元，不要把多个不相干事项混成一个名字

### 显式按队列推进

```text
使用 OSpec 建立 change 队列，并用 ospec run manual-safe 显式推进。
```

### 收口已完成的 Change

```text
使用 OSpec 在提交前收口这个已完成的 change。
```

### 查看进度

```text
使用 OSpec 检查当前 active changes 和整体项目进度。
```

## Skill 形式提示词

如果当前 AI 客户端已经安装 OSpec skills，优先直接使用技能名：

```text
使用 $ospec 初始化这个项目。
使用 $ospec 刷新或修复这个项目的知识层。
使用 $ospec 检查 active changes 和整体进度。
使用 $ospec 读取这份 TODO，拆成多个 change，建立队列，并先展示队列状态。
使用 $ospec 建立 change 队列，并用 ospec run manual-safe 显式推进。
使用 $ospec-finalize 在提交前收口一个已完成的 change。
```

## 边界说明

通常不需要在每次提示里重复这些内容：

- 初始化文件清单
- 协议壳校验步骤
- 每次都重复强调“不要默认生成 Web 模板”
- 反复强调“不要默认启动队列”

这些应该由 OSpec CLI 和已安装 skills 作为默认规则来保证。
