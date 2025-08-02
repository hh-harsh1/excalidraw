export default {
  plugins: {
    "@tailwindcss/postcss": {},
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    ],
  },
};
