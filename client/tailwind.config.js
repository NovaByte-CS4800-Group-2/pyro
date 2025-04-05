// tailwind.config.js
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    prefix: "pyro", // prefix for themes variables
    addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      light: {
        layout: {}, // light theme layout tokens
        colors: {
          /*type ColorScale = {
            50: string,
            100: string,
            200: string,
            300: string,
            400: string,
            500: string,
            600: string,
            700: string,
            800: string,
            900: string,
            foreground: string, // contrast color
            DEFAULT: string,
          },
          type BaseColors = {
            background: ColorScale, // the page background color
            foreground: ColorScale, // the page text color
            divider: ColorScale, // used for divider and single line border
            overlay: ColorScale, // used for modal, popover, etc.
            focus: ColorScale, // used for focus state outline
            content1: ColorScale, // used for card, modal, popover, etc.
            content2: ColorScale,
            content3: ColorScale,
            content4: ColorScale,
          },
          // brand colors
          type ThemeColors = BaseColors & {
            default: ColorScale,
            primary: ColorScale,
            secondary: ColorScale,
            success: ColorScale,
            warning: ColorScale,
            danger: ColorScale,
          }, */
        }, // light theme colors
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {}, // dark theme colors
      },
    },
  })],
};