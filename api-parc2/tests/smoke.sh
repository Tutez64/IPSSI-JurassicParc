#!/bin/bash

URL="http://localhost:3002/health"

echo " Test health check: $URL"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$STATUS" -eq 200 ]; then
  echo " API en ligne (status $STATUS)"
  exit 0
else
  echo " Échec du test (status $STATUS)"
  exit 1
fi
