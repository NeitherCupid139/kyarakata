import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateEmbeddings } from "@/lib/zhipu-ai";

export const config = {
	runtime: "edge",
};

export default async function handler(request: NextRequest) {
	try {
		if (request.method !== "POST") {
			return NextResponse.json(
				{ error: "Method not allowed" },
				{ status: 405 }
			);
		}

		// 获取参数
		const url = new URL(request.url);
		const novelId = url.searchParams.get("novelId");

		if (!novelId) {
			return NextResponse.json({ error: "缺少小说ID" }, { status: 400 });
		}

		// 获取请求体
		const { query } = await request.json();

		if (!query || typeof query !== "string") {
			return NextResponse.json({ error: "缺少查询文本" }, { status: 400 });
		}

		// 为查询生成嵌入向量
		const embeddings = await generateEmbeddings(query);
		const queryEmbedding = embeddings.data[0].embedding;

		// 在真实应用中，这里会进行向量相似度查询
		// 简化版本:
		// 1. 从数据库获取所有相关章节
		const { data: chapters, error } = await supabase
			.from("chapters")
			.select("id, title, content, chapter_number")
			.eq("novel_id", novelId)
			.order("chapter_number", { ascending: true });

		if (error) {
			throw new Error(`获取章节失败: ${error.message}`);
		}

		// 2. 简单模拟相似度搜索 (在实际应用中应该使用向量数据库)
		// 这里只是简单检查查询文本是否包含在内容中
		const relevantChapters = chapters
			.filter(
				(chapter) =>
					chapter.content.toLowerCase().includes(query.toLowerCase()) ||
					chapter.title.toLowerCase().includes(query.toLowerCase())
			)
			.map((chapter) => ({
				id: chapter.id,
				title: chapter.title,
				chapter_number: chapter.chapter_number,
				// 简化版的相关段落提取
				relevant_text: extractRelevantText(chapter.content, query),
				// 在真实应用中这会是真实的相似度分数
				score: 0.85,
			}))
			.sort((a, b) => b.score - a.score)
			.slice(0, 5); // 最多返回5个最相关的章节

		return NextResponse.json({
			query,
			relevant_chapters: relevantChapters,
		});
	} catch (error) {
		console.error("相似内容查询API错误:", error);
		return NextResponse.json(
			{ error: "相似内容查询失败", message: String(error) },
			{ status: 500 }
		);
	}
}

// 辅助函数：从内容中提取与查询相关的段落
function extractRelevantText(content: string, query: string): string {
	const lowerContent = content.toLowerCase();
	const lowerQuery = query.toLowerCase();

	if (!lowerContent.includes(lowerQuery)) {
		// 如果找不到精确匹配，返回内容的前200个字符
		return content.substring(0, 200) + "...";
	}

	// 查找查询在内容中的位置
	const queryIndex = lowerContent.indexOf(lowerQuery);

	// 提取查询周围的文本 (前后各100个字符)
	const start = Math.max(0, queryIndex - 100);
	const end = Math.min(content.length, queryIndex + query.length + 100);

	return (
		(start > 0 ? "..." : "") +
		content.substring(start, end) +
		(end < content.length ? "..." : "")
	);
}
