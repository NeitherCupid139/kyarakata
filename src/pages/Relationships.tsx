import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search, Plus, Edit, Trash2, X, Check, Link2 } from "lucide-react";

interface CharacterData {
	id: number;
	name: string;
}

interface RelationshipData {
	id: number;
	character1_id: number;
	character2_id: number;
	relationship_type: string;
	description: string;
	created_at: string;
	character1_name?: string;
	character2_name?: string;
}

function Relationships() {
	const [relationships, setRelationships] = useState<RelationshipData[]>([]);
	const [characters, setCharacters] = useState<CharacterData[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentRelationship, setCurrentRelationship] =
		useState<RelationshipData | null>(null);

	const fetchCharacters = async () => {
		try {
			const { data, error } = await supabase
				.from("characters")
				.select("id, name");

			if (error) throw error;
			setCharacters(data || []);
		} catch (error) {
			console.error("获取角色数据失败:", error);
			// 演示数据
			setCharacters([
				{ id: 1, name: "赵云" },
				{ id: 2, name: "诸葛亮" },
				{ id: 3, name: "貂蝉" },
				{ id: 4, name: "曹操" },
				{ id: 5, name: "刘备" },
			]);
		}
	};

	const fetchRelationships = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("character_relationships")
				.select(
					`
          id,
          character1_id,
          character2_id,
          relationship_type,
          description,
          created_at
        `
				)
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			// 获取角色名称
			if (data) {
				const relationshipsWithNames = data.map((relationship) => {
					const character1 = characters.find(
						(c) => c.id === relationship.character1_id
					);
					const character2 = characters.find(
						(c) => c.id === relationship.character2_id
					);

					return {
						...relationship,
						character1_name: character1?.name || "未知角色",
						character2_name: character2?.name || "未知角色",
					};
				});

				setRelationships(relationshipsWithNames);
			}
		} catch (error) {
			console.error("获取角色关系数据失败:", error);

			// 演示用示例数据
			setRelationships([
				{
					id: 1,
					character1_id: 1,
					character2_id: 2,
					relationship_type: "同盟",
					description: "赵云与诸葛亮为蜀汉同僚，关系融洽",
					created_at: "2023-01-01T00:00:00Z",
					character1_name: "赵云",
					character2_name: "诸葛亮",
				},
				{
					id: 2,
					character1_id: 3,
					character2_id: 4,
					relationship_type: "敌对",
					description: "貂蝉与曹操表面顺从，暗中参与吕布与董卓的反曹计划",
					created_at: "2023-02-15T00:00:00Z",
					character1_name: "貂蝉",
					character2_name: "曹操",
				},
				{
					id: 3,
					character1_id: 2,
					character2_id: 5,
					relationship_type: "君臣",
					description: "诸葛亮对刘备忠心耿耿，鞠躬尽瘁死而后已",
					created_at: "2023-03-20T00:00:00Z",
					character1_name: "诸葛亮",
					character2_name: "刘备",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCharacters();
	}, []);

	useEffect(() => {
		if (characters.length > 0) {
			fetchRelationships();
		}
	}, [characters]);

	const filteredRelationships = relationships.filter(
		(relationship) =>
			(relationship.character1_name?.toLowerCase() || "").includes(
				searchTerm.toLowerCase()
			) ||
			(relationship.character2_name?.toLowerCase() || "").includes(
				searchTerm.toLowerCase()
			) ||
			relationship.relationship_type
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			relationship.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openEditModal = (relationship: RelationshipData) => {
		setCurrentRelationship(relationship);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		setCurrentRelationship(null);
		setIsModalOpen(true);
	};

	const handleDeleteRelationship = async (id: number) => {
		if (window.confirm("确定要删除这个角色关系吗？")) {
			try {
				// 真实应用中应该从Supabase删除关系
				// const { error } = await supabase.from('character_relationships').delete().eq('id', id);

				// 演示目的，仅从状态中过滤掉该关系
				setRelationships(
					relationships.filter((relationship) => relationship.id !== id)
				);
			} catch (error) {
				console.error("删除角色关系失败:", error);
			}
		}
	};

	// 关系类型选项
	const relationshipTypes = [
		"朋友",
		"敌人",
		"同盟",
		"君臣",
		"师徒",
		"亲戚",
		"恋人",
		"夫妻",
		"兄弟",
		"姐妹",
		"其他",
	];

	// 关系表单组件
	const RelationshipForm = () => {
		return (
			<div className="mt-5 space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						角色1
					</label>
					<select
						defaultValue={currentRelationship?.character1_id || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">选择角色</option>
						{characters.map((character) => (
							<option key={character.id} value={character.id}>
								{character.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						角色2
					</label>
					<select
						defaultValue={currentRelationship?.character2_id || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">选择角色</option>
						{characters.map((character) => (
							<option key={character.id} value={character.id}>
								{character.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						关系类型
					</label>
					<select
						defaultValue={currentRelationship?.relationship_type || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">选择关系类型</option>
						{relationshipTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						关系描述
					</label>
					<textarea
						rows={4}
						defaultValue={currentRelationship?.description || ""}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入角色之间关系的详细描述"
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
					<Button
						leftIcon={<Check size={16} />}
						onClick={() => {
							// 真实应用中，应该保存关系到Supabase
							setIsModalOpen(false);
							fetchRelationships();
						}}
					>
						{currentRelationship ? "更新关系" : "创建关系"}
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
						角色关系
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						管理角色之间的关系和联系
					</p>
				</div>
				<Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
					添加关系
				</Button>
			</div>

			<Card>
				<div className="flex justify-between items-center mb-4">
					<div className="w-full max-w-xs">
						<Input
							placeholder="搜索角色关系..."
							leftIcon={<Search className="h-5 w-5 text-gray-400" />}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-4">加载角色关系中...</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										角色关系
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										关系类型
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
								{filteredRelationships.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
										>
											未找到角色关系
										</td>
									</tr>
								) : (
									filteredRelationships.map((relationship) => (
										<tr key={relationship.id}>
											<td className="px-6 py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
														<Link2 className="h-6 w-6 text-gray-500 dark:text-gray-300" />
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900 dark:text-white">
															{relationship.character1_name} 与{" "}
															{relationship.character2_name}
														</div>
														<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
															{relationship.description}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
														relationship.relationship_type === "同盟" ||
														relationship.relationship_type === "朋友"
															? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
															: relationship.relationship_type === "敌对" ||
															  relationship.relationship_type === "敌人"
															? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
															: relationship.relationship_type === "君臣" ||
															  relationship.relationship_type === "师徒"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
															: relationship.relationship_type === "亲戚" ||
															  relationship.relationship_type === "夫妻" ||
															  relationship.relationship_type === "恋人"
															? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
															: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
													}`}
												>
													{relationship.relationship_type}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{new Date(relationship.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
												<button
													className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
													onClick={() => openEditModal(relationship)}
												>
													<Edit className="h-5 w-5" />
												</button>
												<button
													className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
													onClick={() =>
														handleDeleteRelationship(relationship.id)
													}
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

			{/* 关系表单模态框 */}
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
									{currentRelationship ? "编辑角色关系" : "创建新角色关系"}
								</h3>
								<RelationshipForm />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Relationships;
