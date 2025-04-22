import { useState, useEffect, useCallback } from "react";
import { useTimelines, Timeline, TimelineNode, TimelineEdge } from "@/hooks";
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	Panel,
	NodeTypes,
	Connection,
	Node,
	Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
	Search,
	Plus,
	Edit,
	Trash2,
	X,
	Save,
	ArrowLeft,
	GitBranch as TimelineIcon,
} from "lucide-react";

// 自定义节点组件
const EventNode = ({
	data,
}: {
	data: { label: string; date?: string; description?: string };
}) => {
	return (
		<div className="bg-white border-2 border-gray-300 rounded-md p-3 shadow-md w-[200px] dark:bg-gray-800 dark:border-gray-600">
			<div className="font-bold text-sm mb-1 text-gray-900 dark:text-white">
				{data.label}
			</div>
			{data.date && (
				<div className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full inline-block mb-1">
					{data.date}
				</div>
			)}
			{data.description && (
				<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
					{data.description}
				</div>
			)}
		</div>
	);
};

// 节点类型映射
const nodeTypes: NodeTypes = {
	event: EventNode,
};

// 类型定义
interface SelectedNovel {
	id: number;
	title: string;
}

export default function Timelines() {
	const {
		timelines,
		loading,
		fetchTimelinesByNovelId,
		createTimeline,
		updateTimeline,
		deleteTimeline,
	} = useTimelines();

	const [selectedNovel, setSelectedNovel] = useState<SelectedNovel | null>(
		null
	);
	const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(
		null
	);
	const [novels, setNovels] = useState<Array<{ id: number; title: string }>>(
		[]
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [timelineTitle, setTimelineTitle] = useState("");
	const [timelineDescription, setTimelineDescription] = useState("");

	// 时间线节点和边
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
			const { data } = await fetch("/api/novels").then((res) => res.json());
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
			fetchTimelinesByNovelId(selectedNovel.id);
		}
	}, [selectedNovel, fetchTimelinesByNovelId]);

	const filteredTimelines = timelines.filter((timeline) =>
		timeline.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// 选择时间线
	const handleSelectTimeline = (timeline: Timeline) => {
		setSelectedTimeline(timeline);
		setTimelineTitle(timeline.title);
		setTimelineDescription(timeline.description);
		setNodes(timeline.nodes as Node[]);
		setEdges(timeline.edges as Edge[]);
		setIsEditing(false);
	};

	// 创建新时间线
	const handleCreateTimeline = () => {
		if (!selectedNovel) {
			alert("请先选择一本小说");
			return;
		}

		// 创建新时间线
		const newTimeline: Timeline = {
			id: 0, // 临时ID
			novel_id: selectedNovel.id,
			title: "新时间线",
			description: "在这里添加时间线描述",
			nodes: [
				{
					id: "1",
					type: "event",
					position: { x: 100, y: 100 },
					data: {
						label: "新事件",
						date: "日期",
						description: "事件描述",
					},
				},
			],
			edges: [],
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		setSelectedTimeline(newTimeline);
		setTimelineTitle(newTimeline.title);
		setTimelineDescription(newTimeline.description);
		setNodes(newTimeline.nodes as Node[]);
		setEdges(newTimeline.edges as Edge[]);
		setIsEditing(true);
	};

	// 编辑时间线
	const handleEditTimeline = () => {
		if (!selectedTimeline) return;
		setIsEditing(true);
	};

	// 删除时间线
	const handleDeleteTimeline = async () => {
		if (!selectedTimeline || selectedTimeline.id === 0) return;

		if (window.confirm("确定要删除这个时间线吗？")) {
			try {
				await deleteTimeline(selectedTimeline.id);
				setSelectedTimeline(null);
				setNodes([]);
				setEdges([]);
			} catch (error) {
				console.error("删除时间线失败:", error);
			}
		}
	};

	// 保存时间线
	const handleSaveTimeline = async () => {
		if (!selectedNovel) return;

		try {
			const timelineData = {
				novel_id: selectedNovel.id,
				title: timelineTitle,
				description: timelineDescription,
				nodes: nodes as unknown as TimelineNode[],
				edges: edges as unknown as TimelineEdge[],
			};

			if (!selectedTimeline || selectedTimeline.id === 0) {
				// 创建新时间线
				const newTimeline = await createTimeline(timelineData);
				setSelectedTimeline(newTimeline);
			} else {
				// 更新现有时间线
				await updateTimeline(selectedTimeline.id, timelineData);
			}

			setIsEditing(false);
			if (selectedNovel) {
				fetchTimelinesByNovelId(selectedNovel.id);
			}
		} catch (error) {
			console.error("保存时间线失败:", error);
			alert("保存失败，请重试");
		}
	};

	// 添加新节点
	const handleAddNode = () => {
		const newNodeId = (nodes.length + 1).toString();
		const newNode = {
			id: newNodeId,
			type: "event",
			position: { x: 100, y: 100 + nodes.length * 100 },
			data: {
				label: "新事件",
				date: "日期",
				description: "事件描述",
			},
		};
		setNodes([...nodes, newNode]);
	};

	// 添加连接线
	const onConnect = useCallback(
		(params: Connection) =>
			setEdges((eds) =>
				addEdge({ ...params, animated: true, type: "smoothstep" }, eds)
			),
		[setEdges]
	);

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
						时间线
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						{selectedNovel
							? `管理《${selectedNovel.title}》的时间线`
							: "请选择一本小说来管理其时间线"}
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
									const novel = novels.find(
										(n: SelectedNovel) => n.id === novelId
									);
									if (novel) {
										setSelectedNovel(novel);
									}
								} else {
									setSelectedNovel(null);
								}
							}}
							defaultValue=""
						>
							<option value="">请选择小说</option>
							{novelOptions}
						</select>
					</div>
				</Card>
			) : (
				<div className="flex gap-4">
					{/* 左侧时间线列表 */}
					<Card className="w-1/4">
						<div className="p-4">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-medium text-gray-900 dark:text-white">
									时间线列表
								</h2>
								<Button
									size="sm"
									leftIcon={<Plus size={16} />}
									onClick={handleCreateTimeline}
								>
									新建
								</Button>
							</div>
							<Input
								placeholder="搜索时间线..."
								leftIcon={<Search className="h-5 w-5 text-gray-400" />}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="mb-4"
							/>
							{loading ? (
								<div className="text-center py-4">加载时间线中...</div>
							) : (
								<div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
									{filteredTimelines.length === 0 ? (
										<div className="text-center text-gray-500 dark:text-gray-400 py-8">
											未找到时间线
										</div>
									) : (
										filteredTimelines.map((timeline) => (
											<div
												key={timeline.id}
												className={`p-3 border rounded-md cursor-pointer transition-colors ${
													selectedTimeline?.id === timeline.id
														? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
														: "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
												}`}
												onClick={() => handleSelectTimeline(timeline)}
											>
												<div className="flex items-center justify-between">
													<h3 className="font-medium text-gray-900 dark:text-white">
														{timeline.title}
													</h3>
													<TimelineIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
												</div>
												<p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
													{timeline.description}
												</p>
											</div>
										))
									)}
								</div>
							)}
						</div>
					</Card>

					{/* 右侧时间线编辑区 */}
					<Card className="w-3/4">
						<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
							{isEditing ? (
								<div className="flex-1 space-y-2">
									<Input
										label="时间线标题"
										value={timelineTitle}
										onChange={(e) => setTimelineTitle(e.target.value)}
										placeholder="输入时间线标题"
									/>
									<textarea
										value={timelineDescription}
										onChange={(e) => setTimelineDescription(e.target.value)}
										className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
										placeholder="输入时间线描述"
										rows={2}
									></textarea>
								</div>
							) : (
								<div>
									<h2 className="text-lg font-medium text-gray-900 dark:text-white">
										{selectedTimeline?.title || "请选择或创建一个时间线"}
									</h2>
									{selectedTimeline && (
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{selectedTimeline.description}
										</p>
									)}
								</div>
							)}
							<div className="flex space-x-2">
								{selectedTimeline && !isEditing && (
									<>
										<Button
											size="sm"
											variant="outline"
											leftIcon={<Edit size={16} />}
											onClick={handleEditTimeline}
										>
											编辑
										</Button>
										<Button
											size="sm"
											variant="outline"
											leftIcon={<Trash2 size={16} />}
											onClick={handleDeleteTimeline}
											className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
										>
											删除
										</Button>
									</>
								)}
								{isEditing && (
									<>
										<Button
											size="sm"
											variant="outline"
											leftIcon={<X size={16} />}
											onClick={() => {
												setIsEditing(false);
												if (selectedTimeline) {
													// 重置为原始状态
													setTimelineTitle(selectedTimeline.title);
													setTimelineDescription(selectedTimeline.description);
													setNodes(selectedTimeline.nodes as Node[]);
													setEdges(selectedTimeline.edges as Edge[]);
												}
											}}
										>
											取消
										</Button>
										<Button
											size="sm"
											leftIcon={<Save size={16} />}
											onClick={handleSaveTimeline}
										>
											保存
										</Button>
									</>
								)}
							</div>
						</div>

						<div style={{ height: "calc(100vh - 350px)" }}>
							{selectedTimeline ? (
								<ReactFlow
									nodes={nodes}
									edges={edges}
									onNodesChange={onNodesChange}
									onEdgesChange={onEdgesChange}
									onConnect={onConnect}
									nodeTypes={nodeTypes}
									fitView
								>
									<Controls />
									<MiniMap />
									<Background />
									{isEditing && (
										<Panel position="top-right">
											<Button
												size="sm"
												leftIcon={<Plus size={16} />}
												onClick={handleAddNode}
											>
												添加节点
											</Button>
										</Panel>
									)}
								</ReactFlow>
							) : (
								<div className="h-full flex items-center justify-center">
									<div className="text-center text-gray-500 dark:text-gray-400">
										<TimelineIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
										<p className="text-lg">请选择或创建一个时间线</p>
									</div>
								</div>
							)}
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
