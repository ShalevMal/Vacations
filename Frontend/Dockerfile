FROM node:20-alpine3.19

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json /app
COPY package-lock.json /app
RUN npm install

# Copy all remaining files
COPY . /app

# Build the Vite project
RUN npm run build

# Expose the preview port (default 4173)
EXPOSE 4173

# Run the built site using vite preview
CMD ["npm", "run", "preview"]
