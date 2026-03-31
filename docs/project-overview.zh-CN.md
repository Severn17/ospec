# 项目介绍

## OSpec 是什么

OSpec 是一个面向 AI 协作交付的 CLI 工作流系统。

它不是在初始化时直接塞入一个固定业务模板，而是先建立协议壳和协作规则，后续再根据项目实际方向，显式补齐项目知识层和 change 流程。

## 核心原则

- 普通 `ospec init` 只做最小协议壳初始化
- 初始化后的结构层级统一按 `none` 处理，不再区分 `basic` / `full`
- 项目文档属于项目知识层，change 执行记录放在 `changes/active/`
- Git hooks 只关注真实执行状态，没有 active changes 时保持安静
- 当前不再提供 dashboard，可视化入口已移除

## 适用场景

- 希望 AI 在仓库内按统一规则协作
- 希望需求执行过程可见、可检查、可归档
- 项目类型可能是 Web、CLI、后端服务、游戏项目或纯协议仓库
- 需要同时适配 Codex 与 Claude Code

## 当前能力

- 协议壳优先初始化
- 显式项目知识层补齐
- active change 执行流程管理
- 标准 `finalize -> archive -> 可提交` 收口流程
- `PASS / WARN / FAIL` 聚合状态检查
- 面向 active changes 的 Git hooks 阻断
- Codex 与 Claude Code skills 安装和同步
