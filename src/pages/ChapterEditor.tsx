import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ChapterEditor from "@/components/ChapterEditor";
import Input from "@/components/ui/Input";
import { ArrowLeft, Save, Eye } from "lucide-react";
import ChapterReview from "@/components/ChapterReview";
import { motion } from "framer-motion";

// ASCII风格装饰组件
const AsciiDecoration = ({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) => (
	<div className={`font-mono text-xs tracking-tighter ${className}`}>
		{children}
	</div>
);

const TopBorder = () => (
	<AsciiDecoration className="text-center text-emerald-500 dark:text-emerald-400 animate-pulse">
		╔══════════════════════════════════════════════════════════════════════════════╗
	</AsciiDecoration>
);

const BottomBorder = () => (
	<AsciiDecoration className="text-center text-emerald-500 dark:text-emerald-400 animate-pulse">
		╚══════════════════════════════════════════════════════════════════════════════╝
	</AsciiDecoration>
);

// 类型定义
interface ChapterData {
	id: number;
	novel_id: number;
	title: string;
	content: string;
	chapter_number: number;
	created_at: string;
	updated_at: string;
}

interface NovelData {
	id: number;
	title: string;
}

// 增加更多ASCII装饰元素
const RetroScreen = ({ children }: { children: ReactNode }) => (
	<div className="relative border-4 border-emerald-600 bg-gray-900 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.5)]">
		<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70 animate-pulse"></div>
		<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70 animate-pulse"></div>
		<div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-70 animate-pulse"></div>
		<div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-70 animate-pulse"></div>
		<div className="p-4 bg-opacity-90">{children}</div>
	</div>
);

const RetroButton = ({
	children,
	onClick,
	className = "",
	disabled = false,
}: {
	children: ReactNode;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}) => (
	<motion.button
		whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
		whileTap={{ scale: disabled ? 1 : 0.95 }}
		onClick={onClick}
		disabled={disabled}
		className={`relative bg-gray-800 border-2 ${
			disabled
				? "border-gray-600 text-gray-500"
				: "border-emerald-500 text-emerald-400"
		} rounded px-4 py-2 font-mono
			overflow-hidden transition-all duration-300 ${className} ${
			disabled
				? "cursor-not-allowed"
				: "hover:shadow-[0_0_8px_rgba(16,185,129,0.6)]"
		}`}
	>
		{!disabled && (
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-scan"></div>
		)}
		{children}
	</motion.button>
);

const ScanLine = () => (
	<div className="fixed top-0 left-0 right-0 bottom-0 z-10 pointer-events-none">
		<div className="w-full h-1 bg-white/5 animate-scanline"></div>
	</div>
);

const RetroGradientText = ({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) => (
	<span className={`animate-colorCycle font-bold ${className}`}>
		{children}
	</span>
);

const StatusIndicator = ({
	text,
	status = "online",
}: {
	text: string;
	status?: "online" | "saving" | "error";
}) => {
	const statusColors = {
		online: "bg-emerald-500",
		saving: "bg-amber-500",
		error: "bg-red-500",
	};

	return (
		<div className="flex items-center text-xs font-mono">
			<span
				className={`inline-block w-2 h-2 rounded-full ${statusColors[status]} mr-1 animate-pulse`}
			></span>
			{text}
		</div>
	);
};

export default function ChapterEditorPage() {
	const navigate = useNavigate();
	const { novelId, chapterId } = useParams();
	const [chapter, setChapter] = useState<ChapterData | null>(null);
	const [novel, setNovel] = useState<NovelData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showReview, setShowReview] = useState(false);
	const [typingEffect, setTypingEffect] = useState("");
	const [cursorVisible, setCursorVisible] = useState(true);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [isCtrlPressed, setIsCtrlPressed] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [showScanLine, setShowScanLine] = useState(true);
	const [asciiArt, setAsciiArt] = useState<string[]>([]);

	useEffect(() => {
		fetchNovelAndChapter();

		// 闪烁光标效果
		const cursorInterval = setInterval(() => {
			setCursorVisible((prev) => !prev);
		}, 500);

		// 键盘快捷键处理
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setIsCtrlPressed(true);
			}

			// Ctrl+S 保存
			if (e.key === "s" && isCtrlPressed) {
				e.preventDefault();
				handleSave();
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Control") {
				setIsCtrlPressed(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		// 随机生成ASCII艺术字
		const artOptions = [
			[
				"┌─────────────────────┐",
				"│ CHAPTER EDITOR v1.0 │",
				"└─────────────────────┘",
			],
			[
				"╔════════════════════╗",
				"║ NOVEL WRITER v1.0  ║",
				"╚════════════════════╝",
			],
			[
				"╭────────────────────╮",
				"│ KYARAKATA SYSTEM   │",
				"╰────────────────────╯",
			],
		];
		setAsciiArt(artOptions[Math.floor(Math.random() * artOptions.length)]);

		return () => {
			clearInterval(cursorInterval);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [novelId, chapterId]);

	// 打字机效果
	useEffect(() => {
		if (chapter?.title && typingEffect.length < chapter.title.length) {
			const timer = setTimeout(() => {
				setTypingEffect(chapter.title.substring(0, typingEffect.length + 1));
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [typingEffect, chapter]);

	const fetchNovelAndChapter = async () => {
		setLoading(true);
		try {
			// 获取小说信息
			if (novelId) {
				const { data: novelData, error: novelError } = await supabase
					.from("novels")
					.select("*")
					.eq("id", novelId)
					.single();

				if (novelError) throw novelError;
				setNovel(novelData);

				// 获取章节信息（如果有chapterId）
				if (chapterId && chapterId !== "new") {
					const { data: chapterData, error: chapterError } = await supabase
						.from("chapters")
						.select("*")
						.eq("id", chapterId)
						.single();

					if (chapterError) throw chapterError;
					setChapter(chapterData);
					setTypingEffect(chapterData.title.charAt(0)); // 启动打字机效果
				} else {
					// 创建新章节
					// 获取当前最大章节号
					const { data: chaptersData } = await supabase
						.from("chapters")
						.select("chapter_number")
						.eq("novel_id", novelId)
						.order("chapter_number", { ascending: false });

					const nextChapterNumber =
						chaptersData && chaptersData.length > 0
							? Math.max(...chaptersData.map((c) => c.chapter_number)) + 1
							: 1;

					setChapter({
						id: 0,
						novel_id: parseInt(novelId),
						title: "",
						content: "",
						chapter_number: nextChapterNumber,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					});
				}
			}
		} catch (error) {
			console.error("获取数据失败:", error);
			// 设置演示数据
			setNovel({ id: parseInt(novelId || "1"), title: "演示小说" });
			if (chapterId && chapterId !== "new") {
				setChapter({
					id: parseInt(chapterId),
					novel_id: parseInt(novelId || "1"),
					title: "演示章节",
					content: "<p>这是一个演示章节的内容...</p>",
					chapter_number: 1,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				});
				setTypingEffect("演"); // 启动打字机效果
			} else {
				setChapter({
					id: 0,
					novel_id: parseInt(novelId || "1"),
					title: "",
					content: "",
					chapter_number: 1,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleEditorChange = (html: string) => {
		if (chapter) {
			setChapter({
				...chapter,
				content: html,
			});
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (chapter) {
			setChapter({
				...chapter,
				title: e.target.value,
			});
			// 重置打字机效果
			setTypingEffect(e.target.value.charAt(0));
		}
	};

	const handleChapterNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (chapter) {
			setChapter({
				...chapter,
				chapter_number: parseInt(e.target.value || "1"),
			});
		}
	};

	const handleSave = async () => {
		if (!chapter) return;

		setSaving(true);
		setErrorMessage("");
		try {
			const chapterData = {
				novel_id: chapter.novel_id,
				title: chapter.title,
				chapter_number: chapter.chapter_number,
				content: chapter.content,
				updated_at: new Date().toISOString(),
			};

			if (chapter.id === 0) {
				// 创建新章节
				const { error } = await supabase
					.from("chapters")
					.insert([{ ...chapterData, created_at: new Date().toISOString() }])
					.select();

				if (error) throw error;

				// 显示成功消息，带有复古动画效果
				setShowSuccessMessage(true);
				setTimeout(() => {
					setShowSuccessMessage(false);
					navigate(`/chapters?novel_id=${novelId}`);
				}, 2000);
			} else {
				// 更新现有章节
				const { error } = await supabase
					.from("chapters")
					.update(chapterData)
					.eq("id", chapter.id)
					.select();

				if (error) throw error;

				// 显示成功消息，带有复古动画效果
				setShowSuccessMessage(true);
				setTimeout(() => {
					setShowSuccessMessage(false);
				}, 2000);
			}
		} catch (error) {
			console.error("保存章节失败:", error);
			setErrorMessage("保存失败，请重试");
			setTimeout(() => setErrorMessage(""), 3000);
		} finally {
			setSaving(false);
		}
	};

	const handleStartReview = () => {
		if (!chapter || !chapter.content) {
			alert("请先添加章节内容再进行审核");
			return;
		}
		setShowReview(true);
	};

	const handleReviewComplete = (approved: boolean, feedback: string) => {
		setShowReview(false);
		if (approved) {
			handleSave();
		} else {
			alert(`章节审核未通过: ${feedback}`);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen font-mono text-emerald-500 dark:text-emerald-400 bg-gray-900">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<div className="mb-4 animate-pulse">
						{asciiArt.map((line, i) => (
							<div key={i}>{line}</div>
						))}
					</div>
					<div className="grid grid-cols-6 gap-1 mt-6">
						{Array.from({ length: 12 }).map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: i * 0.1 }}
								className="h-2 bg-emerald-500 rounded animate-pulse"
							/>
						))}
					</div>
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: "100%" }}
						transition={{ duration: 3, ease: "linear" }}
						className="h-1 bg-emerald-400 mt-6"
					/>
					<div className="mt-4">
						加载中... {Math.floor(Math.random() * 100)}%
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="space-y-4 bg-gray-900 p-4 min-h-screen relative overflow-hidden">
			{/* 复古扫描线效果 */}
			{showScanLine && <ScanLine />}

			{/* 背景网格效果 */}
			<div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

			{/* 顶部导航栏 */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<RetroScreen>
					<TopBorder />
					<div className="flex justify-between items-center px-2">
						<div className="flex items-center">
							<RetroButton
								onClick={() => navigate(`/chapters?novel_id=${novelId}`)}
								className="mr-4 group relative"
							>
								<ArrowLeft className="h-5 w-5" />
								<span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-emerald-400 whitespace-nowrap">
									返回列表
								</span>
							</RetroButton>
							<h1 className="text-xl font-bold text-emerald-400 font-mono flex items-center">
								{novel?.title && (
									<span className="text-gray-300 mr-2">[{novel.title}]</span>
								)}
								<RetroGradientText>{typingEffect}</RetroGradientText>
								<span
									className={`${
										cursorVisible ? "opacity-100" : "opacity-0"
									} transition-opacity text-emerald-500 ml-0.5`}
								>
									_
								</span>
							</h1>
						</div>

						<div className="flex items-center space-x-4">
							<div className="hidden md:flex space-x-2 mr-2">
								{asciiArt.map((line, i) => (
									<div key={i} className="text-xs text-emerald-600 font-mono">
										{line}
									</div>
								))}
							</div>

							<RetroButton
								onClick={handleStartReview}
								className="bg-gray-800 hover:bg-gray-700 border-amber-500 text-amber-400 group relative"
							>
								<Eye className="h-4 w-4 mr-2 inline" />
								审核
								<span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-amber-400 whitespace-nowrap">
									AI审核内容
								</span>
							</RetroButton>

							<RetroButton
								onClick={handleSave}
								disabled={saving}
								className="relative group"
							>
								<Save className="h-4 w-4 mr-2 inline" />
								{saving ? "保存中..." : "保存章节"}
								<span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-emerald-400 whitespace-nowrap">
									Ctrl+S
								</span>
							</RetroButton>
						</div>
					</div>
					<BottomBorder />
				</RetroScreen>
			</motion.div>

			{/* 主编辑区域 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<RetroScreen>
					<div className="mb-4 space-y-4">
						<div className="grid grid-cols-4 gap-4">
							<div className="col-span-3">
								<label className="block text-sm font-medium text-emerald-400 mb-1 font-mono">
									▶ 章节标题
								</label>
								<Input
									value={chapter?.title || ""}
									onChange={handleTitleChange}
									placeholder="输入章节标题"
									className="border-emerald-500 bg-gray-900 text-emerald-300 font-mono focus:ring-2 focus:ring-emerald-400"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-emerald-400 mb-1 font-mono">
									▶ 章节编号
								</label>
								<Input
									type="number"
									value={chapter?.chapter_number.toString() || "1"}
									onChange={handleChapterNumberChange}
									placeholder="输入章节编号"
									className="border-emerald-500 bg-gray-900 text-emerald-300 font-mono focus:ring-2 focus:ring-emerald-400"
								/>
							</div>
						</div>
					</div>

					{/* 编辑器区域 */}
					<div className="mt-4">
						<div className="flex items-center justify-between mb-1">
							<label className="block text-sm font-medium text-emerald-400 font-mono">
								▶ 章节内容
							</label>
							<div className="flex items-center space-x-2">
								<motion.div
									animate={{ opacity: [0.5, 1, 0.5] }}
									transition={{ repeat: Infinity, duration: 3 }}
								>
									<StatusIndicator
										text={
											saving ? "正在保存..." : errorMessage ? "错误" : "已就绪"
										}
										status={
											saving ? "saving" : errorMessage ? "error" : "online"
										}
									/>
								</motion.div>
							</div>
						</div>
						<div
							className="border-2 border-emerald-500 rounded-lg overflow-hidden transition-all hover:shadow-md hover:shadow-emerald-500/30 relative"
							onClick={() => setShowScanLine(false)}
							onMouseLeave={() => setShowScanLine(true)}
						>
							<div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
							<ChapterEditor
								initialContent={chapter?.content || ""}
								onChange={handleEditorChange}
							/>
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
						</div>
					</div>

					{/* 底部信息区 */}
					<div className="mt-4 flex justify-between text-xs text-gray-400 font-mono">
						<div>
							最后更新:{" "}
							{chapter ? new Date(chapter.updated_at).toLocaleString() : "-"}
						</div>
						<div className="flex items-center">
							<span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
							{chapter?.content
								? chapter.content.replace(/<[^>]*>/g, "").length
								: 0}{" "}
							字符
						</div>
					</div>
				</RetroScreen>
			</motion.div>

			{/* 成功保存消息 */}
			{showSuccessMessage && (
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border-2 border-emerald-500 rounded-lg p-6 shadow-lg shadow-emerald-500/40 font-mono text-center z-50"
				>
					<div className="text-emerald-400 text-lg mb-2">保存成功!</div>
					<div className="text-emerald-300 text-sm">
						┌───────────────────┐
						<br />
						│ 章节已成功保存 │<br />
						└───────────────────┘
					</div>

					<motion.div
						className="mt-4 h-1 bg-emerald-500"
						initial={{ width: 0 }}
						animate={{ width: "100%" }}
						transition={{ duration: 2, ease: "linear" }}
					/>
				</motion.div>
			)}

			{/* 审核模态框 */}
			{showReview && chapter && (
				<div className="fixed inset-0 overflow-y-auto z-50 bg-black/70 flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-gray-800 border-2 border-amber-500 rounded-lg p-4 w-full max-w-2xl shadow-lg shadow-amber-500/30"
					>
						<div className="text-amber-400 text-lg mb-4 font-mono border-b border-amber-500 pb-2">
							《{chapter.title}》审核
						</div>
						<ChapterReview
							chapterContent={chapter.content}
							onReviewComplete={handleReviewComplete}
						/>
					</motion.div>
				</div>
			)}
		</div>
	);
}
