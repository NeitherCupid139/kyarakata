import { useState, useEffect, useRef } from "react";
import {
	useCharacters,
	Character,
	CreateCharacterData,
} from "@/hooks/useCharacters";
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
	UserRound,
	Upload,
} from "lucide-react";

function Characters() {
	const {
		loading,
		characters: characterList,
		fetchCharacters,
		createCharacter,
		updateCharacter,
		deleteCharacter,
		uploadAvatar,
		uploadProgress,
	} = useCharacters();

	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
		null
	);
	const [isUploading, setIsUploading] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchCharacters();
	}, []);

	const filteredCharacters = characterList.filter(
		(character) =>
			character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			character.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(character.background || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(character.personality || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
	);

	const openEditModal = (character: Character) => {
		setCurrentCharacter(character);
		setAvatarPreview(character.avatar_url);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		setCurrentCharacter(null);
		setAvatarPreview(null);
		setIsModalOpen(true);
	};

	const handleDeleteCharacter = async (id: number) => {
		if (window.confirm("确定要删除这个角色吗？")) {
			await deleteCharacter(id);
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 本地预览
		const reader = new FileReader();
		reader.onload = (e) => {
			setAvatarPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
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

			// 准备数据
			const name = nameInput.value;
			const gender = genderSelect.value;
			const ageValue = ageInput.value ? parseInt(ageInput.value) : undefined;
			const background = backgroundTextarea.value || undefined;
			const personality = personalityTextarea.value || undefined;

			const file = fileInputRef.current?.files?.[0];

			// 如果有选择文件
			if (file) {
				setIsUploading(true);

				if (currentCharacter) {
					// 更新现有角色
					const uploadedUrl = await uploadAvatar(file, currentCharacter.id);
					if (uploadedUrl) {
						await updateCharacter(currentCharacter.id, {
							name,
							gender,
							age: ageValue,
							background,
							personality,
							avatar_url: uploadedUrl,
						});
					}
				} else {
					// 创建新角色并上传头像
					const newCharacterData: CreateCharacterData = {
						name,
						gender,
						age: ageValue,
						background,
						personality,
					};

					const newCharacter = await createCharacter(newCharacterData);
					if (newCharacter) {
						const uploadedUrl = await uploadAvatar(file, newCharacter.id);
						if (uploadedUrl) {
							await updateCharacter(newCharacter.id, {
								avatar_url: uploadedUrl,
							});
						}
					}
				}

				setIsUploading(false);
			} else {
				// 没有新的头像文件
				if (currentCharacter) {
					// 更新现有角色，保留原头像
					await updateCharacter(currentCharacter.id, {
						name,
						gender,
						age: ageValue,
						background,
						personality,
					});
				} else {
					// 创建新角色，无头像
					await createCharacter({
						name,
						gender,
						age: ageValue,
						background,
						personality,
					});
				}
			}

			setIsModalOpen(false);
		} catch (error) {
			console.error("保存角色失败:", error);
			alert("保存角色失败，请重试");
		}
	};

	// 角色表单组件
	const CharacterForm = () => {
		return (
			<div className="mt-5 space-y-4">
				{/* 头像上传区域 */}
				<div className="flex flex-col items-center space-y-2">
					<div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
						{avatarPreview ? (
							<img
								src={avatarPreview}
								alt="角色头像"
								className="w-full h-full object-cover"
							/>
						) : (
							<UserRound className="h-12 w-12 text-gray-500 dark:text-gray-300" />
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
						onChange={handleAvatarChange}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
					>
						上传头像
					</button>
					{isUploading && (
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
							<div
								className="bg-blue-600 h-2.5 rounded-full"
								style={{ width: `${uploadProgress}%` }}
							></div>
						</div>
					)}
				</div>

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
					defaultValue={currentCharacter?.age?.toString() || ""}
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

				{loading && characterList.length === 0 ? (
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
													<div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
														{character.avatar_url ? (
															<img
																src={character.avatar_url}
																alt={character.name}
																className="h-10 w-10 object-cover"
															/>
														) : (
															<UserRound className="h-6 w-6 text-gray-500 dark:text-gray-300" />
														)}
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
												{character.created_at instanceof Date
													? character.created_at.toLocaleDateString()
													: new Date(character.created_at).toLocaleDateString()}
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
