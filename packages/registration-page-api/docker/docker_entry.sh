#! /bin/sh

set -e -x

export NODE_ENV=production
export REGISTER_LOG_SQL=0
export REGISTER_CONFIG_FILE=/root/config.yaml

if [ X"${CONTAINER_TIMEZONE}" != X"" ]; then
  ln -snf /usr/share/zoneinfo/"${CONTAINER_TIMEZONE}" /etc/localtime
  echo "${CONTAINER_TIMEZONE}" >/etc/timezone
  echo "[ok] Container timezone set to: ${CONTAINER_TIMEZONE}"
  date
fi

if [ X"${1}" = X"primary" ]; then
  exec node /root/dist/main.js
else
  exec "${@}"
fi
