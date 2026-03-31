# OSpec Branding Protection and Upstream Sync







This document defines how to keep the repository branded as `ospec` while still syncing changes from your upstream source.







## Workspace roles







Keep two local workspaces over time:







- `<sync-workspace>`: upstream sync workspace



- `d:\AITeset\ospec`: primary development workspace







Rules:







- do all branding, docs, and product changes only in `ospec`



- do all upstream sync work only in the dedicated sync workspace







## Branch roles







Keep these branches in GitLab:







- `upstream-main`: pure upstream mirror branch



- `main`: your branded working branch







## Current protection layers







The repository now uses two protection layers.







### 1. Branding reapply script







Script path:







```bash



scripts/apply-ospec-branding.js



```







Purpose:







- rewrites legacy brand text to `ospec` / `OSpec`



- rewrites CLI command names to `ospec`



- renames the legacy protocol directory to `.ospec`







The script is idempotent, so you can run it after every upstream sync.







### 2. `.gitattributes` branding protection







The repository root `.gitattributes` marks these branding-owned files as `merge=ours`:







- `README.md`



- `README.zh-CN.md`



- `SKILL.md`



- `skill.yaml`



- `agents/openai.yaml`



- `docs/*.md`



- `assets/**`



- `.ospec/**`







That means merge conflicts in those files keep your current branch version by default.







## Recommended sync workflow







### A. Sync upstream in your dedicated sync workspace







```bash



node scripts/sync-upstream.js --push



```







If upstream sync reintroduces legacy brand text, run:







```bash



node scripts/apply-ospec-branding.js



```







Then review and commit:







```bash



git status



git add .



git commit -m "chore(brand): reapply ospec branding after upstream sync"



git push



```







### B. Refresh the main development workspace in `d:\AITeset\ospec`







```bash



git fetch origin



git pull --ff-only



```







## Files to review manually after sync







Even with automation, these files should still be reviewed after every upstream sync:







- `package.json`



- `package-lock.json`



- `dist/cli.js`



- `dist/services/ProjectService.js`



- `dist/tools/build-index.js`



- `scripts/release-smoke.js`







These files mix branding text with upstream logic changes.







## Avoid this







- do not edit the same files in both the sync workspace and `ospec`



- do not mark all of `dist/**` as `merge=ours`



- do not apply branding changes directly on `upstream-main`







## One-line rule







- sync upstream in the dedicated sync workspace



- build brand and product in `ospec`



- reapply the OSpec branding layer after upstream merges



