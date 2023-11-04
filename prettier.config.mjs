/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  semi: false,
  trailingComma: "none",
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
