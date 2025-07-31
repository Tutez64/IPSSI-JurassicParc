#!/bin/bash
set -e

BASE="http://localhost:3002/api/parc2/keepers"

echo "Health check..."
curl -f http://localhost:3002/health

echo "Create keeper..."
CREATED=$(curl -s -X POST "$BASE" -H "Content-Type: application/json" -d '{
  "name":"Jane Doe",
  "specialty":"security",
  "sector":"B3",
  "available":true,
  "experience":5
}')
echo "$CREATED"

ID=$(echo "$CREATED" | jq -r '.id')

echo "Get keeper by ID..."
curl -s "$BASE/$ID"

echo "List keepers..."
curl -s "$BASE"

echo "Update keeper (available=false)..."
curl -s -X PUT "$BASE/$ID" -H "Content-Type: application/json" -d '{"available":false}'

echo "Delete keeper..."
curl -s -X DELETE "$BASE/$ID"

echo "Done."
