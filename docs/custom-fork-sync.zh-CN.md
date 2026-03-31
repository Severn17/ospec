# GitLab 自定义 Fork 同步方案

这份方案适用于下面这种场景：

- 上游仓库在 GitHub
- 你希望自己的正式仓库放在 GitLab
- 你要把 `OSpec` 改成自己的品牌名
- 你还会加一些自己的功能或覆盖文件
- 上游更新后，你希望继续同步，但不要把你明确接管的内容覆盖掉

## 推荐结构

建议在你的 GitLab 仓库里保留两条长期分支：

- `upstream-main`：只镜像上游 `main`，不要做自定义修改
- `main`：你的正式分支，只在这条分支上做品牌和业务定制

这样可以把“上游同步”和“你的定制”分开。

## 一次性初始化

### 1. 先在 GitLab 创建一个空仓库

建议创建空仓库，不要勾选自动生成 `README`、`.gitignore` 或 License。

### 2. 在本地仓库执行初始化脚本

```bash
  node scripts/setup-custom-fork.js \
    --gitlab git@gitlab.com:your-group/your-repo.git \
    --upstream https://github.com/your-org/upstream-repo.git \
    --push
```

脚本会做这些事：

- 把 GitHub 设置为 `upstream`
- 把 GitLab 设置为 `origin`
- 创建或刷新 `upstream-main`
- 保留你的 `main` 作为定制分支
- 打开 `git rerere`，让重复冲突更容易自动复用解决结果
- 配置 `merge=ours` 驱动，方便你后续声明“这些文件永远保留我的版本”

## 你的自定义修改怎么放

强烈建议把你的改动分成三类提交：

1. 品牌改名
2. 你自己长期接管的文件
3. 真正的功能扩展

例如：

```text
chore(brand): rename OSpec to YourName
chore(brand): replace skill metadata and docs
feat(custom): add internal workflow extensions
```

这样上游同步时更容易判断哪些冲突应该保留你的版本，哪些应该吸收上游更新。

## 上游更新后的同步流程

```bash
node scripts/sync-upstream.js --push
```

这个脚本会：

- `fetch upstream`
- 把 `upstream/main` 强制同步到 `upstream-main`
- 再把 `upstream-main` 合并到你的 `main`
- 可选推送到 GitLab

如果你更喜欢线性历史，可以用：

```bash
node scripts/sync-upstream.js --rebase --push
```

## 如何做到“我覆盖的内容不处理”

这里不要只用一种手段，推荐分两层处理。

### 第一层：品牌类改动尽量保持可合并

像下面这些文件，虽然你会改，但通常仍然应该继续接收上游更新：

- `README.md`
- `README.zh-CN.md`
- `skill.yaml`
- `agents/openai.yaml`
- 一些帮助文案、命令说明、模板文本

对于这类文件，不建议直接永久 `merge=ours`。

更好的做法是：

- 把品牌修改集中成独立提交
- 每次同步后重新检查这些提交是否还成立
- 打开 `git rerere`，让 Git 记住你反复选择的冲突解决方式

### 第二层：你明确接管的文件使用 `merge=ours`

如果某些文件你就是不想再接收上游版本，可以加到 `.gitattributes`：

```gitattributes
docs/custom/** merge=ours
assets/branding/** merge=ours
agents/internal/** merge=ours
```

含义是：当这些文件发生冲突时，默认保留你当前分支的版本。

注意：

- 不要对核心代码文件滥用 `merge=ours`
- 一旦某个文件被你标记为“永远保留本地版本”，上游对这个文件的修复你就基本收不到了

## 给“改名”单独留一层

如果你要把 `ospec` 完整替换为自己的名字，建议把这类改动限制为：

- 包名与命令名
- README / Docs 文案
- Skill 元数据
- Dashboard 展示文案

不要把“品牌改名”和“业务功能改造”混在同一个提交里。

否则以后上游一改帮助文本、命令文案、skill 描述，你会很难判断到底该保留哪部分。

## 推荐日常流程

```text
1. upstream-main 跟踪 GitHub 原始版本
2. main 保留你的品牌和定制能力
3. 每次上游更新，先刷新 upstream-main
4. 再把 upstream-main 合并到 main
5. 只对真正“你接管”的文件使用 merge=ours
6. 其余品牌文件继续正常合并
```

## 如果你要我继续帮你做

我下一步可以继续帮你两件事里的任意一个：

1. 直接在这个仓库里加一套“品牌重命名清单”
2. 按你的自定义名称，生成第一版 rename 方案和文件修改列表
