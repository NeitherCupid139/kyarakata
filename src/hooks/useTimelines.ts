import { useState } from "react";
import { supabase } from "@/lib/supabase";

// 定义节点类型
export interface TimelineNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: {
		label: string;
		event_id?: number;
		date?: string;
		description?: string;
	};
}

// 定义边类型
export interface TimelineEdge {
	id: string;
	source: string;
	target: string;
	type?: string;
	label?: string;
	animated?: boolean;
}

// 定义时间线类型
export interface Timeline {
	id: number;
	novel_id: number;
	title: string;
	description: string;
	nodes: TimelineNode[];
	edges: TimelineEdge[];
	created_at: string;
	updated_at: string;
}

// 创建新时间线的参数
export interface CreateTimelineParams {
	novel_id: number;
	title: string;
	description?: string;
	nodes?: TimelineNode[];
	edges?: TimelineEdge[];
}

// 更新时间线的参数
export interface UpdateTimelineParams {
	title?: string;
	description?: string;
	nodes?: TimelineNode[];
	edges?: TimelineEdge[];
}

interface ErrorWithMessage {
	message: string;
}

export const useTimelines = () => {
	const [timelines, setTimelines] = useState<Timeline[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 获取所有时间线
	const fetchTimelines = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("timelines")
				.select("*")
				.order("title");

			if (error) throw error;
			setTimelines(data || []);
		} catch (err: unknown) {
			console.error("获取时间线失败:", err);
			setError((err as ErrorWithMessage).message || "未知错误");

			// 提供示例数据用于开发
			setTimelines([
				{
					id: 1,
					novel_id: 1,
					title: "三国演义主要事件",
					description: "三国演义的主要历史事件时间线",
					nodes: [
						{
							id: "1",
							type: "event",
							position: { x: 100, y: 100 },
							data: {
								label: "黄巾起义",
								event_id: 1,
								date: "184年",
								description: "张角率领黄巾军起义",
							},
						},
						{
							id: "2",
							type: "event",
							position: { x: 300, y: 100 },
							data: {
								label: "董卓进京",
								event_id: 2,
								date: "189年",
								description: "董卓率军进京，掌控朝政",
							},
						},
						{
							id: "3",
							type: "event",
							position: { x: 500, y: 100 },
							data: {
								label: "官渡之战",
								event_id: 3,
								date: "200年",
								description: "曹操大败袁绍于官渡",
							},
						},
					],
					edges: [
						{
							id: "e1-2",
							source: "1",
							target: "2",
							type: "smoothstep",
							animated: true,
						},
						{
							id: "e2-3",
							source: "2",
							target: "3",
							type: "smoothstep",
							animated: true,
						},
					],
					created_at: "2023-01-01T00:00:00Z",
					updated_at: "2023-01-01T00:00:00Z",
				},
				{
					id: 2,
					novel_id: 2,
					title: "水浒传主要事件",
					description: "水浒传的主要历史事件时间线",
					nodes: [
						{
							id: "1",
							type: "event",
							position: { x: 100, y: 100 },
							data: {
								label: "鲁提辖拳打镇关西",
								event_id: 4,
								date: "宋朝",
								description: "鲁达为民除害，打死镇关西",
							},
						},
						{
							id: "2",
							type: "event",
							position: { x: 300, y: 100 },
							data: {
								label: "林冲风雪山神庙",
								event_id: 5,
								date: "宋朝",
								description: "林冲被发配沧州，途中风雪山神庙",
							},
						},
					],
					edges: [
						{
							id: "e1-2",
							source: "1",
							target: "2",
							type: "smoothstep",
							animated: true,
						},
					],
					created_at: "2023-02-01T00:00:00Z",
					updated_at: "2023-02-01T00:00:00Z",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	// 根据小说ID获取时间线
	const fetchTimelinesByNovelId = async (novelId: number) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("timelines")
				.select("*")
				.eq("novel_id", novelId)
				.order("title");

			if (error) throw error;
			setTimelines(data || []);
		} catch (err: unknown) {
			console.error(`获取小说 ${novelId} 的时间线失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");

			// 提供示例数据
			if (novelId === 1) {
				setTimelines([
					{
						id: 1,
						novel_id: 1,
						title: "三国演义主要事件",
						description: "三国演义的主要历史事件时间线",
						nodes: [
							{
								id: "1",
								type: "event",
								position: { x: 100, y: 100 },
								data: {
									label: "黄巾起义",
									event_id: 1,
									date: "184年",
									description: "张角率领黄巾军起义",
								},
							},
							{
								id: "2",
								type: "event",
								position: { x: 300, y: 100 },
								data: {
									label: "董卓进京",
									event_id: 2,
									date: "189年",
									description: "董卓率军进京，掌控朝政",
								},
							},
							{
								id: "3",
								type: "event",
								position: { x: 500, y: 100 },
								data: {
									label: "官渡之战",
									event_id: 3,
									date: "200年",
									description: "曹操大败袁绍于官渡",
								},
							},
						],
						edges: [
							{
								id: "e1-2",
								source: "1",
								target: "2",
								type: "smoothstep",
								animated: true,
							},
							{
								id: "e2-3",
								source: "2",
								target: "3",
								type: "smoothstep",
								animated: true,
							},
						],
						created_at: "2023-01-01T00:00:00Z",
						updated_at: "2023-01-01T00:00:00Z",
					},
				]);
			} else {
				setTimelines([]);
			}
		} finally {
			setLoading(false);
		}
	};

	// 获取单个时间线
	const fetchTimelineById = async (id: number) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("timelines")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;
			return data as Timeline;
		} catch (err: unknown) {
			console.error(`获取时间线 ${id} 失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 创建时间线
	const createTimeline = async (params: CreateTimelineParams) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("timelines")
				.insert([
					{
						...params,
						nodes: params.nodes || [],
						edges: params.edges || [],
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					},
				])
				.select();

			if (error) throw error;

			setTimelines([...timelines, data[0] as Timeline]);
			return data[0] as Timeline;
		} catch (err: unknown) {
			console.error("创建时间线失败:", err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 更新时间线
	const updateTimeline = async (id: number, params: UpdateTimelineParams) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("timelines")
				.update({ ...params, updated_at: new Date().toISOString() })
				.eq("id", id)
				.select();

			if (error) throw error;

			setTimelines(
				timelines.map((timeline) =>
					timeline.id === id
						? { ...timeline, ...params, updated_at: new Date().toISOString() }
						: timeline
				)
			);

			return data[0] as Timeline;
		} catch (err: unknown) {
			console.error(`更新时间线 ${id} 失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 删除时间线
	const deleteTimeline = async (id: number) => {
		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase.from("timelines").delete().eq("id", id);

			if (error) throw error;

			setTimelines(timelines.filter((timeline) => timeline.id !== id));
		} catch (err: unknown) {
			console.error(`删除时间线 ${id} 失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		timelines,
		loading,
		error,
		fetchTimelines,
		fetchTimelinesByNovelId,
		fetchTimelineById,
		createTimeline,
		updateTimeline,
		deleteTimeline,
	};
};
