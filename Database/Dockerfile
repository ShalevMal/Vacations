FROM mongo:8

# Copy BSON dump files
COPY ./vacations /dump/vacations

# Copy initialization script to the default MongoDB init directory
COPY ./init-mongo.sh /docker-entrypoint-initdb.d/init-mongo.sh

# Make script executable
RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh