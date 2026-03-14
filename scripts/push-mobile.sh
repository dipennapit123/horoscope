#!/usr/bin/env bash
# Push mobile app to AstraDaily-Mobile repo for separate deployment (e.g. EAS/Expo).
# Run from repo root: ./scripts/push-mobile.sh
# Create an empty repo at https://github.com/dipennapit123/AstraDaily-Mobile first if needed.

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_REPO="${1:-https://github.com/dipennapit123/AstraDaily-Mobile.git}"
BRANCH="${2:-main}"
WORK_DIR="${REPO_ROOT}/.deploy-mobile"

cd "$REPO_ROOT"
if [ ! -d "mobile" ]; then
  echo "Error: mobile/ not found. Run from ao-horoscope root."
  exit 1
fi

if [ -d "$WORK_DIR" ]; then
  rm -rf "$WORK_DIR"
fi
git clone --depth 1 "$MOBILE_REPO" "$WORK_DIR"
cd "$WORK_DIR"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" 2>/dev/null || true

# Copy mobile contents, exclude deps and local artifacts
rsync -a --delete \
  --exclude=node_modules \
  --exclude=.env \
  --exclude=.env.example \
  --exclude=.expo \
  --exclude=dist \
  --exclude=.git \
  "$REPO_ROOT/mobile/" .

git add -A
if git diff --staged --quiet; then
  echo "No changes to push."
  rm -rf "$WORK_DIR"
  exit 0
fi
git commit -m "Sync mobile from monorepo"
git push -u origin "$BRANCH"
rm -rf "$WORK_DIR"
echo "Pushed mobile to $MOBILE_REPO ($BRANCH)."
