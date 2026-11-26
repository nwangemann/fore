#!/bin/sh
# Starts the web dashboard for the Claude preview pane (.claude/launch.json).
# The pane's shell may not have Node on PATH, so fall back to common install folders.
if ! command -v npm >/dev/null 2>&1; then
  for dir in "$HOME/.local/node/bin" /opt/homebrew/bin /usr/local/bin "$HOME/.volta/bin"; do
    if [ -x "$dir/npm" ]; then
      PATH="$dir:$PATH"
      break
    fi
  done
  if [ -z "$(command -v npm)" ] && [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
    . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  fi
fi
command -v npm >/dev/null 2>&1 || { echo "npm not found: put Node 22.13+ on PATH" >&2; exit 1; }
export LANG="${LANG:-en_US.UTF-8}"
exec npm run web -- --port "${PORT:-8082}"
