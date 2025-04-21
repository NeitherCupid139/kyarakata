import { EMBEDDING_MODEL } from "@/lib/zhipu-ai";

// 定义自定义请求类型
interface ApiRequest extends Request {
	json: () => Promise<{ text: string }>;
}

export const config = {
	runtime: "edge",
};

export default async function handler(request: ApiRequest) {
	try {
		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 获取请求体
		const { text } = await request.json();

		if (!text || typeof text !== "string") {
			return new Response(JSON.stringify({ error: "缺少文本内容" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// 调用Zhipu AI生成嵌入向量
		const response = await fetch(
			"https://open.bigmodel.cn/api/paas/v4/embeddings",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
				},
				body: JSON.stringify({
					model: EMBEDDING_MODEL,
					input: text,
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`嵌入生成请求失败: ${response.statusText}`);
		}

		const result = await response.json();
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("嵌入向量生成API错误:", error);
		return new Response(
			JSON.stringify({ error: "嵌入向量生成失败", message: String(error) }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
