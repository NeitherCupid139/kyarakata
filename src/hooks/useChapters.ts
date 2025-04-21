import { useState } from "react";
import { db } from "@/db/client";
import { chapters } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface Chapter {
	id: number;
	novel_id: number;
	title: string;
	content: string | null;
	chapter_number: number;
	created_at: Date;
	updated_at: Date;
}

export interface CreateChapterData {
	novel_id: number;
	title: string;
	content?: string;
	chapter_number: number;
}

export interface UpdateChapterData {
	novel_id?: number;
	title?: string;
	content?: string | null;
	chapter_number?: number;
}

export function useChapters() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [chapterList, setChapterList] = useState<Chapter[]>([]);

	// 获取所有章节
	const fetchChapters = async (novelId?: number) => {
		setLoading(true);
		setError(null);
		try {
			let result;

			if (novelId !== undefined) {
				// 按小说ID查询
				result = await db
					.select()
					.from(chapters)
					.where(eq(chapters.novel_id, novelId))
					.orderBy(chapters.chapter_number);
			} else {
				// 查询所有章节
				result = await db
					.select()
					.from(chapters)
					.orderBy(chapters.chapter_number);
			}

			// 处理可能为null的字段，确保符合Chapter接口要求
			const typedResult: Chapter[] = result.map((chapter) => ({
				id: chapter.id,
				novel_id: chapter.novel_id ?? 0, // 确保novel_id不为null
				title: chapter.title || "",
				content: chapter.content,
				chapter_number: chapter.chapter_number ?? 0, // 确保chapter_number不为null
				created_at: chapter.created_at || new Date(),
				updated_at: chapter.updated_at || new Date(),
			}));

			setChapterList(typedResult);
			return typedResult;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取章节列表失败";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	// 通过ID获取单个章节
	const getChapterById = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.select()
				.from(chapters)
				.where(eq(chapters.id, id));
			if (result.length === 0) return null;

			const chapter = result[0];
			const typedChapter: Chapter = {
				id: chapter.id,
				novel_id: chapter.novel_id ?? 0, // 确保novel_id不为null
				title: chapter.title || "",
				content: chapter.content,
				chapter_number: chapter.chapter_number ?? 0, // 确保chapter_number不为null
				created_at: chapter.created_at || new Date(),
				updated_at: chapter.updated_at || new Date(),
			};

			return typedChapter;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取章节详情失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 获取小说的下一个章节编号
	const getNextChapterNumber = async (novelId: number) => {
		try {
			const result = await db
				.select()
				.from(chapters)
				.where(eq(chapters.novel_id, novelId));

			if (result.length === 0) return 1;

			// 过滤可能为null的chapter_number值
			const chapterNumbers = result
				.map((c) => c.chapter_number)
				.filter((num): num is number => num !== null);

			return chapterNumbers.length > 0 ? Math.max(...chapterNumbers) + 1 : 1;
		} catch (err) {
			console.error("获取下一章节编号失败:", err);
			return 1;
		}
	};

	// 创建新章节
	const createChapter = async (data: CreateChapterData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.insert(chapters)
				.values({
					novel_id: data.novel_id,
					title: data.title,
					content: data.content || null,
					chapter_number: data.chapter_number,
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			await fetchChapters(data.novel_id); // 刷新列表

			if (result.length === 0) return null;
			const chapter = result[0];
			const typedChapter: Chapter = {
				id: chapter.id,
				novel_id: chapter.novel_id ?? 0, // 确保novel_id不为null
				title: chapter.title || "",
				content: chapter.content,
				chapter_number: chapter.chapter_number ?? 0, // 确保chapter_number不为null
				created_at: chapter.created_at || new Date(),
				updated_at: chapter.updated_at || new Date(),
			};

			return typedChapter;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "创建章节失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 更新章节
	const updateChapter = async (id: number, data: UpdateChapterData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.update(chapters)
				.set({
					...data,
					updated_at: new Date(),
				})
				.where(eq(chapters.id, id))
				.returning();

			if (result.length > 0 && result[0].novel_id !== null) {
				await fetchChapters(result[0].novel_id); // 刷新列表
			}

			if (result.length === 0) return null;
			const chapter = result[0];
			const typedChapter: Chapter = {
				id: chapter.id,
				novel_id: chapter.novel_id ?? 0, // 确保novel_id不为null
				title: chapter.title || "",
				content: chapter.content,
				chapter_number: chapter.chapter_number ?? 0, // 确保chapter_number不为null
				created_at: chapter.created_at || new Date(),
				updated_at: chapter.updated_at || new Date(),
			};

			return typedChapter;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "更新章节失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 删除章节
	const deleteChapter = async (id: number, novelId?: number) => {
		setLoading(true);
		setError(null);
		try {
			// 如果提供了novelId，先获取要删除的章节信息以备后续刷新列表
			let chapterNovelId = novelId;
			if (chapterNovelId === undefined) {
				const chapterInfo = await getChapterById(id);
				if (chapterInfo) {
					chapterNovelId = chapterInfo.novel_id;
				}
			}

			await db.delete(chapters).where(eq(chapters.id, id));

			// 如果有小说ID，刷新该小说的章节列表
			if (chapterNovelId !== undefined) {
				await fetchChapters(chapterNovelId);
			}

			return true;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "删除章节失败";
			setError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		chapters: chapterList,
		fetchChapters,
		getChapterById,
		getNextChapterNumber,
		createChapter,
		updateChapter,
		deleteChapter,
	};
}
