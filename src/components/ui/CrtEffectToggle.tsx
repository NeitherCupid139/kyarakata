import React from "react";
import { Monitor } from "lucide-react";
import { useCrtEffectStore } from "@/store/crtEffectStore";

interface CrtEffectToggleProps {
	className?: string;
}

const CrtEffectToggle: React.FC<CrtEffectToggleProps> = ({
	className = "",
}) => {
	const { enabled, toggleCrtEffect } = useCrtEffectStore();

	return (
		<button
			type="button"
			onClick={toggleCrtEffect}
			className={`p-1 rounded-full ${
				enabled
					? "text-green-400 hover:text-green-500"
					: "text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white"
			} focus:outline-none ${className}`}
			title={enabled ? "关闭 CRT 效果" : "开启 CRT 效果"}
		>
			<span className="sr-only">
				{enabled ? "关闭 CRT 效果" : "开启 CRT 效果"}
			</span>
			<Monitor
				className={`h-6 w-6 ${enabled ? "animate-pulse" : ""}`}
				aria-hidden="true"
			/>
		</button>
	);
};

export default CrtEffectToggle;
