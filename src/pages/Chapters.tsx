import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search, Plus, Edit, Trash2, BookText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 明确定义类型
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

// 安全类型解决方案：强制类型断言辅助函数
function getNovelId(novel: NovelData | null): string {
	return novel ? novel.id.toString() : "";
}

export default function Chapters() {
	const [chapters, setChapters] = useState<ChapterData[]>([]);
	const [novels, setNovels] = useState<NovelData[]>([]);
	const [selectedNovel, setSelectedNovel] = useState<NovelData | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	// 从URL获取novel_id (在实际应用中使用路由参数)
	const getNovelIdFromUrl = () => {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get("novel_id")
			? parseInt(urlParams.get("novel_id")!)
			: null;
	};

	const fetchNovels = async () => {
		try {
			const { data, error } = await supabase
				.from("novels")
				.select("id, title")
				.order("title");

			if (error) throw error;
			setNovels(data || []);

			// 如果URL中有novel_id，选中它
			const novelIdFromUrl = getNovelIdFromUrl();
			if (novelIdFromUrl && data) {
				const novelFromUrl = data.find((novel) => novel.id === novelIdFromUrl);
				if (novelFromUrl) {
					setSelectedNovel(novelFromUrl);
				}
			}
		} catch (error) {
			console.error("获取小说列表失败:", error);
			// 演示数据
			const demoNovels: NovelData[] = [
				{ id: 1, title: "三国演义" },
				{ id: 2, title: "水浒传" },
				{ id: 3, title: "西游记" },
			];
			setNovels(demoNovels);

			// 演示：选择第一本小说
			const novelIdFromUrl = getNovelIdFromUrl();
			if (novelIdFromUrl) {
				const novelFromUrl = demoNovels.find(
					(novel) => novel.id === novelIdFromUrl
				);
				if (novelFromUrl) {
					setSelectedNovel(novelFromUrl);
				}
			}
		}
	};

	const fetchChapters = async () => {
		if (!selectedNovel) return;

		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("chapters")
				.select("*")
				.eq("novel_id", selectedNovel.id)
				.order("chapter_number", { ascending: true });

			if (error) {
				throw error;
			}

			setChapters(data || []);
		} catch (error) {
			console.error("获取章节数据失败:", error);

			// 演示用示例数据
			if (selectedNovel.id === 1) {
				// 三国演义
				setChapters([
					{
						id: 1,
						novel_id: 1,
						title: "第一回 宴桃园豪杰三结义 斩黄巾英雄首立功",
						content: "话说天下大势，分久必合，合久必分...",
						chapter_number: 1,
						created_at: "2023-01-01T00:00:00Z",
						updated_at: "2023-01-01T00:00:00Z",
					},
					{
						id: 2,
						novel_id: 1,
						title: "第二回 张翼德怒鞭督邮 何国舅谋诛宦竖",
						content: "且说董卓字仲颖，陇西临洮人也...",
						chapter_number: 2,
						created_at: "2023-01-02T00:00:00Z",
						updated_at: "2023-01-02T00:00:00Z",
					},
					{
						id: 3,
						novel_id: 1,
						title: "第三回 议温明董卓叱丁原 馈金珠李肃说吕布",
						content: "且说董卓既掌朝政，威势日盛...",
						chapter_number: 3,
						created_at: "2023-01-03T00:00:00Z",
						updated_at: "2023-01-03T00:00:00Z",
					},
				]);
			} else if (selectedNovel.id === 2) {
				// 水浒传
				setChapters([
					{
						id: 4,
						novel_id: 2,
						title: "第一回 张天师祈禳瘟疫 洪太尉误走妖魔",
						content: "话说，洪太尉只道高俅是个武官之职...",
						chapter_number: 1,
						created_at: "2023-02-01T00:00:00Z",
						updated_at: "2023-02-01T00:00:00Z",
					},
					{
						id: 5,
						novel_id: 2,
						title: "第二回 王教头私走延安府 九纹龙大闹史家村",
						content: "话说当时高俅正在府衙...",
						chapter_number: 2,
						created_at: "2023-02-02T00:00:00Z",
						updated_at: "2023-02-02T00:00:00Z",
					},
				]);
			} else {
				// 西游记
				setChapters([
					{
						id: 6,
						novel_id: 3,
						title: "第一回 灵根育孕源流出 心性修持大道生",
						content: "诗曰：混沌未分天地乱，茫茫渺渺无人见...",
						chapter_number: 1,
						created_at: "2023-03-01T00:00:00Z",
						updated_at: "2023-03-01T00:00:00Z",
					},
					{
						id: 7,
						novel_id: 3,
						title: "第二回 悟彻菩提真妙理 断魔归本合元神",
						content: "话表美猴王得了姓名...",
						chapter_number: 2,
						created_at: "2023-03-02T00:00:00Z",
						updated_at: "2023-03-02T00:00:00Z",
					},
				]);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNovels();
	}, []);

	useEffect(() => {
		if (selectedNovel) {
			fetchChapters();
		} else {
			setChapters([]);
		}
	}, [selectedNovel]);

	const filteredChapters = chapters.filter(
		(chapter) =>
			chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			chapter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			chapter.chapter_number.toString().includes(searchTerm)
	);

	const openEditModal = (chapter: ChapterData) => {
		// 导航到单独的编辑器页面
		navigate(`/chapter-editor/${selectedNovel?.id}/${chapter.id}`);
	};

	const openCreateModal = () => {
		if (!selectedNovel) {
			alert("请先选择一本小说");
			return;
		}

		// 导航到新增章节的编辑器页面
		navigate(`/chapter-editor/${selectedNovel.id}/new`);
	};

	const handleDeleteChapter = async (id: number) => {
		if (window.confirm("确定要删除这个章节吗？")) {
			try {
				// 真实应用中应该从Supabase删除章节
				// const { error } = await supabase.from('chapters').delete().eq('id', id);

				// 演示目的，仅从状态中过滤掉该章节
				setChapters(chapters.filter((chapter) => chapter.id !== id));
			} catch (error) {
				console.error("删除章节失败:", error);
			}
		}
	};

	// 准备选择器选项
	const novelOptions = novels.map((novel) => (
		<option key={novel.id} value={novel.id}>
			{novel.title}
		</option>
	));

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						章节管理
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						{selectedNovel
							? `管理《${selectedNovel.title}》的章节`
							: "请选择一本小说来管理其章节"}
					</p>
				</div>
				<div className="flex space-x-2">
					<Button
						variant="outline"
						leftIcon={<ArrowLeft size={16} />}
						onClick={() => window.history.back()}
					>
						返回小说列表
					</Button>
					<Button
						leftIcon={<Plus size={16} />}
						onClick={openCreateModal}
						disabled={!selectedNovel}
					>
						添加章节
					</Button>
				</div>
			</div>

			{!selectedNovel ? (
				<Card className="p-4">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							选择小说
						</label>
						<select
							className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							onChange={(e) => {
								if (e.target.value) {
									const novelId = parseInt(e.target.value);
									const novel = novels.find((n) => n.id === novelId);
									if (novel) {
										setSelectedNovel(novel);
									}
								} else {
									setSelectedNovel(null);
								}
							}}
							value={getNovelId(selectedNovel)}
						>
							<option value="">请选择小说</option>
							{novelOptions}
						</select>
					</div>
				</Card>
			) : (
				<Card>
					<div className="flex justify-between items-center mb-4 p-4">
						<div className="w-full max-w-xs">
							<Input
								placeholder="搜索章节..."
								leftIcon={<Search className="h-5 w-5 text-gray-400" />}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="ml-4">
							<select
								className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								onChange={(e) => {
									if (e.target.value) {
										const novelId = parseInt(e.target.value);
										const novel = novels.find((n) => n.id === novelId);
										if (novel) {
											setSelectedNovel(novel);
										}
									}
								}}
								value={getNovelId(selectedNovel)}
							>
								{novelOptions}
							</select>
						</div>
					</div>

					{loading ? (
						<div className="text-center py-4">加载章节中...</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-700">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
										>
											章节
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
										>
											内容预览
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
										>
											创建时间
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
										>
											操作
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
									{filteredChapters.length === 0 ? (
										<tr>
											<td
												colSpan={4}
												className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
											>
												未找到章节
											</td>
										</tr>
									) : (
										filteredChapters.map((chapter) => (
											<tr
												key={chapter.id}
												className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
												onClick={() => openEditModal(chapter)}
											>
												<td className="px-6 py-4">
													<div className="flex items-center">
														<div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
															<BookText className="h-6 w-6 text-gray-500 dark:text-gray-300" />
														</div>
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
																<span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs mr-2">
																	第{chapter.chapter_number}章
																</span>
																{chapter.title}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
														{chapter.content}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
													{new Date(chapter.created_at).toLocaleDateString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
													<button
														className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
														onClick={(e) => {
															e.stopPropagation();
															openEditModal(chapter);
														}}
													>
														<Edit className="h-5 w-5" />
													</button>
													<button
														className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteChapter(chapter.id);
														}}
													>
														<Trash2 className="h-5 w-5" />
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}
