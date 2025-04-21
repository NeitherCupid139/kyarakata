import { NextRequest, NextResponse } from "next/server";
import { zhipu, CHAT_MODEL } from "@/lib/zhipu-ai";

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

		// 获取请求体
		const { content } = await request.json();

		if (!content || typeof content !== "string") {
			return NextResponse.json(
				{ error: "缺少有效的章节内容" },
				{ status: 400 }
			);
		}

		// 创建审核提示
		const reviewPrompt = `请对以下小说章节内容进行全面审核与评估，并提供详细反馈。评估维度包括：内容质量、情节连贯性、人物塑造、语言表达、以及是否存在不适当内容。请以专业编辑的角度给出具体、有建设性的建议。

章节内容：
${content}

请提供以下输出：
1. 总体评价（简短概述章节质量）
2. 质量评分（1-10分）
3. 具体建议（针对情节、人物、语言等方面的具体改进建议）
4. 审核结论（是否建议发布，或需要修改）

输出格式示例：
{
  "approved": true或false,
  "score": 7,
  "feedback": "详细的反馈内容..."
}`;

		// 调用Zhipu AI进行审核
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
					messages: [
						{
							role: "system",
							content:
								"你是一个专业的文学编辑，负责审核小说章节内容。请根据提示进行评估并给出专业的反馈。",
						},
						{
							role: "user",
							content: reviewPrompt,
						},
					],
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`审核请求失败: ${response.statusText}`);
		}

		const result = await response.json();

		// 处理AI响应
		try {
			// 尝试从AI响应中提取JSON格式的审核结果
			const content = result.choices[0]?.message?.content || "";

			// 尝试从文本中提取JSON
			const jsonMatch =
				content.match(/```json\s*([\s\S]*?)\s*```/) ||
				content.match(/```\s*([\s\S]*?)\s*```/) ||
				content.match(/{[\s\S]*?}/);

			const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;

			let reviewResult;
			try {
				reviewResult = JSON.parse(jsonStr.replace(/```/g, "").trim());
			} catch (e) {
				// 如果无法解析JSON，尝试从文本中提取关键信息
				const approvedMatch = content.match(
					/审核结论[：:]\s*(通过|不通过|建议发布|需要修改)/i
				);
				const scoreMatch = content.match(/质量评分[：:]\s*(\d+)/);

				reviewResult = {
					approved: approvedMatch
						? /通过|建议发布/.test(approvedMatch[1])
						: content.includes("可以发布") || content.includes("建议发布"),
					score: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
					feedback: content,
				};
			}

			return NextResponse.json(reviewResult);
		} catch (error) {
			console.error("处理审核结果失败:", error);
			// 返回默认格式
			return NextResponse.json({
				approved: false,
				feedback: "无法解析审核结果，请人工审核章节内容。",
			});
		}
	} catch (error) {
		console.error("章节审核API错误:", error);
		return NextResponse.json(
			{ error: "章节审核失败", message: String(error) },
			{ status: 500 }
		);
	}
}
