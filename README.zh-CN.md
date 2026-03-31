# OSpec

[English](README.md) | [简体中文](README.zh-CN.md)

OSpec 是一个以协议壳优先为核心的 AI 协作 CLI。

它会先初始化最小协作协议，保持仓库起点尽量干净，再通过后续显式的文档补齐、skills 和 change 流程逐步构建具体项目结构。

当前版本：

- CLI：`1.1.2`

文档入口：

- [项目介绍](docs/project-overview.zh-CN.md)
- [安装说明](docs/installation.zh-CN.md)
- [使用说明](docs/usage.zh-CN.md)
- [提示词文档](docs/prompt-guide.zh-CN.md)
- [Skills 安装说明](docs/skills-installation.zh-CN.md)
- [GitLab 自定义 Fork 同步方案](docs/custom-fork-sync.zh-CN.md)
- [Stitch 插件规范](docs/stitch-plugin-spec.zh-CN.md)
- [Checkpoint 插件规范](docs/checkpoint-plugin-spec.zh-CN.md)

当前发布版覆盖内容：

- 协议壳优先的项目初始化
- 显式触发的项目知识层补齐
- 可配置的 change 工作流
- change 状态检查与 Git hooks 阻断
- 标准化的 `finalize -> archive -> 可提交` 收口流程
- Codex 与 Claude Code 的 skills 安装
