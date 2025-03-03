# Temel Node.js imajını kullan
FROM node:18

# Çalışma dizini oluştur
WORKDIR /app

# Bağımlılık dosyalarını kopyala
COPY package.json package-lock.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm dosyaları kopyala
COPY . .

# Portu dışa aç
EXPOSE 5173

# Vite'yi başlat
CMD ["npm", "run", "dev"]

