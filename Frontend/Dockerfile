FROM node:20-alpine3.19

# Create app directory
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest
COPY . .

# ====== IMPORTANT: pass API URL at build time ======
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build Vite
RUN npm run build

# Expose preview port
EXPOSE 4173

# Run preview server and listen on all interfaces
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
