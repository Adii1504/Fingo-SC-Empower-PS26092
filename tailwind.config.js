/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // SWOT colors used dynamically
    { pattern: /bg-(green|red|blue|orange)-(50|100|200)/ },
    { pattern: /text-(green|red|blue|orange)-(400|600|700|800)/ },
    { pattern: /border-(green|red|blue|orange)-(200)/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
