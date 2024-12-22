module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all React files are scanned for Tailwind classes
    "./public/index.html",       // Include the index.html file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};