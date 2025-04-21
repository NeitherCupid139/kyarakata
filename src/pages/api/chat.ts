import { NextApiRequest, NextApiResponse } from "next";
import { StreamingTextResponse } from "ai";
import { CHAT_MODEL } from "@/lib/zhipu-ai";
import { supabase } from "@/lib/supabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// 仅接受POST请求
		if (req.method !== "POST") {
			return res.status(405).json({ error: "Method not allowed" });
		}

		// 获取请求参数
		const { messages } = req.body;
		const { novelId } = req.query;

		if (!novelId || !messages || !Array.isArray(messages)) {
			return res.status(400).json({ error: "缺少必要参数" });
		}

		// 获取小说信息
		const { data: novelData, error: novelError } = await supabase
			.from("novels")
			.select("title")
			.eq("id", novelId)
			.single();

		if (novelError || !novelData) {
			return res.status(404).json({ error: "未找到小说信息" });
		}

		// 获取小说章节作为上下文
		const { data: chapters, error: chaptersError } = await supabase
			.from("chapters")
			.select("title, content, chapter_number")
			.eq("novel_id", novelId)
			.order("chapter_number", { ascending: true });

		if (chaptersError) {
			return res.status(500).json({ error: "获取章节数据失败" });
		}

		// 预处理章节数据作为上下文
		const context = chapters
			.map(
				(chapter) =>
					`第${chapter.chapter_number}章 ${chapter.title}\n${chapter.content}`
			)
			.join("\n\n");

		// 创建系统消息，加入上下文
		const systemMessage = {
			role: "system",
			content: `你是一个小说助手AI，负责解答用户关于《${novelData.title}》的问题。
使用以下章节内容作为回答的知识库，不要编造不存在的情节或人物。
如果不确定问题的答案，请坦诚告知用户这超出了小说内容范围。所有回答必须使用中文。

小说内容:
${context}`,
		};

		// 添加系统消息到用户消息前
		const chatMessages = [systemMessage, ...messages];

		// 使用Zhipu AI生成回答
		const response = await fetch(
			"https://open.bigmodel.cn/api/paas/v4/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
				},
				body: JSON.stringify({
					model: CHAT_MODEL,
					messages: chatMessages,
					stream: true,
				}),
			}
		);

		// 创建流式响应
		const streamingTextResponse = new StreamingTextResponse(response.body, {
			headers: {
				"Content-Type": "text/event-stream",
			},
		});

		return streamingTextResponse;
	} catch (error: unknown) {
		console.error("聊天API错误:", error);
		const errorMessage = error instanceof Error ? error.message : "未知错误";
		return res.status(500).json({
			error: "聊天请求处理失败",
			message: errorMessage,
		});
	}
}
