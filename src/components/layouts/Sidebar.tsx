import { Link, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Settings,
	LogOut,
	UserRound,
	CalendarClock,
	BookOpen,
	GlobeLock,
	Link2,
	BookText,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

function Sidebar() {
	const location = useLocation();
	const { logout } = useAuthStore();
	const [activeBlink, setActiveBlink] = useState(false);
	const [clickedItem, setClickedItem] = useState("");
	const [showGlitch, setShowGlitch] = useState(false);

	// 控制活动项目的闪烁效果
	useEffect(() => {
		const blinkInterval = setInterval(() => {
			setActiveBlink((prev) => !prev);
		}, 800);

		return () => clearInterval(blinkInterval);
	}, []);

	// 控制点击效果
	const handleItemClick = (name: string) => {
		setClickedItem(name);
		setShowGlitch(true);

		setTimeout(() => {
			setClickedItem("");
			setShowGlitch(false);
		}, 300);
	};

	const navigation = [
		{ name: "仪表盘", href: "/", icon: LayoutDashboard },
		{ name: "角色管理", href: "/characters", icon: UserRound },
		{ name: "事件管理", href: "/events", icon: CalendarClock },
		{ name: "角色关系", href: "/relationships", icon: Link2 },
		{ name: "小说管理", href: "/novels", icon: BookOpen },
		{ name: "章节管理", href: "/chapters", icon: BookText },
		{ name: "时间线", href: "/timelines", icon: CalendarClock },
		{
			name: "世界设定",
			href: "/world-settings",
			icon: GlobeLock,
		},
		{ name: "系统设置", href: "/settings", icon: Settings },
	];

	return (
		<div className="flex flex-col flex-1 h-full border-r-2 border-dashed border-cyan-400 dark:border-cyan-700 bg-black dark:bg-black text-green-400 dark:text-green-400 relative">
			{/* 背景格子图案 */}
			<div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3f3,1px,transparent_1px)] [background-size:10px_10px]"></div>

			{/* CRT屏幕效果 */}
			<div className="absolute inset-0 pointer-events-none [background:linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-blend-screen opacity-30"></div>

			{/* 标题区域 */}
			<div className="flex flex-col items-center h-28 flex-shrink-0 px-4 pt-2 border-b-2 border-dashed border-cyan-400 dark:border-cyan-700 relative overflow-hidden">
				<h1 className="text-xl font-bold font-mono tracking-widest text-cyan-400 dark:text-cyan-400 mt-1 relative">
					<span className="animate-[textShadow_2s_infinite] tracking-[0.2em]">
						Kyarakata
					</span>
					<span className="absolute -right-3 top-0 animate-blink text-cyan-300">
						_
					</span>
				</h1>
			</div>

			<div className="flex-1 flex flex-col overflow-y-auto scrollbar-retro">
				<nav className="flex-1 px-2 py-4 space-y-2">
					{navigation.map((item) => {
						const isActive = location.pathname === item.href;
						const isClicked = clickedItem === item.name;

						return (
							<Link
								key={item.name}
								to={item.href}
								onClick={() => handleItemClick(item.name)}
								className={cn(
									"group flex items-center px-3 py-2 text-sm font-mono font-medium border border-transparent transition-all duration-150",
									isActive
										? "bg-cyan-900/30 text-cyan-300 dark:text-cyan-300 border border-dashed border-cyan-500"
										: "text-green-400 dark:text-green-400 hover:bg-green-900/20 dark:hover:bg-green-900/20 hover:border-dotted hover:border-green-500",
									isClicked && "scale-95 opacity-70",
									showGlitch && isClicked && "animate-glitch",
									"relative overflow-hidden group"
								)}
							>
								{/* 实际图标 */}
								<item.icon
									className={cn(
										"mr-3 flex-shrink-0 h-5 w-5 transition-all duration-150",
										isActive
											? "text-cyan-400 dark:text-cyan-400"
											: "text-green-500 dark:text-green-500 group-hover:text-green-400"
									)}
									aria-hidden="true"
								/>

								{/* 菜单文字 */}
								<span
									className={cn(
										"relative",
										isActive && activeBlink ? "animate-fastPulse" : ""
									)}
								>
									{isActive && (
										<span className="absolute -left-2 text-cyan-300 animate-slowBlink">
											&gt;
										</span>
									)}
									{item.name}
									{isActive && (
										<span className="ml-1 inline-block animate-blink text-cyan-300">
											_
										</span>
									)}
								</span>

								{/* 悬停时的背景扫描线效果 */}
								<div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-scanline"></div>
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="flex-shrink-0 flex border-t-2 border-dashed border-cyan-400 dark:border-cyan-700 p-4">
				<button
					onClick={() => {
						setShowGlitch(true);
						setTimeout(() => {
							setShowGlitch(false);
							logout();
						}, 300);
					}}
					className="flex-shrink-0 w-full group flex items-center px-3 py-2 text-sm font-mono font-medium border border-dashed border-red-500 text-red-400 dark:text-red-400 hover:bg-red-900/20 dark:hover:bg-red-900/20 hover:text-red-300 dark:hover:text-red-300 transition-all duration-150 relative overflow-hidden"
				>
					<span className="mr-3 font-mono text-xs inline-block w-8 text-center opacity-70">
						[X]
					</span>
					<LogOut
						className="mr-3 flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-500"
						aria-hidden="true"
					/>
					<span>退出登录</span>
					<div className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-scanline"></div>
				</button>
			</div>
		</div>
	);
}

export default Sidebar;
