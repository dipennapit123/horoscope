#!/usr/bin/env bash
# Push admin dashboard to AstraDaily-Admin repo for separate deployment (e.g. Vercel/Netlify).
# Run from repo root: ./scripts/push-admin.sh
# Create an empty repo at https://github.com/dipennapit123/AstraDaily-Admin first if needed.

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADMIN_REPO="${1:-https://github.com/dipennapit123/AstraDaily-Admin.git}"
BRANCH="${2:-main}"
WORK_DIR="${REPO_ROOT}/.deploy-admin"

cd "$REPO_ROOT"
if [ ! -d "admin-dashboard" ]; then
  echo "Error: admin-dashboard/ not found. Run from ao-horoscope root."
  exit 1
fi

if [ -d "$WORK_DIR" ]; then
  rm -rf "$WORK_DIR"
fi
git clone --depth 1 "$ADMIN_REPO" "$WORK_DIR"
cd "$WORK_DIR"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" 2>/dev/null || true

# Copy admin-dashboard contents
rsync -a --delete \
  --exclude=node_modules \
  --exclude=.env \
  --exclude=.env.example \
  --exclude=dist \
  --exclude=build \
  --exclude=.git \
  "$REPO_ROOT/admin-dashboard/" .

git add -A
if git diff --staged --quiet; then
  echo "No changes to push."
  rm -rf "$WORK_DIR"
  exit 0
fi
git commit -m "Sync admin from monorepo"
git push -u origin "$BRANCH"
rm -rf "$WORK_DIR"
echo "Pushed admin to $ADMIN_REPO ($BRANCH)."
