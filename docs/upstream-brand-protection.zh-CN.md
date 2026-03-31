# OSpec 品牌保护与上游同步方案







这份文档说明：在继续同步上游代码的同时，如何让仓库持续保持 `ospec` 品牌。







## 目录职责







建议长期保留两个本地工作目录：







- `<sync-workspace>`：上游同步工作区



- `d:\AITeset\ospec`：正式开发工作区







规则如下：







- 所有品牌、文档、产品改动，只在 `ospec` 目录进行



- 所有上游同步，只在专用同步工作区进行







## 分支职责







建议在 GitLab 中保留：







- `upstream-main`：纯上游镜像分支



- `main`：你的品牌化正式分支







## 当前保护层







仓库现在采用两层保护。







### 1. 品牌重打脚本







脚本路径：







```bash



scripts/apply-ospec-branding.js



```







用途：







- 把旧品牌文本统一重打为 `ospec` / `OSpec`



- 把命令名统一改为 `ospec`



- 把旧协议目录统一迁移到 `.ospec`







这个脚本是幂等的，每次同步上游后都可以重复执行。







### 2. `.gitattributes` 品牌保护







仓库根目录的 `.gitattributes` 已将以下品牌文件标记为 `merge=ours`：







- `README.md`



- `README.zh-CN.md`



- `SKILL.md`



- `skill.yaml`



- `agents/openai.yaml`



- `docs/*.md`



- `assets/**`



- `.ospec/**`







含义是：这些文件发生合并冲突时，默认保留你当前分支的版本。







## 推荐同步流程







### A. 在专用同步工作区同步上游







```bash



node scripts/sync-upstream.js --push



```







如果同步后又带回旧品牌文本，再执行：







```bash



node scripts/apply-ospec-branding.js



```







然后检查并提交：







```bash



git status



git add .



git commit -m "chore(brand): reapply ospec branding after upstream sync"



git push



```







### B. 在 `d:\AITeset\ospec` 刷新正式开发目录







```bash



git fetch origin



git pull --ff-only



```







## 每次同步后建议人工复查的文件







即使有自动化，也建议每次同步后人工复查这些文件：







- `package.json`



- `package-lock.json`



- `dist/cli.js`



- `dist/services/ProjectService.js`



- `dist/tools/build-index.js`



- `scripts/release-smoke.js`







这些文件同时混合了品牌文本和上游逻辑变更。







## 不建议的做法







- 不要在专用同步工作区和 `ospec` 目录同时改同一批文件



- 不要把 `dist/**` 全部直接标记成 `merge=ours`



- 不要直接在 `upstream-main` 上做品牌改动







## 一句话原则







- 上游同步在专用同步工作区完成



- 品牌与产品开发在 `ospec` 完成



- 每次合并上游后，重新应用 OSpec 品牌层



