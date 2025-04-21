import React, { useState, useEffect, useRef } from "react";

interface Command {
	text: string;
	isCommand: boolean;
	output?: string;
}

interface TerminalProps {
	initialCommands?: Command[];
	prompt?: string;
	onCommand?: (command: string) => Promise<string> | string;
	className?: string;
	height?: string;
	autoFocus?: boolean;
	readOnly?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({
	initialCommands = [],
	prompt = "C:\\>",
	onCommand,
	className = "",
	height = "h-80",
	autoFocus = false,
	readOnly = false,
}) => {
	const [commands, setCommands] = useState<Command[]>(initialCommands);
	const [currentInput, setCurrentInput] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);

	// 自动滚动到底部
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [commands]);

	// 处理命令提交
	const handleSubmit = async () => {
		if (!currentInput.trim()) return;

		// 添加到历史记录
		setHistory((prev) => [currentInput, ...prev].slice(0, 50));
		setHistoryIndex(-1);

		// 创建新命令
		const newCommand: Command = {
			text: currentInput,
			isCommand: true,
		};

		// 添加命令到显示列表
		setCommands((prev) => [...prev, newCommand]);

		// 如果有命令处理函数
		if (onCommand) {
			try {
				const output = await onCommand(currentInput);

				// 添加输出到命令列表
				setCommands((prev) => {
					const updatedCommands = [...prev];
					const lastIndex = updatedCommands.length - 1;
					updatedCommands[lastIndex] = {
						...updatedCommands[lastIndex],
						output,
					};
					return updatedCommands;
				});
			} catch (error) {
				// 处理错误
				setCommands((prev) => {
					const updatedCommands = [...prev];
					const lastIndex = updatedCommands.length - 1;
					updatedCommands[lastIndex] = {
						...updatedCommands[lastIndex],
						output: `错误: ${
							error instanceof Error ? error.message : "未知错误"
						}`,
					};
					return updatedCommands;
				});
			}
		}

		// 清空当前输入
		setCurrentInput("");
	};

	// 键盘事件处理
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			navigateHistory("up");
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			navigateHistory("down");
		}
	};

	// 历史记录导航
	const navigateHistory = (direction: "up" | "down") => {
		if (history.length === 0) return;

		let newIndex = historyIndex;

		if (direction === "up") {
			newIndex = Math.min(history.length - 1, historyIndex + 1);
		} else {
			newIndex = Math.max(-1, historyIndex - 1);
		}

		setHistoryIndex(newIndex);

		if (newIndex >= 0 && newIndex < history.length) {
			setCurrentInput(history[newIndex]);
		} else {
			setCurrentInput("");
		}
	};

	// 点击终端聚焦输入框
	const focusInput = () => {
		if (!readOnly && inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<div
			className={`card-retro overflow-auto terminal-text ${height} ${className}`}
			onClick={focusInput}
			ref={terminalRef}
		>
			<div className="p-4 font-mono text-sm">
				{/* 系统欢迎信息 */}
				<div className="mb-4">
					<p className="text-[var(--terminal-cyan)]">K-DOS v1.0</p>
					<p className="text-[var(--terminal-green)]">
						©1988 Kyarakata Corporation
					</p>
					<p className="mb-2">启动完成...</p>
				</div>

				{/* 命令历史 */}
				{commands.map((cmd, index) => (
					<div key={index} className="mb-1">
						{cmd.isCommand ? (
							<>
								<div className="flex">
									<span className="mr-1">{prompt}</span>
									<span>{cmd.text}</span>
								</div>
								{cmd.output && (
									<div className="whitespace-pre-wrap ml-2">{cmd.output}</div>
								)}
							</>
						) : (
							<div className="whitespace-pre-wrap ml-2">{cmd.text}</div>
						)}
					</div>
				))}

				{/* 当前输入行 */}
				{!readOnly && (
					<div className="flex items-center">
						<span className="mr-1">{prompt}</span>
						<input
							ref={inputRef}
							type="text"
							className="flex-grow bg-transparent border-none outline-none text-[var(--terminal-green)] terminal-text"
							value={currentInput}
							onChange={(e) => setCurrentInput(e.target.value)}
							onKeyDown={handleKeyDown}
							autoFocus={autoFocus}
							aria-label="终端输入"
						/>
						<span className="blink ml-px">_</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Terminal;
