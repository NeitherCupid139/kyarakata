import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { GlobeLock, Bookmark, Save } from "lucide-react";

function WorldSettings() {
	const [worldSettings, setWorldSettings] = useState({
		worldName: "三国乱世",
		era: "东汉末年",
		description:
			"东汉末年，天下大乱，群雄并起，三国鼎立，风云变幻，英雄辈出...",
		rules:
			"1. 所有角色必须符合历史背景\n2. 角色关系需要符合逻辑\n3. 事件发生需要有时间线",
		geography: "主要分为魏、蜀、吴三个主要势力范围，北方多平原，南方多丘陵",
		cultures: "各地文化差异较大，北方尚武，南方重商",
		magicSystem: "无明显超自然力量，主要以谋略和武力为主",
	});

	const handleInputChange = (field: string, value: string) => {
		setWorldSettings((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		// 在实际应用中，这里应该将设置保存到数据库
		console.log("保存世界设定:", worldSettings);
		alert("世界设定已保存");
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
				<Button leftIcon={<Save size={16} />} onClick={handleSave}>
					保存设定
				</Button>
			</div>

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
							value={worldSettings.worldName}
							onChange={(e) => handleInputChange("worldName", e.target.value)}
						/>
						<Input
							label="时代背景"
							value={worldSettings.era}
							onChange={(e) => handleInputChange("era", e.target.value)}
						/>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								世界描述
							</label>
							<textarea
								rows={4}
								value={worldSettings.description}
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
								value={worldSettings.rules}
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
								value={worldSettings.geography}
								onChange={(e) => handleInputChange("geography", e.target.value)}
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
								value={worldSettings.cultures}
								onChange={(e) => handleInputChange("cultures", e.target.value)}
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
								value={worldSettings.magicSystem}
								onChange={(e) =>
									handleInputChange("magicSystem", e.target.value)
								}
								className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								placeholder="描述是否存在超自然力量和规则"
							></textarea>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}

export default WorldSettings;
