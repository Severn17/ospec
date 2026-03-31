# Skills 安装说明

## Codex

如果你是通过 `npm install -g .` 安装当前发布仓，安装完成后只会自动同步 `ospec-change`。

检查状态：

```bash
ospec skill status
```

安装或同步：

```bash
ospec skill install
```

默认目录：

```text
~/.codex/skills/
```

默认安装的 skill：

- `ospec-change`

如果你还要安装别的 skill，请显式指定名字：

```bash
ospec skill install ospec-init
```

## Claude Code

如果你是通过 `npm install -g .` 安装当前发布仓，安装完成后只会自动同步 `ospec-change`。

检查状态：

```bash
ospec skill status-claude
```

安装或同步：

```bash
ospec skill install-claude
```

默认目录：

```text
~/.claude/skills/
```

默认安装的 skill：

- `ospec-change`

如果你还要安装别的 skill，请显式指定名字：

```bash
ospec skill install-claude ospec-init
```

## 提示词命名

新的提示词优先使用 `$ospec`。

`$ospec-cli` 只作为旧提示词或旧自动化的兼容别名保留。
