import React, { useEffect, useState } from "react";
import asciichart from "asciichart";

interface AsciiChartProps {
	data: number[];
	height?: number;
	className?: string;
	colors?: string[];
	label?: string;
	animated?: boolean;
}

const AsciiChart: React.FC<AsciiChartProps> = ({
	data,
	height = 10,
	colors = ["terminal-green"],
	className = "",
	label,
	animated = false,
}) => {
	const [animatedData, setAnimatedData] = useState<number[]>([]);
	const [isTyping, setIsTyping] = useState(true);

	useEffect(() => {
		if (animated) {
			setAnimatedData([]);
			setIsTyping(true);

			// 动画效果逐步展示数据
			const timer = setInterval(() => {
				setAnimatedData((prev) => {
					if (prev.length >= data.length) {
						setIsTyping(false);
						clearInterval(timer);
						return data;
					}
					return [...prev, data[prev.length]];
				});
			}, 150);

			return () => clearInterval(timer);
		} else {
			setAnimatedData(data);
			setIsTyping(false);
		}
	}, [data, animated]);

	const getChartColor = (color: string): number => {
		switch (color) {
			case "terminal-green":
				return 32; // ANSI绿色
			case "terminal-red":
				return 31; // ANSI红色
			case "terminal-blue":
				return 34; // ANSI蓝色
			case "terminal-yellow":
				return 33; // ANSI黄色
			case "terminal-magenta":
				return 35; // ANSI品红
			case "terminal-cyan":
				return 36; // ANSI青色
			default:
				return 37; // ANSI白色（默认）
		}
	};

	const config = {
		height: height,
		colors: colors.map((color) => getChartColor(color)),
	};

	const chartData = animated ? animatedData : data;

	// 确保有足够数据来绘制图表
	const chart =
		chartData.length > 1
			? asciichart.plot(chartData, config)
			: "数据不足，无法绘制图表";

	return (
		<div
			className={`ascii-chart ${className} ${
				isTyping ? "animate-cursor-blink" : ""
			}`}
		>
			{label && (
				<div className="text-sm mb-1 text-[var(--terminal-green)]">{label}</div>
			)}
			<pre className="text-xs leading-tight overflow-x-auto whitespace-pre text-[var(--terminal-green)]">
				{chart}
			</pre>
			{isTyping && <div className="ascii-cursor"></div>}
		</div>
	);
};

export default AsciiChart;
