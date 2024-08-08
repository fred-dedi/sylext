#!/bin/bash

if ! id -u ${USER_NAME:-dedi} > /dev/null 2>&1; then
  addgroup -gid ${USER_ID:-1001} ${USER_NAME:-dedi}
  useradd -m -s /bin/bash -g dedi -u ${USER_ID:-1001} ${USER_NAME:-dedi}
fi

set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- node "$@"
fi

if [ "$1" = 'node' ] || [ "$1" = 'pnpm' ]; then
	sudo -EH -u "${USER_NAME:-dedi}" pnpm install
fi

exec sudo -EH -u "${USER_NAME:-dedi}" "$@"
