import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Menu, Timer } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import CrtEffectToggle from "@/components/ui/CrtEffectToggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
	setSidebarOpen: (open: boolean) => void;
}

function Header({ setSidebarOpen }: HeaderProps) {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			return (
				localStorage.getItem("darkMode") === "true" ||
				(!localStorage.getItem("darkMode") &&
					window.matchMedia("(prefers-color-scheme: dark)").matches)
			);
		}
		return false;
	});

	const [currentTime, setCurrentTime] = useState("00:00:00");
	const [clickedButton, setClickedButton] = useState("");
	const [showGlitch, setShowGlitch] = useState(false);

	const { user } = useAuthStore();

	// 控制点击效果
	const handleButtonClick = (buttonName: string) => {
		setClickedButton(buttonName);
		setShowGlitch(true);

		setTimeout(() => {
			setClickedButton("");
			setShowGlitch(false);
		}, 300);
	};

	// Toggle dark mode
	const toggleDarkMode = () => {
		handleButtonClick("darkMode");
		setTimeout(() => {
			setIsDarkMode(!isDarkMode);
		}, 200);
	};

	// 更新当前时间
	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, "0");
			const minutes = String(now.getMinutes()).padStart(2, "0");
			const seconds = String(now.getSeconds()).padStart(2, "0");
			setCurrentTime(`${hours}:${minutes}:${seconds}`);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Update class on document when dark mode changes
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("darkMode", isDarkMode.toString());
	}, [isDarkMode]);

	return (
		<header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-black border-b-2 border-dashed border-cyan-400 dark:border-cyan-700 text-green-400 dark:text-green-400 relative overflow-hidden">
			{/* 背景格子图案 */}
			<div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#3f3,1px,transparent_1px)] [background-size:10px_10px]"></div>

			{/* CRT扫描线效果 */}
			<div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scanline"></div>

			<button
				type="button"
				className="md:hidden px-4 text-cyan-400 hover:text-cyan-300 focus:outline-none relative group"
				onClick={() => {
					handleButtonClick("menu");
					setTimeout(() => setSidebarOpen(true), 200);
				}}
			>
				<span className="sr-only">Open sidebar</span>
				<div className="relative">
					<Menu
						className="h-6 w-6 group-hover:animate-pulse"
						aria-hidden="true"
					/>
				</div>
				<div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scanline"></div>
			</button>

			<div className="flex-1 px-4 flex justify-between">
				<div className="flex-1 flex items-center">
					<div className="hidden md:block font-mono text-cyan-400 dark:text-cyan-400 ascii-border relative px-6 py-3">
						<h2 className="text-xl font-bold tracking-wider animate-[textShadow_2s_infinite]">
							<span className="mr-2 opacity-70">&gt;</span>
							WELCOME_BACK.SYS
							<span className="ml-1 animate-blink">_</span>
						</h2>
						<p className="text-sm text-green-400 dark:text-green-400 typewriter">
							<span className="mr-2 opacity-70">$</span>
							{user?.email || "USER@SYSTEM"}
						</p>
					</div>
				</div>

				<div className="ml-4 flex items-center md:ml-6">
					{/* 时间显示 */}
					<div className="hidden md:flex items-center mr-2 border border-dashed border-green-500/50 px-2 py-1 bg-black/50">
						<Timer className="h-4 w-4 mr-1 text-green-500" />
						<span className="font-mono text-sm text-green-400">
							{currentTime}
						</span>
					</div>

					{/* CRT 效果切换按钮 */}
					<div
						className={cn(
							"relative group ml-2",
							clickedButton === "crt" && showGlitch && "animate-glitch"
						)}
						onClick={() => handleButtonClick("crt")}
					>
						<CrtEffectToggle className="border border-dashed border-cyan-500/50 hover:border-cyan-400 p-1 bg-black hover:bg-cyan-900/20 transition-all duration-150" />
						<div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scanline"></div>
					</div>

					{/* Toggle dark mode */}
					<button
						type="button"
						onClick={toggleDarkMode}
						className={cn(
							"relative group ml-2 border border-dashed border-cyan-500/50 hover:border-cyan-400 p-1 bg-black hover:bg-cyan-900/20 transition-all duration-150",
							clickedButton === "darkMode" && showGlitch && "animate-glitch"
						)}
					>
						<span className="sr-only">Toggle dark mode</span>

						{isDarkMode ? (
							<Sun
								className="h-6 w-6 text-yellow-400 group-hover:animate-pulse"
								aria-hidden="true"
							/>
						) : (
							<Moon
								className="h-6 w-6 text-cyan-400 group-hover:animate-pulse"
								aria-hidden="true"
							/>
						)}
						<div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scanline"></div>
					</button>

					{/* Notification button */}
					<button
						type="button"
						onClick={() => handleButtonClick("notification")}
						className={cn(
							"relative group ml-2 border border-dashed border-cyan-500/50 hover:border-cyan-400 p-1 bg-black hover:bg-cyan-900/20 transition-all duration-150",
							clickedButton === "notification" && showGlitch && "animate-glitch"
						)}
					>
						<span className="sr-only">View notifications</span>

						<Bell
							className="h-6 w-6 text-cyan-400 group-hover:animate-pulse"
							aria-hidden="true"
						/>
						<div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scanline"></div>
					</button>
				</div>
			</div>
		</header>
	);
}

export default Header;
