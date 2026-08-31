#!/usr/bin/env bash
set -euo pipefail

PYTHON_BIN="${PYTHON_BIN:-python3}"
VENV_DIR="${VENV_DIR:-.venv}"

if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  echo "Python 3.11+ is required."
  exit 1
fi

"$PYTHON_BIN" - <<'PY'
import sys
if sys.version_info < (3, 11):
    raise SystemExit("Python 3.11+ is required")
print(f"Using Python {sys.version.split()[0]}")
PY

if [ ! -d "$VENV_DIR" ]; then
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip setuptools wheel
python -m pip install -e ".[dev]"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

mkdir -p data logs

echo
echo "Bootstrap complete."
echo "Next:"
echo "  1. Edit .env and add YOUTUBE_API_KEY if using the official API."
echo "  2. Start PostgreSQL/pgvector before persistence work."
echo "  3. Run: source $VENV_DIR/bin/activate"
echo "  4. Run: pytest"
