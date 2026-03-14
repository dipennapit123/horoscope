#!/usr/bin/env bash
# Push backend to AstraDaily-Backend repo for separate deployment (e.g. Railway).
# Run from repo root: ./scripts/push-backend.sh

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_REPO="${1:-https://github.com/dipennapit123/AstraDaily-Backend.git}"
BRANCH="${2:-main}"
WORK_DIR="${REPO_ROOT}/.deploy-backend"

cd "$REPO_ROOT"
if [ ! -d "backend" ]; then
  echo "Error: backend/ not found. Run from ao-horoscope root."
  exit 1
fi

if [ -d "$WORK_DIR" ]; then
  rm -rf "$WORK_DIR"
fi
git clone --depth 1 "$BACKEND_REPO" "$WORK_DIR"
cd "$WORK_DIR"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" 2>/dev/null || true

# Copy backend contents, exclude secrets and build artifacts
rsync -a --delete \
  --exclude=node_modules \
  --exclude=.env \
  --exclude=.env.example \
  --exclude=dist \
  --exclude=.git \
  "$REPO_ROOT/backend/" .

git add -A
if git diff --staged --quiet; then
  echo "No changes to push."
  rm -rf "$WORK_DIR"
  exit 0
fi
git commit -m "Sync backend from monorepo"
git push -u origin "$BRANCH"
rm -rf "$WORK_DIR"
echo "Pushed backend to $BACKEND_REPO ($BRANCH)."
