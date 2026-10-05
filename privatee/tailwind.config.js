/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(-2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse2: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        checkmark: {
          "0%": { transform: "scale(0) rotate(-45deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
        "fade-up-delay-1": "fadeUp 0.6s ease-out 0.1s both",
        "fade-up-delay-2": "fadeUp 0.6s ease-out 0.2s both",
        "fade-up-delay-3": "fadeUp 0.6s ease-out 0.3s both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "scale-in": "scaleIn 0.5s ease-out both",
        "slide-down": "slideDown 0.3s ease-out both",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float2 8s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse2": "pulse2 3s ease-in-out infinite",
        "checkmark": "checkmark 0.5s ease-out 0.2s both",
      },
    },
  },
  plugins: [],
};
