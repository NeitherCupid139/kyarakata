import { useState, useEffect, FormEvent } from "react";
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
	CalendarClock,
} from "lucide-react";

interface EventData {
	id: number;
	title: string;
	description: string;
	timestamp: string;
	created_at: string;
	updated_at: string;
}

function Events() {
	const [events, setEvents] = useState<EventData[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// 新增表单状态
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		timestamp: "",
	});

	const fetchEvents = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("events")
				.select("*")
				.order("timestamp", { ascending: false });

			if (error) {
				throw error;
			}

			setEvents(data || []);
		} catch (error) {
			console.error("获取事件数据失败:", error);

			// 演示用示例数据
			setEvents([
				{
					id: 1,
					title: "官渡之战",
					description: "东汉末年，曹操与袁绍争夺中原霸权的重要战役",
					timestamp: "2023-01-15T00:00:00Z",
					created_at: "2023-01-01T00:00:00Z",
					updated_at: "2023-01-01T00:00:00Z",
				},
				{
					id: 2,
					title: "赤壁之战",
					description: "东汉末年，孙权、刘备联军大败曹操的著名战役",
					timestamp: "2023-02-20T00:00:00Z",
					created_at: "2023-02-15T00:00:00Z",
					updated_at: "2023-02-15T00:00:00Z",
				},
				{
					id: 3,
					title: "三顾茅庐",
					description: "刘备三次拜访诸葛亮，请其出山辅助",
					timestamp: "2023-03-25T00:00:00Z",
					created_at: "2023-03-20T00:00:00Z",
					updated_at: "2023-03-20T00:00:00Z",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	// 当打开编辑模态框时初始化表单数据
	useEffect(() => {
		if (currentEvent) {
			setFormData({
				title: currentEvent.title,
				description: currentEvent.description,
				timestamp: new Date(currentEvent.timestamp).toISOString().slice(0, 16),
			});
		} else {
			setFormData({
				title: "",
				description: "",
				timestamp: "",
			});
		}
	}, [currentEvent]);

	const filteredEvents = events.filter(
		(event) =>
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openEditModal = (event: EventData) => {
		setCurrentEvent(event);
		setIsModalOpen(true);
	};

	const openCreateModal = () => {
		setCurrentEvent(null);
		setIsModalOpen(true);
	};

	const handleDeleteEvent = async (id: number) => {
		if (window.confirm("确定要删除这个事件吗？")) {
			try {
				const { error } = await supabase.from("events").delete().eq("id", id);

				if (error) throw error;

				// 从状态中移除已删除的事件
				setEvents(events.filter((event) => event.id !== id));
			} catch (error) {
				console.error("删除事件失败:", error);
				alert("删除事件失败，请重试");
			}
		}
	};

	// 处理表单提交
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!formData.title || !formData.timestamp) {
			alert("请填写事件标题和时间");
			return;
		}

		try {
			setSubmitting(true);

			if (currentEvent) {
				// 更新现有事件
				const { error } = await supabase
					.from("events")
					.update({
						title: formData.title,
						description: formData.description,
						timestamp: formData.timestamp,
						updated_at: new Date().toISOString(),
					})
					.eq("id", currentEvent.id);

				if (error) throw error;
			} else {
				// 创建新事件
				const { error } = await supabase.from("events").insert({
					title: formData.title,
					description: formData.description,
					timestamp: formData.timestamp,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				});

				if (error) throw error;
			}

			// 成功后关闭模态框并刷新事件列表
			setIsModalOpen(false);
			fetchEvents();
		} catch (error) {
			console.error("保存事件失败:", error);
			alert("保存事件失败，请重试");
		} finally {
			setSubmitting(false);
		}
	};

	// 更新表单字段处理函数
	const handleInputChange = (field: string, value: string) => {
		setFormData({
			...formData,
			[field]: value,
		});
	};

	// 事件表单组件
	const EventForm = () => {
		return (
			<form onSubmit={handleSubmit} className="mt-5 space-y-4">
				<Input
					label="事件标题"
					value={formData.title}
					onChange={(e) => handleInputChange("title", e.target.value)}
					placeholder="输入事件标题"
					required
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						事件描述
					</label>
					<textarea
						rows={4}
						value={formData.description}
						onChange={(e) => handleInputChange("description", e.target.value)}
						className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="输入事件描述"
					></textarea>
				</div>
				<Input
					label="事件发生时间"
					type="datetime-local"
					value={formData.timestamp}
					onChange={(e) => handleInputChange("timestamp", e.target.value)}
					placeholder="选择事件发生时间"
					required
				/>

				<div className="flex justify-end space-x-3 pt-5">
					<Button
						variant="outline"
						onClick={() => setIsModalOpen(false)}
						leftIcon={<X size={16} />}
						type="button"
					>
						取消
					</Button>
					<Button
						leftIcon={<Check size={16} />}
						type="submit"
						disabled={submitting}
					>
						{submitting ? "提交中..." : currentEvent ? "更新事件" : "创建事件"}
					</Button>
				</div>
			</form>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						事件管理
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						管理世界观中的重要事件
					</p>
				</div>
				<Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
					添加事件
				</Button>
			</div>

			<Card>
				<div className="flex justify-between items-center mb-4">
					<div className="w-full max-w-xs">
						<Input
							placeholder="搜索事件..."
							leftIcon={<Search className="h-5 w-5 text-gray-400" />}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-4">加载事件中...</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										事件
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
									>
										发生时间
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
								{filteredEvents.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
										>
											未找到事件
										</td>
									</tr>
								) : (
									filteredEvents.map((event) => (
										<tr key={event.id}>
											<td className="px-6 py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
														<CalendarClock className="h-6 w-6 text-gray-500 dark:text-gray-300" />
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900 dark:text-white">
															{event.title}
														</div>
														<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
															{event.description}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{new Date(event.timestamp).toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{new Date(event.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
												<button
													className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
													onClick={() => openEditModal(event)}
												>
													<Edit className="h-5 w-5" />
												</button>
												<button
													className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
													onClick={() => handleDeleteEvent(event.id)}
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

			{/* 事件表单模态框 */}
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
									{currentEvent ? "编辑事件" : "创建新事件"}
								</h3>
								<EventForm />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Events;
