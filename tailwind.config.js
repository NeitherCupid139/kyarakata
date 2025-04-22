/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// 80年代复古色彩
				retro: {
					cyan: "#00FFFF",
					magenta: "#FF00FF",
					green: "#00FF00",
					amber: "#FFB000",
					orange: "#FF7F00",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				// 复古电脑动画
				scanline: {
					"0%": { transform: "translateY(-100vh)" },
					"100%": { transform: "translateY(100vh)" },
				},
				colorCycle: {
					"0%": { color: "#10b981" },
					"25%": { color: "#06b6d4" },
					"50%": { color: "#3b82f6" },
					"75%": { color: "#8b5cf6" },
					"100%": { color: "#10b981" },
				},
				scan: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				flicker: {
					"0%": { opacity: "0.97" },
					"100%": { opacity: "1" },
				},
				pulse: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				blink: {
					"0%, 49%": { opacity: "1" },
					"50%, 100%": { opacity: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				// 复古电脑动画
				scanline: "scanline 6s linear infinite",
				colorCycle: "colorCycle 8s linear infinite",
				scan: "scan 2s ease-in-out infinite",
				flicker: "flicker 0.3s ease-in-out infinite alternate",
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				blink: "blink 1s steps(1) infinite",
			},
			boxShadow: {
				retro: "0 0 10px rgba(16, 185, 129, 0.5)",
				"retro-lg": "0 0 20px rgba(16, 185, 129, 0.7)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
