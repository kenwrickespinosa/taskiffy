/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#191645',
        'custom-green': '#43C6AC',
        'custom-grey': '#2C2C2C',
        // 'custom-black': '#1E1E1E',
        'custom-black': '#181818',
      }
    },
  },
  plugins: [],
}
