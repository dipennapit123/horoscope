#!/usr/bin/env bash
# Push only admin-dashboard2 to dashreview. Commit message is always included.
# Run from repo root:
#   ./scripts/push-dashday.sh "Sync admin-dashboard2 from monorepo"
# Or with custom repo: ./scripts/push-dashday.sh "https://github.com/user/repo.git" "Your message"

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DASHDAY_REPO="${1:-https://github.com/dipennapit123/dashreview.git}"
COMMIT_MSG="${2:-Sync admin-dashboard2 from monorepo}"
BRANCH="main"
WORK_DIR="${REPO_ROOT}/.deploy-dashday"

cd "$REPO_ROOT"
if [ ! -d "admin-dashboard2" ]; then
  echo "Error: admin-dashboard2/ not found. Run from ao-horoscope root."
  exit 1
fi

if [ -d "$WORK_DIR" ]; then
  rm -rf "$WORK_DIR"
fi
git clone --depth 1 "$DASHDAY_REPO" "$WORK_DIR"
cd "$WORK_DIR"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" 2>/dev/null || true

# Copy only admin-dashboard2 contents to repo root
rsync -a --delete \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.env \
  --exclude='.env.*' \
  --exclude=.vercel \
  --exclude=.clerk \
  "$REPO_ROOT/admin-dashboard2/" .

git add -A
if git diff --staged --quiet; then
  echo "No changes to push."
  rm -rf "$WORK_DIR"
  exit 0
fi
git commit -m "$COMMIT_MSG"
git push -u origin "$BRANCH"
rm -rf "$WORK_DIR"
echo "Pushed admin-dashboard2 to $DASHDAY_REPO ($BRANCH)."
