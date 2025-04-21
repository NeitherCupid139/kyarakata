/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
	theme: {
		extend: {
			animation: {
				blink: "blink 1s step-end infinite",
				slowBlink: "blink 1.5s step-end infinite",
				fastPulse: "pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				glitch: "glitch 0.3s ease forwards",
				scanline: "scanline 2s linear infinite",
				textShadow: "textShadow 2s ease infinite",
				oldCRT: "oldCRT 8s linear infinite",
				typewriter: "typewriter 4s steps(40, end)",
				cursor: "cursor 0.75s step-end infinite",
				flicker: "flicker 3s infinite",
				vhsTracking: "vhsTracking 5s ease-in-out infinite",
				loading: "loading 2s ease infinite",
				powerOn: "powerOn 4s cubic-bezier(0.23, 1, 0.32, 1)",
			},
			keyframes: {
				blink: {
					"0%, 100%": { opacity: 1 },
					"50%": { opacity: 0 },
				},
				glitch: {
					"0%": { transform: "translate(0)" },
					"20%": { transform: "translate(-2px, 2px)" },
					"40%": { transform: "translate(-2px, -2px)" },
					"60%": { transform: "translate(2px, 2px)" },
					"80%": { transform: "translate(2px, -2px)" },
					"100%": { transform: "translate(0)" },
				},
				scanline: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				textShadow: {
					"0%": {
						textShadow:
							"0.4389924193300864px 0 1px rgba(0,30,255,0.5), -0.4389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"5%": {
						textShadow:
							"2.7928974010788217px 0 1px rgba(0,30,255,0.5), -2.7928974010788217px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"10%": {
						textShadow:
							"0.02956275843481219px 0 1px rgba(0,30,255,0.5), -0.02956275843481219px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"15%": {
						textShadow:
							"0.40218538552878136px 0 1px rgba(0,30,255,0.5), -0.40218538552878136px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"20%": {
						textShadow:
							"3.4794037899852017px 0 1px rgba(0,30,255,0.5), -3.4794037899852017px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"25%": {
						textShadow:
							"1.6125630401149584px 0 1px rgba(0,30,255,0.5), -1.6125630401149584px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"30%": {
						textShadow:
							"0.7015590085143956px 0 1px rgba(0,30,255,0.5), -0.7015590085143956px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"35%": {
						textShadow:
							"3.896914047650351px 0 1px rgba(0,30,255,0.5), -3.896914047650351px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"40%": {
						textShadow:
							"3.870905614848819px 0 1px rgba(0,30,255,0.5), -3.870905614848819px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"45%": {
						textShadow:
							"2.231056963361899px 0 1px rgba(0,30,255,0.5), -2.231056963361899px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"50%": {
						textShadow:
							"0.08084290417898504px 0 1px rgba(0,30,255,0.5), -0.08084290417898504px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"55%": {
						textShadow:
							"2.3758461067427543px 0 1px rgba(0,30,255,0.5), -2.3758461067427543px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"60%": {
						textShadow:
							"2.202193051050636px 0 1px rgba(0,30,255,0.5), -2.202193051050636px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"65%": {
						textShadow:
							"2.8638780614874975px 0 1px rgba(0,30,255,0.5), -2.8638780614874975px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"70%": {
						textShadow:
							"0.48874025155497314px 0 1px rgba(0,30,255,0.5), -0.48874025155497314px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"75%": {
						textShadow:
							"1.8948491305757957px 0 1px rgba(0,30,255,0.5), -1.8948491305757957px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"80%": {
						textShadow:
							"0.0833037308038857px 0 1px rgba(0,30,255,0.5), -0.0833037308038857px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"85%": {
						textShadow:
							"0.09769827255241735px 0 1px rgba(0,30,255,0.5), -0.09769827255241735px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"90%": {
						textShadow:
							"3.443339761481782px 0 1px rgba(0,30,255,0.5), -3.443339761481782px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"95%": {
						textShadow:
							"2.1841838852799786px 0 1px rgba(0,30,255,0.5), -2.1841838852799786px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
					"100%": {
						textShadow:
							"2.6208764473832513px 0 1px rgba(0,30,255,0.5), -2.6208764473832513px 0 1px rgba(255,0,80,0.3), 0 0 3px",
					},
				},
				oldCRT: {
					"0%": {
						backgroundColor: "#000",
						opacity: "0.3",
					},
					"5%": {
						backgroundColor: "#0a0a0a",
						opacity: "0.3",
					},
					"10%": {
						backgroundColor: "#111",
						opacity: "0.32",
					},
					"15%": {
						backgroundColor: "#000",
						opacity: "0.31",
					},
					"20%": {
						backgroundColor: "#111",
						opacity: "0.33",
					},
					"25%": {
						backgroundColor: "#0a0a0a",
						opacity: "0.3",
					},
					"30%": {
						backgroundColor: "#000",
						opacity: "0.35",
					},
					"35%": {
						backgroundColor: "#111",
						opacity: "0.32",
					},
					"40%": {
						backgroundColor: "#000",
						opacity: "0.3",
					},
					"45%": {
						backgroundColor: "#0a0a0a",
						opacity: "0.28",
					},
					"50%": {
						backgroundColor: "#111",
						opacity: "0.3",
					},
					"55%": {
						backgroundColor: "#000",
						opacity: "0.33",
					},
					"60%": {
						backgroundColor: "#0a0a0a",
						opacity: "0.3",
					},
					"65%": {
						backgroundColor: "#111",
						opacity: "0.28",
					},
					"70%": {
						backgroundColor: "#000",
						opacity: "0.3",
					},
					"75%": {
						backgroundColor: "#0a0a0a",
						opacity: "0.32",
					},
					"80%": {
						backgroundColor: "#000",
						opacity: "0.3",
					},
					"85%": {
						backgroundColor: "#111",
						opacity: "0.33",
					},
					"90%": {
						backgroundColor: "#0a0a0a",
						opacity: "0.28",
					},
					"95%": {
						backgroundColor: "#000",
						opacity: "0.32",
					},
					"100%": {
						backgroundColor: "#111",
						opacity: "0.3",
					},
				},
				typewriter: {
					"0%": { width: "0%" },
					"100%": { width: "100%" },
				},
				cursor: {
					"0%": { borderColor: "transparent" },
					"50%": { borderColor: "#0f0" },
					"100%": { borderColor: "transparent" },
				},
				flicker: {
					"0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
						opacity: "0.99",
						filter:
							"drop-shadow(0 0 1px rgba(0, 255, 0, 0.7)) drop-shadow(0 0 5px rgba(0, 255, 0, 0.7))",
					},
					"20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
						opacity: "0.4",
						filter: "none",
					},
				},
				vhsTracking: {
					"0%": { transform: "translateY(0)" },
					"5%": { transform: "translateY(-0.5px)" },
					"10%": { transform: "translateY(0.5px)" },
					"15%": { transform: "translateY(-1px)" },
					"20%": { transform: "translateY(1px)" },
					"25%": { transform: "translateY(0)" },
					"30%": { transform: "translateY(-1px)" },
					"35%": { transform: "translateY(1px)" },
					"40%": { transform: "translateY(-0.5px)" },
					"45%": { transform: "translateY(0.5px)" },
					"50%": { transform: "translateY(0)" },
					"55%": { transform: "translateY(-0.5px)" },
					"60%": { transform: "translateY(0.5px)" },
					"65%": { transform: "translateY(-1px)" },
					"70%": { transform: "translateY(1px)" },
					"75%": { transform: "translateY(0)" },
					"80%": { transform: "translateY(-1px)" },
					"85%": { transform: "translateY(1px)" },
					"90%": { transform: "translateY(-0.5px)" },
					"95%": { transform: "translateY(0.5px)" },
					"100%": { transform: "translateY(0)" },
				},
				loading: {
					"0%": { color: "#0f0" },
					"25%": { color: "#0c0" },
					"50%": { color: "#090" },
					"75%": { color: "#0c0" },
					"100%": { color: "#0f0" },
				},
				powerOn: {
					"0%": {
						opacity: "0",
						filter: "brightness(5) blur(10px)",
					},
					"10%": {
						opacity: "0.1",
						filter: "brightness(5) blur(7px)",
					},
					"30%": {
						opacity: "0.5",
						filter: "brightness(2) blur(5px)",
					},
					"50%": {
						opacity: "0.7",
						filter: "brightness(1.5) blur(3px)",
					},
					"75%": {
						opacity: "0.85",
						filter: "brightness(1.2) blur(1px)",
					},
					"90%": {
						opacity: "0.95",
						filter: "brightness(1.1) blur(0.5px)",
					},
					"100%": {
						opacity: "1",
						filter: "brightness(1) blur(0)",
					},
				},
			},
			colors: {
				"amber-crt": "#ffb000",
				"green-crt": "#00ff00",
				"blue-crt": "#00ffff",
				"terminal-black": "#131313",
			},
		},
	},
	plugins: [],
};
