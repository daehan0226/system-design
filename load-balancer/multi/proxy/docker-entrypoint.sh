#!/usr/bin/env bash
set -eu

envsubst '${EXPRESS1} ${EXPRESS2} ${EXPRESS3} ${EXPRESS4} ${EXPRESS_PORT}' < /etc/nginx/conf.d/project.conf.template > /etc/nginx/conf.d/project.conf

exec "$@"