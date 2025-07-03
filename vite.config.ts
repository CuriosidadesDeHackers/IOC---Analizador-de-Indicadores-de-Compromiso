import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    // Configuración para desarrollo - solo servir index.html para rutas del SPA
    historyApiFallback: {
      // Solo para rutas que no son archivos estáticos
      rewrites: [
        // Permitir acceso directo a archivos estáticos
        { from: /^\/images\/.*$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        { from: /^\/assets\/.*$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        { from: /^\/.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        // Para todas las demás rutas, usar el SPA
        { from: /^\/.*$/, to: '/index.html' }
      ]
    }
  },
  preview: {
    // Configuración para preview - similar al servidor de desarrollo
    historyApiFallback: {
      rewrites: [
        { from: /^\/images\/.*$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        { from: /^\/assets\/.*$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        { from: /^\/.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        { from: /^\/.*$/, to: '/index.html' }
      ]
    }
  }
})