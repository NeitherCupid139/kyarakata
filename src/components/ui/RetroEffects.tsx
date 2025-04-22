import React, { useEffect, useState } from "react";
import { useCrtEffectStore } from "@/store/crtEffectStore";

interface RetroEffectsProps {
	children: React.ReactNode;
	enableNoise?: boolean;
	enableGrid?: boolean;
	bootSequence?: boolean;
	enableGlitch?: boolean;
	enableScanlines?: boolean;
	enableFlicker?: boolean;
}

const RetroEffects: React.FC<RetroEffectsProps> = ({
	children,
	enableNoise = true,
	enableGrid = false,
	bootSequence = false,
	enableGlitch = false,
	enableScanlines = true,
	enableFlicker = false,
}) => {
	const { enabled: crtEnabled } = useCrtEffectStore();
	const [isBooted, setIsBooted] = useState(!bootSequence);
	const [glitchActive, setGlitchActive] = useState(false);

	useEffect(() => {
		if (bootSequence) {
			// 模拟开机过程
			const timer = setTimeout(() => {
				setIsBooted(true);
			}, 2500);
			return () => clearTimeout(timer);
		}
	}, [bootSequence]);

	useEffect(() => {
		if (!enableGlitch || !crtEnabled) return;

		// 随机触发故障效果
		const glitchInterval = setInterval(() => {
			if (Math.random() > 0.9) {
				setGlitchActive(true);

				// 短暂显示故障效果后恢复
				setTimeout(() => {
					setGlitchActive(false);
				}, 150);
			}
		}, 2000);

		return () => clearInterval(glitchInterval);
	}, [enableGlitch, crtEnabled]);

	return (
		<div
			className={`
				relative 
				${bootSequence && !isBooted ? "boot-sequence" : ""} 
				${enableScanlines && crtEnabled ? "crt-effect" : ""}
				${enableFlicker && crtEnabled ? "screen-flicker" : ""}
				${glitchActive ? "retro-glitch" : ""}
			`}
		>
			{/* 噪点效果 */}
			{enableNoise && crtEnabled && <div className="noise" />}

			{/* 网格背景 */}
			<div
				className={`${enableGrid ? "grid-bg" : ""} ${
					bootSequence && !isBooted ? "opacity-0" : ""
				}`}
			>
				{children}
			</div>

			{/* 启动序列 */}
			{bootSequence && !isBooted && (
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-terminal-green font-mono">
					<div className="typing-effect w-64 mb-4">系统启动中...</div>
					<div className="w-64 progress-bar-retro">
						<div className="progress" style={{ width: "80%" }}></div>
					</div>
					<div className="mt-4 loading-dots">正在加载</div>
				</div>
			)}
		</div>
	);
};

export default RetroEffects;
