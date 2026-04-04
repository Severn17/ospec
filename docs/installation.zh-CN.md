# 安装说明

安装 OSpec 时，请使用官方 CLI 包 `@clawplays/ospec-cli` 并运行 `ospec` 命令。

## 环境要求

- Node.js `>= 18`
- npm `>= 8`

## 从 npm 安装

```bash
npm install -g @clawplays/ospec-cli
```

OSpec 面向 AI coding agents 和 CLI 工作流，支持 spec-driven development（SDD）与文档驱动开发。

## 安装后验证

```bash
ospec --version
ospec --help
```

## 托管 Skills

- `ospec init [path]` 与 `ospec update [path]` 会为 Codex 同步托管的 `ospec` 与 `ospec-change` skills
- 如果检测到 `CLAUDE_HOME` 或已有 `~/.claude` 目录，也会同步到 Claude Code
- 如果本机已经安装过对应的托管 skill，打包版本会直接覆盖它

如果你还需要别的 OSpec skill，可以显式安装，例如：

```bash
ospec skill install ospec-init
```
