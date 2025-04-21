import { useState } from "react";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface ChapterReviewProps {
	chapterContent: string;
	onReviewComplete: (approved: boolean, feedback: string) => void;
}

export default function ChapterReview({
	chapterContent,
	onReviewComplete,
}: ChapterReviewProps) {
	const [isReviewing, setIsReviewing] = useState(false);
	const [reviewResult, setReviewResult] = useState<{
		approved: boolean;
		feedback: string;
		score?: number;
	} | null>(null);

	const startReview = async () => {
		setIsReviewing(true);
		try {
			const response = await fetch("/api/review-chapter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content: chapterContent }),
			});

			if (!response.ok) {
				throw new Error("审核请求失败");
			}

			const data = await response.json();
			setReviewResult(data);
		} catch (error) {
			console.error("章节审核失败:", error);
			setReviewResult({
				approved: false,
				feedback: "审核过程中发生错误，请稍后重试。",
			});
		} finally {
			setIsReviewing(false);
		}
	};

	const handleApprove = () => {
		onReviewComplete(true, reviewResult?.feedback || "内容已手动批准");
	};

	const handleReject = () => {
		onReviewComplete(false, reviewResult?.feedback || "内容已手动拒绝");
	};

	return (
		<div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
			<h3 className="text-lg font-medium mb-4">章节内容审核</h3>

			{!isReviewing && !reviewResult && (
				<div className="space-y-4">
					<p className="text-gray-600 dark:text-gray-400">
						在发布章节前，您可以使用AI助手审核内容，检查内容质量并提供改进建议。
					</p>
					<Button onClick={startReview}>开始审核</Button>
				</div>
			)}

			{isReviewing && (
				<div className="flex items-center justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					<span className="ml-2">正在审核章节内容...</span>
				</div>
			)}

			{reviewResult && (
				<div className="space-y-4">
					<div
						className={`flex items-center ${
							reviewResult.approved
								? "text-green-600 dark:text-green-400"
								: "text-yellow-600 dark:text-yellow-400"
						}`}
					>
						{reviewResult.approved ? (
							<CheckCircle className="h-6 w-6 mr-2" />
						) : (
							<AlertTriangle className="h-6 w-6 mr-2" />
						)}
						<span className="font-medium">
							{reviewResult.approved ? "内容审核通过" : "内容需要修改"}
						</span>
						{reviewResult.score !== undefined && (
							<span className="ml-2 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
								质量评分: {reviewResult.score}/10
							</span>
						)}
					</div>

					<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
						<h4 className="font-medium mb-2">审核反馈:</h4>
						<p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
							{reviewResult.feedback}
						</p>
					</div>

					<div className="flex space-x-3 pt-2">
						<Button
							variant="outline"
							onClick={handleReject}
							className="text-red-500 border-red-300"
						>
							拒绝发布
						</Button>
						<Button onClick={handleApprove}>确认发布</Button>
					</div>
				</div>
			)}
		</div>
	);
}
