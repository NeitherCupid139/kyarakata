import { useState, useEffect, useRef, FormEvent } from "react";
import { useNovels, Novel, CreateNovelData } from "@/hooks/useNovels";
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
	Upload,
	Image,
} from "lucide-react";

interface NovelFormData {
	title: string;
	author: string;
	description: string;
}

function Novels() {
	const {
		loading,
		novels: novelList,
		fetchNovels,
		createNovel,
		updateNovel,
		deleteNovel,
		uploadCover,
		uploadProgress,
	} = useNovels();

	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentNovel, setCurrentNovel] = useState<Novel | null>(null);
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchNovels();
	}, []);

	const filteredNovels = novelList.filter(
		(novel) =>
			novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(novel.author || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			(novel.description || "").toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openEditModal = (novel: Novel) => {
		setCurrentNovel(novel);
		setCoverPreview(novel.cover_image_url);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		setCurrentNovel(null);
		setCoverPreview(null);
		setIsModalOpen(true);
	};

	const handleDeleteNovel = async (id: number) => {
		if (window.confirm("确定要删除这本小说吗？这将同时删除所有相关章节！")) {
			await deleteNovel(id);
		}
	};

	const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 本地预览
		const reader = new FileReader();
		reader.onload = (e) => {
			setCoverPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	// 小说表单组件
	const NovelForm = () => {
		const [formData, setFormData] = useState<NovelFormData>({
			title: currentNovel?.title || "",
			author: currentNovel?.author || "",
			description: currentNovel?.description || "",
		});

		const handleInputChange = (
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		};

		const handleSubmit = async (e: FormEvent) => {
			e.preventDefault();
			if (!formData.title) {
				alert("标题为必填项");
				return;
			}

			setFormSubmitting(true);
			try {
				const file = fileInputRef.current?.files?.[0];

				if (currentNovel) {
					// 更新现有小说
					if (file) {
						// 如果有新封面
						const coverUrl = await uploadCover(file, currentNovel.id);
						if (coverUrl) {
							await updateNovel(currentNovel.id, {
								title: formData.title,
								author: formData.author || undefined,
								description: formData.description || undefined,
								cover_image_url: coverUrl,
							});
						}
					} else {
						// 没有新封面，保留原有封面
						await updateNovel(currentNovel.id, {
							title: formData.title,
							author: formData.author || undefined,
							description: formData.description || undefined,
						});
					}
				} else {
					// 创建新小说
					const newNovelData: CreateNovelData = {
						title: formData.title,
						author: formData.author || undefined,
						description: formData.description || undefined,
					};

					const newNovel = await createNovel(newNovelData);

					// 如果有封面且成功创建了小说，上传封面
					if (file && newNovel) {
						const coverUrl = await uploadCover(file, newNovel.id);
						if (coverUrl) {
							await updateNovel(newNovel.id, { cover_image_url: coverUrl });
						}
					}
				}

				setIsModalOpen(false);
			} catch (error) {
				console.error(currentNovel ? "更新小说失败:" : "创建小说失败:", error);
				alert(currentNovel ? "更新小说失败" : "创建小说失败");
			} finally {
				setFormSubmitting(false);
			}
		};

		return (
			<form onSubmit={handleSubmit} className="mt-5 space-y-4">
				{/* 封面上传区域 */}
				<div className="flex flex-col items-center space-y-2">
					<div className="w-32 h-44 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden relative">
						{coverPreview ? (
							<img
								src={coverPreview}
								alt="小说封面"
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).onerror = null;
									(e.target as HTMLImageElement).src =
										"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJvb2siPjxwYXRoIGQ9Ik00IDMwaDQiLz48cGF0aCBkPSJNNC4wMyAxOS4wM0E5IDkgMCAxIDEgMTUuMDMgOC4wMyIvPjxwYXRoIGQ9Ik0xMiA4YTQ0IDI1cyAwIDgtMTAgOGgxMGMtNC4zIDAtOC0zLTgtOFoiLz48cGF0aCBkPSJNMyAzYTEgMSAwIDAgMSAxLTFoMTYhMTBBMSAxIDAgMCAxIDMgMyIvPjwvc3ZnPg==";
								}}
							/>
						) : (
							<Image className="h-10 w-10 text-gray-500 dark:text-gray-300" />
						)}
						<div
							className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
							onClick={() => fileInputRef.current?.click()}
						>
							<Upload className="h-8 w-8 text-white" />
						</div>
					</div>
					<input
						type="file"
						ref={fileInputRef}
						accept="image/*"
						className="hidden"
						onChange={handleCoverChange}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					>
						上传封面
					</button>
					{uploadProgress > 0 && uploadProgress < 100 && (
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
							<div
								className="bg-blue-600 h-2.5 rounded-full"
								style={{ width: `${uploadProgress}%` }}
							></div>
						</div>
					)}
				</div>

				<Input
					label="小说标题"
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					placeholder="输入小说标题"
					required
				/>
				<Input
					label="作者"
					name="author"
					value={formData.author}
					onChange={handleInputChange}
					placeholder="输入作者姓名"
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						简介
					</label>
					<textarea
						name="description"
						rows={4}
						value={formData.description}
						onChange={handleInputChange}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入小说简介"
					></textarea>
				</div>

				<div className="flex justify-end space-x-3 pt-5">
					<Button
						type="button"
						variant="outline"
						onClick={() => setIsModalOpen(false)}
						leftIcon={<X size={16} />}
						disabled={formSubmitting}
					>
						取消
					</Button>
					<Button
						type="submit"
						leftIcon={<Check size={16} />}
						disabled={formSubmitting}
					>
						{formSubmitting
							? "提交中..."
							: currentNovel
							? "更新小说"
							: "创建小说"}
					</Button>
				</div>
			</form>
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

				{loading && novelList.length === 0 ? (
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
											colSpan={4}
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
												{novel.created_at instanceof Date
													? novel.created_at.toLocaleDateString()
													: new Date(novel.created_at).toLocaleDateString()}
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
