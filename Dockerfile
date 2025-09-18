FROM node:20

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy app files
COPY . .

# Expose Vite port
EXPOSE 5173

# Start Vite
CMD ["npx", "vite", "dev", "--host", "0.0.0.0"]
