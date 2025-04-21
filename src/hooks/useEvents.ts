import { useState } from "react";
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface Event {
	id: number;
	title: string;
	description: string | null;
	timestamp: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface CreateEventData {
	title: string;
	description?: string;
	timestamp?: Date;
}

export interface UpdateEventData {
	title?: string;
	description?: string | null;
	timestamp?: Date | null;
}

export function useEvents() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [eventList, setEventList] = useState<Event[]>([]);

	// 获取所有事件
	const fetchEvents = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await db.select().from(events).orderBy(events.timestamp);

			// 处理可能为null的字段，确保符合Event接口要求
			const typedResult: Event[] = result.map((event) => ({
				id: event.id,
				title: event.title || "",
				description: event.description,
				timestamp: event.timestamp,
				created_at: event.created_at || new Date(),
				updated_at: event.updated_at || new Date(),
			}));

			setEventList(typedResult);
			return typedResult;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取事件列表失败";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	// 通过ID获取单个事件
	const getEventById = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db.select().from(events).where(eq(events.id, id));
			if (result.length === 0) return null;

			const event = result[0];
			const typedEvent: Event = {
				id: event.id,
				title: event.title || "",
				description: event.description,
				timestamp: event.timestamp,
				created_at: event.created_at || new Date(),
				updated_at: event.updated_at || new Date(),
			};

			return typedEvent;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取事件详情失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 创建新事件
	const createEvent = async (data: CreateEventData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.insert(events)
				.values({
					title: data.title,
					description: data.description || null,
					timestamp: data.timestamp || null,
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			await fetchEvents(); // 刷新列表

			if (result.length === 0) return null;
			const event = result[0];
			const typedEvent: Event = {
				id: event.id,
				title: event.title || "",
				description: event.description,
				timestamp: event.timestamp,
				created_at: event.created_at || new Date(),
				updated_at: event.updated_at || new Date(),
			};

			return typedEvent;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "创建事件失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 更新事件
	const updateEvent = async (id: number, data: UpdateEventData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.update(events)
				.set({
					...data,
					updated_at: new Date(),
				})
				.where(eq(events.id, id))
				.returning();

			await fetchEvents(); // 刷新列表

			if (result.length === 0) return null;
			const event = result[0];
			const typedEvent: Event = {
				id: event.id,
				title: event.title || "",
				description: event.description,
				timestamp: event.timestamp,
				created_at: event.created_at || new Date(),
				updated_at: event.updated_at || new Date(),
			};

			return typedEvent;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "更新事件失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 删除事件
	const deleteEvent = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			await db.delete(events).where(eq(events.id, id));
			await fetchEvents(); // 刷新列表
			return true;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "删除事件失败";
			setError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		events: eventList,
		fetchEvents,
		getEventById,
		createEvent,
		updateEvent,
		deleteEvent,
	};
}
