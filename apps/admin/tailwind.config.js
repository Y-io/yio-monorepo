import type { Config } from "tailwindcss";
import { shadcnPreset } from "@yio/ui";

export default {
  content: ["src/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"],
  presets: [shadcnPreset],
} satisfies Config;
