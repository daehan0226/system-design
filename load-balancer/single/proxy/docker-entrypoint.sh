#!/usr/bin/env bash
set -eu

envsubst '${EXPRESS} ${EXPRESS_PORT}' < /etc/nginx/conf.d/project.conf.template > /etc/nginx/conf.d/project.conf

exec "$@"