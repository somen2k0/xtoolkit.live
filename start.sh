#!/bin/bash
set -e

# Build and start the API server in the background on port 8080
echo "[start] Building API server..."
PORT=8080 pnpm --filter @workspace/api-server run build

echo "[start] Starting API server on port 8080..."
PORT=8080 pnpm --filter @workspace/api-server run start &
API_PID=$!

# Give the API server a moment to start
sleep 2

# Start the frontend on port 5000 (Replit webview port)
echo "[start] Starting frontend on port 5000..."
PORT=5000 pnpm --filter @workspace/x-checker run dev

# If frontend exits, kill the API server too
kill $API_PID 2>/dev/null || true
