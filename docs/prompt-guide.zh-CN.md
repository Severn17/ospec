# 提示词文档

## 原则

给 OSpec 的提示词应该尽量短，表达清楚意图即可，不需要把内部检查清单整段写进去。

OSpec 应该在内部自动展开初始化、检查、change 流程这些规则。

## 推荐提示词

### 初始化项目

```text
使用 OSpec 初始化这个项目。
```

### 初始化流程框架

```text
使用 OSpec 初始化这个项目的流程框架。
```

### 补齐知识层

```text
使用 OSpec 补齐这个项目的知识层。
```

### 开始一个需求

```text
使用 OSpec 为这个需求创建并推进一个 change。
```

### 收口已完成的 Change

```text
使用 OSpec 在提交前收口这个已完成的 change。
```

### 查看进度

```text
使用 OSpec 检查当前 active changes 和整体进度。
```

## Skill 形式提示词

如果当前 AI 客户端已经安装 OSpec skills，优先直接使用技能名：

```text
使用 $ospec 初始化这个项目。
使用 $ospec 补齐这个项目的知识层。
使用 $ospec 检查 active changes 和整体进度。
使用 $ospec-finalize 在提交前收口一个已完成的 change。
```

## 边界说明

通常不需要在每次提示里重复这些内容：

- 初始化文件清单
- 协议壳校验步骤
- 每次都重复强调“不要默认生成 web 模板”

这些应该由 OSpec CLI 和已安装 skills 作为默认规则来保证。
