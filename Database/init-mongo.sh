#!/bin/bash

echo "⏳ Waiting for MongoDB to be ready..."
until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    sleep 1
done

echo "✅ MongoDB is up and running!"

# Check if the vacations database exists and has collections
collection_count=$(mongosh --quiet vacations --eval "db.getCollectionNames().length")

if [ "$collection_count" == "0" ] || [ -z "$collection_count" ]; then
    echo "📦 Restoring MongoDB data from BSON files..."
    mongorestore --drop --db vacations /dump/vacations
else
    echo "👍 Database already contains data. Skipping restore."
fi