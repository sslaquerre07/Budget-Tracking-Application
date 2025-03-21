# Use official MySQL base image
FROM mysql:8.0

# Copy the SQL files into the image
COPY ./sql_files /docker-entrypoint-initdb.d

# Expose MySQL port
EXPOSE 3306