#!/bin/bash

BACKUP_DIR="$(dirname "$0")/.backups"
mkdir -p "$BACKUP_DIR"

docker exec -t cars_db pg_dump -U postgres cars_db > "$BACKUP_DIR/cars_db_$(date +%Y%m%d_%H%M%S).sql"

echo "✅ Cars DB backup saved to $BACKUP_DIR"