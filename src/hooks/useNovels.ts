import { useState } from "react";
import { db } from "@/db/client";
import { novels } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface Novel {
	id: number;
	title: string;
	author: string | null;
	description: string | null;
	cover_image_url: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface CreateNovelData {
	title: string;
	author?: string;
	description?: string;
	cover_image_url?: string;
}

export interface UpdateNovelData {
	title?: string;
	author?: string | null;
	description?: string | null;
	cover_image_url?: string | null;
}

export function useNovels() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [novelList, setNovelList] = useState<Novel[]>([]);

	// 获取所有小说
	const fetchNovels = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await db.select().from(novels);
			// 处理可能为null的字段，确保符合Novel接口要求
			const typedResult: Novel[] = result.map((novel) => ({
				id: novel.id,
				title: novel.title || "",
				author: novel.author,
				description: novel.description,
				cover_image_url: novel.cover_image_url,
				created_at: novel.created_at || new Date(),
				updated_at: novel.updated_at || new Date(),
			}));
			setNovelList(typedResult);
			return typedResult;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取小说列表失败";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	// 通过ID获取单个小说
	const getNovelById = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db.select().from(novels).where(eq(novels.id, id));
			if (result.length === 0) return null;

			const novel = result[0];
			const typedNovel: Novel = {
				id: novel.id,
				title: novel.title || "",
				author: novel.author,
				description: novel.description,
				cover_image_url: novel.cover_image_url,
				created_at: novel.created_at || new Date(),
				updated_at: novel.updated_at || new Date(),
			};

			return typedNovel;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取小说详情失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 创建新小说
	const createNovel = async (data: CreateNovelData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.insert(novels)
				.values({
					title: data.title,
					author: data.author || null,
					description: data.description || null,
					cover_image_url: data.cover_image_url || null,
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			await fetchNovels(); // 刷新列表

			if (result.length === 0) return null;
			const novel = result[0];
			const typedNovel: Novel = {
				id: novel.id,
				title: novel.title || "",
				author: novel.author,
				description: novel.description,
				cover_image_url: novel.cover_image_url,
				created_at: novel.created_at || new Date(),
				updated_at: novel.updated_at || new Date(),
			};

			return typedNovel;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "创建小说失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 更新小说
	const updateNovel = async (id: number, data: UpdateNovelData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.update(novels)
				.set({
					...data,
					updated_at: new Date(),
				})
				.where(eq(novels.id, id))
				.returning();

			await fetchNovels(); // 刷新列表

			if (result.length === 0) return null;
			const novel = result[0];
			const typedNovel: Novel = {
				id: novel.id,
				title: novel.title || "",
				author: novel.author,
				description: novel.description,
				cover_image_url: novel.cover_image_url,
				created_at: novel.created_at || new Date(),
				updated_at: novel.updated_at || new Date(),
			};

			return typedNovel;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "更新小说失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 删除小说
	const deleteNovel = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			await db.delete(novels).where(eq(novels.id, id));
			await fetchNovels(); // 刷新列表
			return true;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "删除小说失败";
			setError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		novels: novelList,
		fetchNovels,
		getNovelById,
		createNovel,
		updateNovel,
		deleteNovel,
	};
}
