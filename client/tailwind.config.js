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
          /*default: {
            foreground: "#ffffff",
            DEFAULT: "#3E3A36",
          },*/
          primary: {
            50: "#f3f8ec",
            100: "#dae6ca",
            200: "#c1d6a6",
            300: "#a8c682",
            400: "#8fb65e",
            500: "#76a63a",
            600: "#61872f",
            700: "#4c6a25",
            800: "#374d1b",
            900: "#223011",
            foreground: "#ffffff", // contrast color
            DEFAULT: "#4F5A3D",
          },
          secondary: {
            foreground: "#ffffff",
            DEFAULT: "#B56B44"
          },
          /* type BaseColors = {
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
        layout: {},
        colors: {
          primary: {
            foreground: "#ffffff",
            DEFAULT: "#aebf96", // lighter olive-stone
          },
          secondary: {
            foreground: "#ffffff",
            DEFAULT: "#c57d5c", // lighter terracotta
          },
          background: {
            50: "#2b2b28",
            100: "#22221f",
            200: "#1e1e1b",
            DEFAULT: "#1e1e1b", // page background
          },
          foreground: {
            DEFAULT: "#d8d5ce", // page text
          },
          input: {
            DEFAULT: "#2b2b28",
            foreground: "#f3f3f3",
            border: "#788467"
          },
          divider: {
            DEFAULT: "#44433f",
          },
          content1: {
            DEFAULT: "#2a2a26", // cards, modals
          },
          button: {
            DEFAULT: "#aebf96",
            hover: "#c5d2a2",
            foreground: "#1e1e1b",
          }
        },
      },      
    },
  })],
};