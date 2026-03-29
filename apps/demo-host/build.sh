#!/bin/sh
# Build the app
npm run build --workspace=apps/demo-host

# Inject the runtime iframe base URL into the built index.html
# VITE_IFRAME_BASE must be set in Render environment variables
if [ -n "$VITE_IFRAME_BASE" ]; then
  sed -i "s|window.__IFRAME_BASE__ = window.__IFRAME_BASE__ || \"http://localhost:5174\"|window.__IFRAME_BASE__ = \"$VITE_IFRAME_BASE\"|g" apps/demo-host/dist/index.html
  echo "Injected IFRAME_BASE: $VITE_IFRAME_BASE"
else
  echo "WARNING: VITE_IFRAME_BASE not set, iframe will use localhost fallback"
fi
