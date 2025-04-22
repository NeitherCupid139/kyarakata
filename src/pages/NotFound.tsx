import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon, Terminal } from "lucide-react";
import "@/styles/globals.css";

const NotFound = () => {
	const navigate = useNavigate();
	const [cursor, setCursor] = useState(true);
	const [loadingText, setLoadingText] = useState("");
	const [showButton, setShowButton] = useState(false);
	const [buttonHover, setButtonHover] = useState(false);
	const [glitchEffect, setGlitchEffect] = useState(false);
	const [isPoweringOn, setIsPoweringOn] = useState(true);

	// ASCII Art for 404
	const ascii404 = `
  ███████╗ ██████╗ ██╗  ██╗
  ██╔════╝██╔═████╗██║  ██║
  █████╗  ██║██╔██║███████║
  ██╔══╝  ████╔╝██║╚════██║
  ███████╗╚██████╔╝     ██║
  ╚══════╝ ╚═════╝      ╚═╝
  `;

	// 模拟旧电脑开机效果
	useEffect(() => {
		setTimeout(() => {
			setIsPoweringOn(false);
		}, 2000);
	}, []);

	// 模拟旧电脑加载文本效果
	useEffect(() => {
		if (isPoweringOn) return;

		const fullText = "错误: 系统故障 - 页面未找到";
		let i = 0;
		const typingInterval = setInterval(() => {
			if (i < fullText.length) {
				setLoadingText((prev) => prev + fullText.charAt(i));
				i++;
			} else {
				clearInterval(typingInterval);
				setTimeout(() => setShowButton(true), 500);
			}
		}, 50);

		return () => clearInterval(typingInterval);
	}, [isPoweringOn]);

	// 闪烁的光标效果
	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setCursor((prev) => !prev);
		}, 530);

		return () => clearInterval(cursorInterval);
	}, []);

	// 随机故障效果
	useEffect(() => {
		if (isPoweringOn) return;

		const glitchInterval = setInterval(() => {
			setGlitchEffect(true);
			setTimeout(() => setGlitchEffect(false), 150);
		}, Math.random() * 5000 + 2000);

		return () => clearInterval(glitchInterval);
	}, [isPoweringOn]);

	// 隐藏滚动条的样式
	useEffect(() => {
		// 添加全局样式来隐藏滚动条
		document.body.style.overflow = "hidden";

		// 清理函数
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	// 按钮点击效果
	const handleButtonClick = () => {
		setShowButton(false);
		setLoadingText("正在重定向至主页面...");
		setGlitchEffect(true);
		setTimeout(() => navigate("/"), 1500);
	};

	if (isPoweringOn) {
		return (
			<div className="min-h-screen bg-black flex flex-col items-center justify-center">
				<div className="animate-powerOn">
					<div className="text-green-crt hologram-text text-4xl font-mono">
						系统启动中...
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen bg-terminal-black text-green-crt flex flex-col items-center justify-center px-6 py-12 font-mono overflow-hidden ${
				glitchEffect ? "animate-glitch" : ""
			}`}
		>
			{/* 背景噪点效果 */}
			<div className="fixed inset-0 pointer-events-none animate-oldCRT"></div>

			<div
				className="border-2 border-green-crt p-8 max-w-2xl w-full relative animate-vhsTracking overflow-hidden"
				style={{
					boxShadow:
						"0 0 15px rgba(0, 255, 0, 0.5), inset 0 0 15px rgba(0, 255, 0, 0.3)",
				}}
			>
				{/* CRT 屏幕效果 */}
				<div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
					{Array.from({ length: 100 }).map((_, i) => (
						<div
							key={i}
							className="absolute h-px bg-green-crt opacity-30 w-full"
							style={{ top: `${i * 1}%`, animationDelay: `${i * 0.01}s` }}
						/>
					))}
				</div>

				<div className="flex items-center justify-between border-b border-green-crt pb-2 mb-4">
					<div className="flex items-center">
						<Terminal className="w-4 h-4 mr-2 animate-pulse" />
						<span className="hologram-text animate-flicker">
							系统控制台.EXE
						</span>
					</div>
					<div className="text-xs border border-green-crt px-2">
						C:\系统\错误
					</div>
				</div>

				<pre className="text-center text-xs sm:text-sm md:text-base whitespace-pre hologram-text overflow-hidden">
					{ascii404}
				</pre>

				<div className="mt-4 text-left">
					<div className="flex items-center">
						<span className="text-green-300">C:\&gt;</span>
						<span className="ml-2 animate-loading">{loadingText}</span>
						<span
							className={`${
								cursor ? "opacity-100" : "opacity-0"
							} ml-0.5 cursor-blink`}
						>
							_
						</span>
					</div>

					{showButton && (
						<div
							className={`mt-8 border-2 border-green-crt text-center p-2 hover:bg-green-900 hover:bg-opacity-30 cursor-pointer transition-all duration-200 button-press ${
								buttonHover ? "scale-105" : "scale-100"
							}`}
							onClick={handleButtonClick}
							onMouseEnter={() => setButtonHover(true)}
							onMouseLeave={() => setButtonHover(false)}
							style={{
								boxShadow: buttonHover
									? "0 0 15px rgba(0, 255, 0, 0.8), inset 0 0 10px rgba(0, 255, 0, 0.5)"
									: "0 0 5px rgba(0, 255, 0, 0.5)",
							}}
						>
							<div className="flex justify-center items-center">
								<HomeIcon
									className={`w-5 h-5 mr-2 ${
										buttonHover ? "animate-pulse" : ""
									}`}
								/>
								<span className="uppercase tracking-wider hologram-text animate-flicker">
									&lt;返回主系统&gt;
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* CRT扫描线动画 */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div className="absolute top-0 left-0 w-full h-2 bg-green-crt opacity-5 animate-scanline" />
			</div>
		</div>
	);
};

export default NotFound;
