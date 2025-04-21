import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
	Search,
	Plus,
	Edit,
	Trash2,
	X,
	Check,
	BookOpen,
	Bookmark,
} from "lucide-react";

interface NovelData {
	id: number;
	title: string;
	author: string;
	description: string;
	cover_image_url: string;
	created_at: string;
	updated_at: string;
	chapter_count?: number;
}

function Novels() {
	const [novels, setNovels] = useState<NovelData[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentNovel, setCurrentNovel] = useState<NovelData | null>(null);

	const fetchNovels = async () => {
		try {
			setLoading(true);
			// 获取小说数据
			const { data: novelsData, error: novelsError } = await supabase
				.from("novels")
				.select("*")
				.order("created_at", { ascending: false });

			if (novelsError) {
				throw novelsError;
			}

			// 获取每本小说的章节数量
			if (novelsData) {
				const novelsWithChapterCount = await Promise.all(
					novelsData.map(async (novel) => {
						const { count, error } = await supabase
							.from("chapters")
							.select("id", { count: "exact", head: true })
							.eq("novel_id", novel.id);

						return {
							...novel,
							chapter_count: count || 0,
						};
					})
				);

				setNovels(novelsWithChapterCount);
			}
		} catch (error) {
			console.error("获取小说数据失败:", error);

			// 演示用示例数据
			setNovels([
				{
					id: 1,
					title: "三国演义",
					author: "罗贯中",
					description: "记载了从东汉末年到西晋初年之间近百年的历史风云",
					cover_image_url: "https://example.com/sanguo.jpg",
					created_at: "2023-01-01T00:00:00Z",
					updated_at: "2023-01-01T00:00:00Z",
					chapter_count: 120,
				},
				{
					id: 2,
					title: "水浒传",
					author: "施耐庵",
					description: "以宋江领导的农民起义为题材，描写了梁山好汉的英雄故事",
					cover_image_url: "https://example.com/shuihu.jpg",
					created_at: "2023-02-15T00:00:00Z",
					updated_at: "2023-02-15T00:00:00Z",
					chapter_count: 100,
				},
				{
					id: 3,
					title: "西游记",
					author: "吴承恩",
					description: "讲述了唐僧师徒四人西天取经，历经九九八十一难的故事",
					cover_image_url: "https://example.com/xiyou.jpg",
					created_at: "2023-03-20T00:00:00Z",
					updated_at: "2023-03-20T00:00:00Z",
					chapter_count: 86,
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNovels();
	}, []);

	const filteredNovels = novels.filter(
		(novel) =>
			novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			novel.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
			novel.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openEditModal = (novel: NovelData) => {
		setCurrentNovel(novel);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		setCurrentNovel(null);
		setIsModalOpen(true);
	};

	const handleDeleteNovel = async (id: number) => {
		if (window.confirm("确定要删除这本小说吗？这将同时删除所有相关章节！")) {
			try {
				// 真实应用中应该从Supabase删除小说及其章节
				// const { error: chaptersError } = await supabase.from('chapters').delete().eq('novel_id', id);
				// const { error: novelError } = await supabase.from('novels').delete().eq('id', id);

				// 演示目的，仅从状态中过滤掉该小说
				setNovels(novels.filter((novel) => novel.id !== id));
			} catch (error) {
				console.error("删除小说失败:", error);
			}
		}
	};

	// 小说表单组件
	const NovelForm = () => {
		return (
			<div className="mt-5 space-y-4">
				<Input
					label="小说标题"
					defaultValue={currentNovel?.title || ""}
					placeholder="输入小说标题"
				/>
				<Input
					label="作者"
					defaultValue={currentNovel?.author || ""}
					placeholder="输入作者姓名"
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						简介
					</label>
					<textarea
						rows={4}
						defaultValue={currentNovel?.description || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入小说简介"
					></textarea>
				</div>
				<Input
					label="封面图片URL"
					defaultValue={currentNovel?.cover_image_url || ""}
					placeholder="输入封面图片URL"
				/>

				<div className="flex justify-end space-x-3 pt-5">
					<Button
						variant="outline"
						onClick={() => setIsModalOpen(false)}
						leftIcon={<X size={16} />}
					>
						取消
					</Button>
					<Button
						leftIcon={<Check size={16} />}
						onClick={() => {
							// 真实应用中，应该保存小说到Supabase
							setIsModalOpen(false);
							fetchNovels();
						}}
					>
						{currentNovel ? "更新小说" : "创建小说"}
					</Button>
				</div>
			</div>
		);
	};

	const navigateToChapters = (novelId: number, novelTitle: string) => {
		// 在实际应用中，这里应该是导航到该小说的章节列表页面
		// 例如：navigate(`/chapters?novel_id=${novelId}`);
		console.log(`导航到小说 ${novelTitle} (ID: ${novelId}) 的章节列表`);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						小说管理
					</h1>
					<p className="text-gray-500 dark:text-gray-400">管理您的小说和章节</p>
				</div>
				<Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
					添加小说
				</Button>
			</div>

			<Card>
				<div className="flex justify-between items-center mb-4">
					<div className="w-full max-w-xs">
						<Input
							placeholder="搜索小说..."
							leftIcon={<Search className="h-5 w-5 text-gray-400" />}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-4">加载小说中...</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										小说
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										作者
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										章节数
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
								{filteredNovels.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
										>
											未找到小说
										</td>
									</tr>
								) : (
									filteredNovels.map((novel) => (
										<tr key={novel.id}>
											<td className="px-6 py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10 overflow-hidden rounded-md">
														{novel.cover_image_url ? (
															<img
																src={novel.cover_image_url}
																alt={novel.title}
																className="h-10 w-10 object-cover"
																onError={(e) => {
																	(e.target as HTMLImageElement).onerror = null;
																	(e.target as HTMLImageElement).src =
																		"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJvb2siPjxwYXRoIGQ9Ik00IDMwaDQiLz48cGF0aCBkPSJNNC4wMyAxOS4wM0E5IDkgMCAxIDEgMTUuMDMgOC4wMyIvPjxwYXRoIGQ9Ik0xMiA4YTQ0IDI1cyAwIDgtMTAgOGgxMGMtNC4zIDAtOC0zLTgtOFoiLz48cGF0aCBkPSJNMyAzYTEgMSAwIDAgMSAxLTFoMTYhMTBBMSAxIDAgMCAxIDMgMyIvPjwvc3ZnPg==";
																}}
															/>
														) : (
															<div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
																<BookOpen className="h-6 w-6 text-gray-500 dark:text-gray-300" />
															</div>
														)}
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900 dark:text-white">
															{novel.title}
														</div>
														<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
															{novel.description}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{novel.author}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{novel.chapter_count || 0}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{new Date(novel.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
												<button
													className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
													onClick={() =>
														navigateToChapters(novel.id, novel.title)
													}
													title="查看章节"
												>
													<Bookmark className="h-5 w-5" />
												</button>
												<button
													className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
													onClick={() => openEditModal(novel)}
													title="编辑小说"
												>
													<Edit className="h-5 w-5" />
												</button>
												<button
													className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
													onClick={() => handleDeleteNovel(novel.id)}
													title="删除小说"
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

			{/* 小说表单模态框 */}
			{isModalOpen && (
				<div className="fixed inset-0 overflow-y-auto z-50">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div
							className="fixed inset-0 transition-opacity"
							onClick={() => setIsModalOpen(false)}
						>
							<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>
						<span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
						<div
							className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
									{currentNovel ? "编辑小说" : "创建新小说"}
								</h3>
								<NovelForm />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Novels;
