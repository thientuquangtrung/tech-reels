FROM mcr.microsoft.com/devcontainers/typescript-node:24

# socat forwards selected host ports (e.g. Postgres.app on 5432) to the
# container's localhost, so .env files can keep pointing at localhost.
# The rest are the shared libraries Remotion's Chrome Headless Shell needs to render
# (https://www.remotion.dev/docs/miscellaneous/linux-dependencies).
RUN apt-get update && apt-get install -y --no-install-recommends socat \
    libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libxrandr2 libxkbcommon-dev libxfixes3 \
    libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 \
    "$(apt-cache show libasound2t64 >/dev/null 2>&1 && echo libasound2t64 || echo libasound2)" \
 && rm -rf /var/lib/apt/lists/*

# Pre-create the volume mount points owned by `node`, so the named volumes
# for node_modules start out writable without needing sudo.
RUN mkdir -p /workspaces/app/video/node_modules \
 && chown -R node:node /workspaces/app
