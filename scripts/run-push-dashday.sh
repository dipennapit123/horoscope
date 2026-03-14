#!/usr/bin/env bash
# Wrapper: runs push-dashday.sh and records result
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$REPO_ROOT/scripts/push-dashday-log.txt"
cd "$REPO_ROOT"
{
  echo "=== $(date) ==="
  ./scripts/push-dashday.sh "${1:-Sync admin-dashboard2 from monorepo}"
  echo "=== done ==="
} 2>&1 | tee "$LOG"
