import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search, Plus, Edit, Trash2, X, Check, UserRound } from "lucide-react";

interface CharacterData {
	id: number;
	name: string;
	gender: string;
	age: number;
	background: string;
	personality: string;
	created_at: string;
	updated_at: string;
}

function Characters() {
	const [characters, setCharacters] = useState<CharacterData[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentCharacter, setCurrentCharacter] =
		useState<CharacterData | null>(null);

	const fetchCharacters = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("characters")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			setCharacters(data || []);
		} catch (error) {
			console.error("获取角色数据失败:", error);

			// 演示用示例数据
			setCharacters([
				{
					id: 1,
					name: "赵云",
					gender: "男",
					age: 28,
					background: "蜀国猛将，字子龙，常山人士",
					personality: "忠诚勇敢，冷静沉着",
					created_at: "2023-01-01T00:00:00Z",
					updated_at: "2023-01-01T00:00:00Z",
				},
				{
					id: 2,
					name: "诸葛亮",
					gender: "男",
					age: 27,
					background: "蜀国军师，字孔明，琅琊阳都人",
					personality: "足智多谋，料事如神",
					created_at: "2023-02-15T00:00:00Z",
					updated_at: "2023-02-15T00:00:00Z",
				},
				{
					id: 3,
					name: "貂蝉",
					gender: "女",
					age: 19,
					background: "董卓义女，中国古代四大美女之一",
					personality: "温柔聪慧，心思缜密",
					created_at: "2023-03-20T00:00:00Z",
					updated_at: "2023-03-20T00:00:00Z",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCharacters();
	}, []);

	const filteredCharacters = characters.filter(
		(character) =>
			character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			character.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
			character.background.toLowerCase().includes(searchTerm.toLowerCase()) ||
			character.personality.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openEditModal = (character: CharacterData) => {
		setCurrentCharacter(character);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		setCurrentCharacter(null);
		setIsModalOpen(true);
	};

	const handleDeleteCharacter = async (id: number) => {
		if (window.confirm("确定要删除这个角色吗？")) {
			try {
				// 真实应用中应该从Supabase删除角色
				// const { error } = await supabase.from('characters').delete().eq('id', id);

				// 演示目的，仅从状态中过滤掉该角色
				setCharacters(characters.filter((character) => character.id !== id));
			} catch (error) {
				console.error("删除角色失败:", error);
			}
		}
	};

	const handleSaveCharacter = async () => {
		try {
			// 获取表单数据
			const nameInput = document.querySelector<HTMLInputElement>(
				'input[placeholder="输入角色名称"]'
			);
			const genderSelect = document.querySelector<HTMLSelectElement>("select");
			const ageInput = document.querySelector<HTMLInputElement>(
				'input[placeholder="输入角色年龄"]'
			);
			const backgroundTextarea = document.querySelector<HTMLTextAreaElement>(
				'textarea[placeholder="输入角色背景故事"]'
			);
			const personalityTextarea = document.querySelector<HTMLTextAreaElement>(
				'textarea[placeholder="输入角色性格描述"]'
			);

			if (
				!nameInput ||
				!genderSelect ||
				!ageInput ||
				!backgroundTextarea ||
				!personalityTextarea
			) {
				throw new Error("无法获取表单元素");
			}

			const characterData = {
				name: nameInput.value,
				gender: genderSelect.value,
				age: parseInt(ageInput.value) || 0,
				background: backgroundTextarea.value,
				personality: personalityTextarea.value,
				updated_at: new Date().toISOString(),
			};

			if (currentCharacter) {
				// 更新现有角色
				const { data, error } = await supabase
					.from("characters")
					.update(characterData)
					.eq("id", currentCharacter.id)
					.select();

				if (error) throw error;
				console.log("角色更新成功:", data);
			} else {
				// 创建新角色
				const { data, error } = await supabase
					.from("characters")
					.insert([{ ...characterData, created_at: new Date().toISOString() }])
					.select();

				if (error) throw error;
				console.log("角色创建成功:", data);
			}

			setIsModalOpen(false);
			fetchCharacters(); // 重新获取角色列表
		} catch (error) {
			console.error("保存角色失败:", error);
			alert("保存角色失败，请重试");
		}
	};

	// 角色表单组件
	const CharacterForm = () => {
		return (
			<div className="mt-5 space-y-4">
				<Input
					label="角色名称"
					defaultValue={currentCharacter?.name || ""}
					placeholder="输入角色名称"
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						性别
					</label>
					<select
						defaultValue={currentCharacter?.gender || "男"}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="男">男</option>
						<option value="女">女</option>
						<option value="其他">其他</option>
					</select>
				</div>
				<Input
					label="年龄"
					type="number"
					defaultValue={currentCharacter?.age.toString() || ""}
					placeholder="输入角色年龄"
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						背景故事
					</label>
					<textarea
						rows={4}
						defaultValue={currentCharacter?.background || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入角色背景故事"
					></textarea>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						性格描述
					</label>
					<textarea
						rows={4}
						defaultValue={currentCharacter?.personality || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入角色性格描述"
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
					<Button leftIcon={<Check size={16} />} onClick={handleSaveCharacter}>
						{currentCharacter ? "更新角色" : "创建角色"}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						角色管理
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						管理您的角色和他们的信息
					</p>
				</div>
				<Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
					添加角色
				</Button>
			</div>

			<Card>
				<div className="flex justify-between items-center mb-4">
					<div className="w-full max-w-xs">
						<Input
							placeholder="搜索角色..."
							leftIcon={<Search className="h-5 w-5 text-gray-400" />}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-4">加载角色中...</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										角色
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										性别
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										年龄
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
								{filteredCharacters.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
										>
											未找到角色
										</td>
									</tr>
								) : (
									filteredCharacters.map((character) => (
										<tr key={character.id}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
														<UserRound className="h-6 w-6 text-gray-500 dark:text-gray-300" />
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900 dark:text-white">
															{character.name}
														</div>
														<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
															{character.personality}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{character.gender}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{character.age}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{new Date(character.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
												<button
													className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
													onClick={() => openEditModal(character)}
												>
													<Edit className="h-5 w-5" />
												</button>
												<button
													className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
													onClick={() => handleDeleteCharacter(character.id)}
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

			{/* 角色表单模态框 */}
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
									{currentCharacter ? "编辑角色" : "创建新角色"}
								</h3>
								<CharacterForm />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Characters;
