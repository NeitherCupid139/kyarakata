import { createZhipu } from "zhipu-ai-provider";

// 从环境变量获取API密钥
const apiKey = process.env.ZHIPU_API_KEY;

// 创建Zhipu AI提供者实例
export const zhipu = createZhipu({
	apiKey: apiKey || "",
	// 可以根据需要添加其他配置
	// baseURL: 'https://open.bigmodel.cn/api/paas/v4',
	// headers: {},
});

// 用于嵌入文本的模型
export const EMBEDDING_MODEL = "embedding-2";

// 用于生成文本的模型
export const CHAT_MODEL = "glm-4-plus";

// 工具函数：生成文本嵌入
export async function generateEmbeddings(text: string) {
	try {
		const response = await fetch("/api/embeddings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error("嵌入生成请求失败");
		}

		return await response.json();
	} catch (error) {
		console.error("生成嵌入失败:", error);
		throw error;
	}
}

// 工具函数：查询相似内容
export async function querySimilarContent(query: string, novelId: number) {
	try {
		const response = await fetch(`/api/similar-content?novelId=${novelId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		});

		if (!response.ok) {
			throw new Error("相似内容查询失败");
		}

		return await response.json();
	} catch (error) {
		console.error("查询相似内容失败:", error);
		throw error;
	}
}
