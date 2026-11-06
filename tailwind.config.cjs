/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Respeta la identidad visual y los estilos originales de la primera semana.
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
