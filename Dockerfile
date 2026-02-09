# Imagen base
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias del frontend
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del proyecto frontend
COPY frontend/ .

# Build de produccion
RUN npm run build

# Instalar servidor estatico
RUN npm install -g serve

# Exponer el puerto
EXPOSE 3000

# Comando para servir la app
CMD ["serve", "-s", "dist", "-l", "3000"]
