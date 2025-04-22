import { useState, useEffect } from "react";
import { useWorldSettings, WorldSetting } from "@/hooks";
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
	Book,
	ArrowLeft,
} from "lucide-react";

// 类型定义
interface SelectedNovel {
	id: number;
	title: string;
}

interface WorldSettingForm {
	id: number;
	novel_id: number;
	title: string;
	description: string;
	rules: string;
	background: string;
	history: string;
	geography: string;
	culture: string;
	magic_system: string;
	technology: string;
}

export default function WorldSettings() {
	const {
		worldSettings,
		loading,
		fetchWorldSettingsByNovelId,
		createWorldSetting,
		updateWorldSetting,
		deleteWorldSetting,
	} = useWorldSettings();

	const [selectedNovel, setSelectedNovel] = useState<SelectedNovel | null>(
		null
	);
	const [novels, setNovels] = useState<SelectedNovel[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentSetting, setCurrentSetting] = useState<WorldSettingForm | null>(
		null
	);

	// 从URL获取novel_id
	const getNovelIdFromUrl = () => {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get("novel_id")
			? parseInt(urlParams.get("novel_id")!)
			: null;
	};

	// 获取小说列表
	const fetchNovels = async () => {
		try {
			const { data, error } = await fetch("/api/novels").then((res) =>
				res.json()
			);

			if (error) throw error;
			setNovels(data || []);

			// 如果URL中有novel_id，选中它
			const novelIdFromUrl = getNovelIdFromUrl();
			if (novelIdFromUrl && data) {
				const novelFromUrl = data.find(
					(novel: SelectedNovel) => novel.id === novelIdFromUrl
				);
				if (novelFromUrl) {
					setSelectedNovel(novelFromUrl);
				}
			}
		} catch (error) {
			console.error("获取小说列表失败:", error);
			// 演示数据
			const demoNovels = [
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

	useEffect(() => {
		fetchNovels();
	}, []);

	useEffect(() => {
		if (selectedNovel) {
			fetchWorldSettingsByNovelId(selectedNovel.id);
		}
	}, [selectedNovel, fetchWorldSettingsByNovelId]);

	const filteredSettings = worldSettings.filter(
		(setting) =>
			setting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			setting.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openEditModal = (setting: WorldSetting) => {
		setCurrentSetting(setting as WorldSettingForm);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		if (!selectedNovel) {
			alert("请先选择一本小说");
			return;
		}

		setCurrentSetting({
			id: 0,
			novel_id: selectedNovel.id,
			title: "",
			description: "",
			rules: "",
			background: "",
			history: "",
			geography: "",
			culture: "",
			magic_system: "",
			technology: "",
		});
		setIsModalOpen(true);
	};

	const handleDeleteSetting = async (id: number) => {
		if (window.confirm("确定要删除这个世界观设定吗？")) {
			try {
				await deleteWorldSetting(id);
			} catch (error) {
				console.error("删除世界观设定失败:", error);
			}
		}
	};

	const handleSaveSetting = async () => {
		if (!currentSetting) return;

		try {
			const formElement = document.getElementById(
				"worldSettingForm"
			) as HTMLFormElement;
			const formData = new FormData(formElement);

			const settingData = {
				novel_id: currentSetting.novel_id,
				title: formData.get("title") as string,
				description: formData.get("description") as string,
				rules: formData.get("rules") as string,
				background: formData.get("background") as string,
				history: formData.get("history") as string,
				geography: formData.get("geography") as string,
				culture: formData.get("culture") as string,
				magic_system: formData.get("magic_system") as string,
				technology: formData.get("technology") as string,
			};

			if (currentSetting.id === 0) {
				// 创建新设定
				await createWorldSetting(settingData);
			} else {
				// 更新现有设定
				await updateWorldSetting(currentSetting.id, settingData);
			}

			setIsModalOpen(false);
			if (selectedNovel) {
				fetchWorldSettingsByNovelId(selectedNovel.id);
			}
		} catch (error) {
			console.error("保存世界观设定失败:", error);
			alert("保存失败，请重试");
		}
	};

	// 世界观设定表单组件
	const SettingForm = () => {
		return (
			<form id="worldSettingForm" className="mt-5 space-y-4">
				<Input
					label="标题"
					name="title"
					defaultValue={currentSetting?.title || ""}
					placeholder="输入世界观标题"
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						简介
					</label>
					<textarea
						name="description"
						rows={2}
						defaultValue={currentSetting?.description || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入简介"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						世界规则
					</label>
					<textarea
						name="rules"
						rows={3}
						defaultValue={currentSetting?.rules || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入世界规则设定"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						世界背景
					</label>
					<textarea
						name="background"
						rows={3}
						defaultValue={currentSetting?.background || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入世界背景描述"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						世界历史
					</label>
					<textarea
						name="history"
						rows={3}
						defaultValue={currentSetting?.history || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入世界历史"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						地理环境
					</label>
					<textarea
						name="geography"
						rows={3}
						defaultValue={currentSetting?.geography || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入地理环境描述"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						文化特点
					</label>
					<textarea
						name="culture"
						rows={3}
						defaultValue={currentSetting?.culture || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入文化特点"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						魔法体系
					</label>
					<textarea
						name="magic_system"
						rows={3}
						defaultValue={currentSetting?.magic_system || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入魔法体系(如果适用)"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						技术水平
					</label>
					<textarea
						name="technology"
						rows={3}
						defaultValue={currentSetting?.technology || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入技术水平"
					></textarea>
				</div>

				<div className="flex justify-end space-x-3 pt-5">
					<Button
						variant="outline"
						onClick={() => setIsModalOpen(false)}
						leftIcon={<X size={16} />}
					>
						取消
					</Button>
					<Button leftIcon={<Check size={16} />} onClick={handleSaveSetting}>
						{currentSetting?.id ? "更新设定" : "创建设定"}
					</Button>
				</div>
			</form>
		);
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
						世界观设定
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						{selectedNovel
							? `管理《${selectedNovel.title}》的世界观设定`
							: "请选择一本小说来管理其世界观设定"}
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
						添加设定
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
							value={
								selectedNovel
									? (selectedNovel as unknown as { id: number }).id.toString()
									: ""
							}
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
								placeholder="搜索世界观设定..."
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
								value={selectedNovel.id.toString()}
							>
								{novelOptions}
							</select>
						</div>
					</div>

					{loading ? (
						<div className="text-center py-4">加载世界观设定中...</div>
					) : (
						<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredSettings.length === 0 ? (
								<div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
									未找到世界观设定
								</div>
							) : (
								filteredSettings.map((setting) => (
									<Card key={setting.id} className="overflow-hidden">
										<div className="p-4 flex flex-col h-full">
											<div className="flex items-center justify-between">
												<h3 className="text-lg font-medium text-gray-900 dark:text-white">
													{setting.title}
												</h3>
												<div className="flex space-x-2">
													<button
														className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
														onClick={() => openEditModal(setting)}
													>
														<Edit className="h-5 w-5" />
													</button>
													<button
														className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
														onClick={() => handleDeleteSetting(setting.id)}
													>
														<Trash2 className="h-5 w-5" />
													</button>
												</div>
											</div>
											<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
												{setting.description}
											</p>
											<div className="mt-4 space-y-2 flex-grow">
												{setting.rules && (
													<div>
														<p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
															世界规则
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
															{setting.rules}
														</p>
													</div>
												)}
												{setting.background && (
													<div>
														<p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
															世界背景
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
															{setting.background}
														</p>
													</div>
												)}
											</div>
											<Button
												variant="outline"
												size="sm"
												leftIcon={<Book size={14} />}
												className="mt-4 self-end"
												onClick={() => openEditModal(setting)}
											>
												查看详情
											</Button>
										</div>
									</Card>
								))
							)}
						</div>
					)}
				</Card>
			)}

			{/* 世界观设定表单模态框 */}
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
							className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
								<h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
									{currentSetting?.id ? "编辑世界观设定" : "创建新世界观设定"}
								</h3>
								<SettingForm />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
