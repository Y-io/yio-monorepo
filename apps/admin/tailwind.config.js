const { shadcnPreset } = require("@yio/ui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"],
  presets: [shadcnPreset],
};
