// environment.prod.ts
export const environment = {
  production: true,
  // Primero intenta leer de Netlify, si no usa el valor por defecto
  apiUrl: process.env['NG_APP_API_URL'] || 'https://webvehicles-backend.onrender.com/api'
};
