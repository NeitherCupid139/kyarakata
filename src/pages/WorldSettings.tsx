import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { GlobeLock, Bookmark, Save, Plus, Trash2 } from "lucide-react";

interface WorldSetting {
	id?: number;
	world_name: string;
	era: string;
	description: string;
	rules: string;
	geography: string;
	cultures: string;
	magic_system: string;
	created_at?: string;
	updated_at?: string;
}

function WorldSettings() {
	const [worlds, setWorlds] = useState<WorldSetting[]>([]);
	const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [currentSetting, setCurrentSetting] = useState<WorldSetting>({
		world_name: "",
		era: "",
		description: "",
		rules: "",
		geography: "",
		cultures: "",
		magic_system: "",
	});

	const fetchWorlds = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("world_settings")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;

			setWorlds(data || []);

			// 如果有世界设定且没有选择任何设定，则选择第一个
			if (data && data.length > 0 && !selectedWorldId) {
				setSelectedWorldId(data[0].id);
				setCurrentSetting({
					world_name: data[0].world_name,
					era: data[0].era,
					description: data[0].description,
					rules: data[0].rules,
					geography: data[0].geography,
					cultures: data[0].cultures,
					magic_system: data[0].magic_system,
				});
			}
		} catch (error) {
			console.error("获取世界设定失败:", error);

			// 演示用示例数据
			const demoWorld = {
				id: 1,
				world_name: "三国乱世",
				era: "东汉末年",
				description:
					"东汉末年，天下大乱，群雄并起，三国鼎立，风云变幻，英雄辈出...",
				rules:
					"1. 所有角色必须符合历史背景\n2. 角色关系需要符合逻辑\n3. 事件发生需要有时间线",
				geography: "主要分为魏、蜀、吴三个主要势力范围，北方多平原，南方多丘陵",
				cultures: "各地文化差异较大，北方尚武，南方重商",
				magic_system: "无明显超自然力量，主要以谋略和武力为主",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			setWorlds([demoWorld]);
			setSelectedWorldId(1);
			setCurrentSetting({
				world_name: demoWorld.world_name,
				era: demoWorld.era,
				description: demoWorld.description,
				rules: demoWorld.rules,
				geography: demoWorld.geography,
				cultures: demoWorld.cultures,
				magic_system: demoWorld.magic_system,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorlds();
	}, []);

	const handleInputChange = (field: string, value: string) => {
		setCurrentSetting((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		if (!currentSetting.world_name) {
			alert("请输入世界名称");
			return;
		}

		try {
			setSaving(true);

			if (selectedWorldId) {
				// 更新现有世界设定
				const { error } = await supabase
					.from("world_settings")
					.update({
						world_name: currentSetting.world_name,
						era: currentSetting.era,
						description: currentSetting.description,
						rules: currentSetting.rules,
						geography: currentSetting.geography,
						cultures: currentSetting.cultures,
						magic_system: currentSetting.magic_system,
						updated_at: new Date().toISOString(),
					})
					.eq("id", selectedWorldId);

				if (error) throw error;

				alert("世界设定已更新");
			} else {
				// 创建新世界设定
				const { data, error } = await supabase
					.from("world_settings")
					.insert({
						world_name: currentSetting.world_name,
						era: currentSetting.era,
						description: currentSetting.description,
						rules: currentSetting.rules,
						geography: currentSetting.geography,
						cultures: currentSetting.cultures,
						magic_system: currentSetting.magic_system,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					})
					.select();

				if (error) throw error;

				if (data && data[0]) {
					setSelectedWorldId(data[0].id);
				}

				alert("新世界设定已创建");
			}

			// 刷新世界设定列表
			fetchWorlds();
		} catch (error) {
			console.error("保存世界设定失败:", error);
			alert("保存失败，请重试");
		} finally {
			setSaving(false);
		}
	};

	const handleSelectWorld = (id: number) => {
		const selected = worlds.find((world) => world.id === id);
		if (selected) {
			setSelectedWorldId(id);
			setCurrentSetting({
				world_name: selected.world_name,
				era: selected.era,
				description: selected.description,
				rules: selected.rules,
				geography: selected.geography,
				cultures: selected.cultures,
				magic_system: selected.magic_system,
			});
		}
	};

	const handleCreateNew = () => {
		setSelectedWorldId(null);
		setCurrentSetting({
			world_name: "",
			era: "",
			description: "",
			rules: "",
			geography: "",
			cultures: "",
			magic_system: "",
		});
	};

	const handleDeleteWorld = async (id: number) => {
		if (!window.confirm("确定要删除这个世界设定吗？")) {
			return;
		}

		try {
			const { error } = await supabase
				.from("world_settings")
				.delete()
				.eq("id", id);

			if (error) throw error;

			// 如果删除的是当前选中的世界，重置表单
			if (id === selectedWorldId) {
				handleCreateNew();
			}

			// 刷新世界设定列表
			fetchWorlds();
		} catch (error) {
			console.error("删除世界设定失败:", error);
			alert("删除失败，请重试");
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						世界设定
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						定义您的世界观和基本规则
					</p>
				</div>
				<div className="flex space-x-2">
					<Button
						variant="outline"
						leftIcon={<Plus size={16} />}
						onClick={handleCreateNew}
					>
						新建设定
					</Button>
					<Button
						leftIcon={<Save size={16} />}
						onClick={handleSave}
						disabled={saving}
					>
						{saving ? "保存中..." : "保存设定"}
					</Button>
				</div>
			</div>

			{/* 世界设定选择器 */}
			{worlds.length > 0 && (
				<Card className="p-4">
					<h2 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
						选择世界设定
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
						{worlds.map((world) => (
							<div
								key={world.id}
								className={`p-3 rounded-lg border cursor-pointer relative ${
									selectedWorldId === world.id
										? "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700"
										: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
								}`}
								onClick={() => world.id && handleSelectWorld(world.id)}
							>
								<h3 className="font-medium text-gray-900 dark:text-white">
									{world.world_name}
								</h3>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									{world.era}
								</p>
								{selectedWorldId === world.id && world.id && (
									<button
										className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteWorld(world.id as number);
										}}
									>
										<Trash2 size={14} />
									</button>
								)}
							</div>
						))}
					</div>
				</Card>
			)}

			{loading ? (
				<div className="text-center py-10">加载世界设定中...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card className="p-4">
						<div className="flex items-center mb-4">
							<div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<GlobeLock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
							</div>
							<h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
								基本信息
							</h2>
						</div>

						<div className="space-y-4">
							<Input
								label="世界名称"
								value={currentSetting.world_name}
								onChange={(e) =>
									handleInputChange("world_name", e.target.value)
								}
								required
							/>
							<Input
								label="时代背景"
								value={currentSetting.era}
								onChange={(e) => handleInputChange("era", e.target.value)}
							/>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									世界描述
								</label>
								<textarea
									rows={4}
									value={currentSetting.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									placeholder="描述您的世界背景"
								></textarea>
							</div>
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center mb-4">
							<div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<Bookmark className="h-6 w-6 text-green-600 dark:text-green-300" />
							</div>
							<h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
								规则与设定
							</h2>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									世界规则
								</label>
								<textarea
									rows={3}
									value={currentSetting.rules}
									onChange={(e) => handleInputChange("rules", e.target.value)}
									className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									placeholder="定义角色和事件的基本规则"
								></textarea>
							</div>
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center mb-4">
							<div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
								<GlobeLock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
							</div>
							<h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
								地理与文化
							</h2>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									地理环境
								</label>
								<textarea
									rows={3}
									value={currentSetting.geography}
									onChange={(e) =>
										handleInputChange("geography", e.target.value)
									}
									className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									placeholder="描述世界的地理环境"
								></textarea>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									文化风俗
								</label>
								<textarea
									rows={3}
									value={currentSetting.cultures}
									onChange={(e) =>
										handleInputChange("cultures", e.target.value)
									}
									className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									placeholder="描述不同地区的文化特点"
								></textarea>
							</div>
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center mb-4">
							<div className="flex-shrink-0 h-10 w-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
								<Bookmark className="h-6 w-6 text-red-600 dark:text-red-300" />
							</div>
							<h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
								特殊设定
							</h2>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									超自然/魔法系统
								</label>
								<textarea
									rows={3}
									value={currentSetting.magic_system}
									onChange={(e) =>
										handleInputChange("magic_system", e.target.value)
									}
									className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									placeholder="描述是否存在超自然力量和规则"
								></textarea>
							</div>
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}

export default WorldSettings;
