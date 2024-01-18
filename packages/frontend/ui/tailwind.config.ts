import type { Config } from "tailwindcss";

import { shadcnPreset } from "./src";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [shadcnPreset],
} satisfies Config;
