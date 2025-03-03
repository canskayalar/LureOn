import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // **Docker içinden erişim sağlar**
    port: 5173,        // **Portu açık bırak**
    strictPort: true,  // **Çakışmayı önler**
    watch: {
      usePolling: true // **Docker içindeki dosya değişikliklerini algılar**
    }
  }
});

