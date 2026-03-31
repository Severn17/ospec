# GitLab Custom Fork Sync Strategy







This guide is for the case where:







- the upstream repository lives on GitHub



- your production repository lives on GitLab



- you want to rename `OSpec` to your own brand



- you have additional local changes



- upstream updates should continue to flow in without overwriting files you explicitly own







## Recommended branch layout







Keep two long-lived branches in your GitLab repository:







- `upstream-main`: a clean mirror of upstream `main`



- `main`: your branded and customized working branch







This keeps upstream sync separate from your custom layer.







## One-time setup







### 1. Create an empty GitLab repository







Create the repository without an auto-generated `README`, `.gitignore`, or License.







### 2. Run the setup script locally







```bash



  node scripts/setup-custom-fork.js \



    --gitlab git@gitlab.com:your-group/your-repo.git \



    --upstream https://github.com/your-org/upstream-repo.git \



    --push



```







The script will:







- configure GitHub as `upstream`



- configure GitLab as `origin`



- create or refresh `upstream-main`



- keep `main` as your customization branch



- enable `git rerere` for repeated conflict reuse



- configure the `merge=ours` driver for files you intentionally own







## How to structure your custom changes







Keep your changes in separate commits:







1. branding changes



2. files you fully own



3. feature extensions







Example:







```text



chore(brand): rename OSpec to YourName



chore(brand): replace skill metadata and docs



feat(custom): add internal workflow extensions



```







This makes upstream merges much easier to reason about.







## Sync workflow







```bash



node scripts/sync-upstream.js --push



```







The script will:







- fetch from `upstream`



- mirror `upstream/main` into `upstream-main`



- merge `upstream-main` into your `main`



- optionally push both branches to GitLab







If you prefer a linear history:







```bash



node scripts/sync-upstream.js --rebase --push



```







## How to keep your overrides







Use a two-layer approach.







### Layer 1: keep branding files mergeable when possible







Files like these should usually continue to receive upstream updates:







- `README.md`



- `README.zh-CN.md`



- `skill.yaml`



- `agents/openai.yaml`



- help text and template wording







For these files, do not default to permanent `merge=ours`.







Instead:







- isolate branding changes in dedicated commits



- re-check those commits after each sync



- rely on `git rerere` to remember recurring conflict resolutions







### Layer 2: use `merge=ours` for files you truly own







For files you never want upstream to replace, add patterns to `.gitattributes`:







```gitattributes



docs/custom/** merge=ours



assets/branding/** merge=ours



agents/internal/** merge=ours



```







This means conflicts keep your current branch version.







Do not overuse this on core code files, or you will stop receiving upstream fixes.







## Keep renaming separate from features







If you fully rename `ospec`, keep that layer isolated to:







- package and command naming



- README and docs text



- skill metadata







Do not mix branding changes with functional customizations in the same commit.







## Recommended day-to-day model







```text



1. upstream-main tracks raw GitHub upstream



2. main carries your branding and custom logic



3. refresh upstream-main first



4. merge or rebase into main second



5. use merge=ours only for files you truly own



6. keep the remaining branding files mergeable



```







## Next step







If you want, the next step can be either:







1. a concrete rename checklist for your custom brand



2. a first-pass file-by-file override plan for this repository



