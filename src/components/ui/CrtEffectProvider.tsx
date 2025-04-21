import React, { useEffect } from "react";
import { useCrtEffectStore } from "@/store/crtEffectStore";

interface CrtEffectProviderProps {
	children: React.ReactNode;
}

const CrtEffectProvider: React.FC<CrtEffectProviderProps> = ({ children }) => {
	const { enabled } = useCrtEffectStore();

	useEffect(() => {
		const rootElement = document.getElementById("root");
		if (!rootElement) return;

		if (enabled) {
			// 启用 CRT 效果类
			rootElement.classList.add("crt");

			// 添加扫描线效果
			const scanlineElement = document.createElement("div");
			scanlineElement.id = "crt-scanline";
			scanlineElement.className = "scanline";
			document.body.appendChild(scanlineElement);

			// 添加噪点效果
			const noiseElement = document.createElement("div");
			noiseElement.id = "crt-noise";
			noiseElement.className = "noise";
			document.body.appendChild(noiseElement);

			// 设置背景颜色
			document.body.style.backgroundColor = "var(--bg-color)";
		} else {
			// 禁用 CRT 效果类
			rootElement.classList.remove("crt");

			// 移除扫描线效果
			const scanlineElement = document.getElementById("crt-scanline");
			if (scanlineElement) {
				document.body.removeChild(scanlineElement);
			}

			// 移除噪点效果
			const noiseElement = document.getElementById("crt-noise");
			if (noiseElement) {
				document.body.removeChild(noiseElement);
			}

			// 恢复背景颜色
			document.body.style.backgroundColor = "";
		}

		// 设置初始状态
		document.documentElement.dataset.crtEnabled = String(enabled);

		return () => {
			// 清除扫描线效果
			const scanlineElement = document.getElementById("crt-scanline");
			if (scanlineElement) {
				document.body.removeChild(scanlineElement);
			}

			// 清除噪点效果
			const noiseElement = document.getElementById("crt-noise");
			if (noiseElement) {
				document.body.removeChild(noiseElement);
			}

			// 恢复背景颜色
			document.body.style.backgroundColor = "";
		};
	}, [enabled]);

	return <>{children}</>;
};

export default CrtEffectProvider;
