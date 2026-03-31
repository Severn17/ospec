# 当前项目的 Vibe Coding / Spec 流程工作文档

## 1. 文档目的

这份文档用于梳理当前仓库里真正还在使用、并且准备继续保留的 spec 流程。

本轮调整后，有两个明确变化：

- 初始化后的结构层级只保留 `none`
- dashboard 已移除，流程统一回到 CLI

## 2. 当前流程主线

当前项目仍然是四段式流程：

1. 协议壳初始化
2. 项目知识层补齐
3. active change 执行
4. verify / archive 收口

对应常用命令是：

```bash
ospec status [path]
ospec init [path]
ospec docs generate [path]
ospec new <change-name> [path]
ospec progress [changes/active/<change>]
ospec verify [changes/active/<change>]
ospec archive [changes/active/<change>]
ospec finalize [changes/active/<change>]
```

## 3. 初始化后的结构判断

当前实现里，结构层级固定只使用：

- `none`

后续不再使用：

- `basic`
- `full`

这意味着初始化后的判断不再依赖结构层级名称，而是直接看：

- 是否已初始化
- docs 覆盖率是否完整
- 是否存在 active changes
- 当前 change 是否可归档

## 4. 当前 spec 分层

### 4.1 协议壳

协议壳关注协作规则本身，核心文件包括：

- `.skillrc`
- `.ospec/`
- `changes/active/`
- `changes/archived/`
- `SKILL.md`
- `SKILL.index.json`
- `for-ai/*`

### 4.2 项目知识层

项目长期知识层主要放在：

- `docs/project/overview.md`
- `docs/project/tech-stack.md`
- `docs/project/architecture.md`
- `docs/project/module-map.md`
- `docs/project/api-overview.md`

### 4.3 单个 change 的执行 spec

每个 active change 的固定协议文件是：

- `proposal.md`
- `tasks.md`
- `state.json`
- `verification.md`
- `review.md`

其中执行状态真源仍然是：

- `state.json`

## 5. 当前执行顺序

单个 change 的推荐顺序仍然是：

1. 读取上下文和约束
2. 创建或更新 `proposal.md`
3. 创建或更新 `tasks.md`
4. 实现代码
5. 更新受影响的 `SKILL.md`
6. 重建 `SKILL.index.json`
7. 完成 `verification.md`
8. 通过 archive 门禁后归档

## 6. verify 与 archive 的关系

### `ospec verify`

当前更像预检查，主要检查：

- `proposal.md / tasks.md / verification.md` 是否存在
- activated optional steps 是否被文档覆盖
- checklist 是否仍有未勾选项
- `state.json` 当前状态是否合理

### `ospec archive`

当前是真正的归档门禁，要求会更严格：

- `state.json.status == ready_to_archive`
- `verification_passed`
- `skill_updated`
- `index_regenerated`
- activated optional steps 已进入 `passed_optional_steps`
- `tasks.md` 和 `verification.md` 不再有未勾选项

## 7. 本轮移除项

### 7.1 Dashboard

dashboard 相关代码与命令已移除。

当前仓库不再保留：

- dashboard 命令入口
- dashboard 服务器代码
- dashboard 静态前端资源
- dashboard 相关帮助文案

### 7.2 `basic / full` 结构层级

结构判断只保留 `none`。

后续讨论流程时，不再使用：

- 这个仓库现在是 `basic`
- 这个仓库现在是 `full`

统一改为讨论：

- 是否已初始化
- docs 是否补齐
- change 是否在执行中
- 是否已可归档

## 8. 下一步适合微调的点

基于当前收敛后的流程，下一步最值得继续讨论的是：

1. `verify` 是否要从预检查提升为更强门禁
2. `review.md` 是否要进入硬性归档条件
3. `finalize` 是否要作为唯一官方收口入口
4. docs、`SKILL.md`、`state.json` 三者之间的职责边界是否还要再收紧
