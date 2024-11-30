FROM node:22.10.0-slim

# Install system dependencies
RUN apt update && apt upgrade -y && apt install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

COPY app /app

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
