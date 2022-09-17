#!/usr/bin/env bash
set -eu

envsubst '${EXPRESS} ${EXPRESS_PORT}' < /etc/nginx/conf.d/single.conf.template > /etc/nginx/conf.d/single.conf

exec "$@"