#!/usr/bin/env bash
set -eu

envsubst '${API1} ${API2} ${API_PORT}' < /etc/nginx/conf.d/project.conf.template > /etc/nginx/conf.d/project.conf

exec "$@"