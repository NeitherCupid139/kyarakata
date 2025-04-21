import { useState } from "react";
import { useChat } from "ai/react";
import { Send, Bot, User } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AIChatbotProps {
	novelId: number;
	novelTitle: string;
}

export default function AIChatbot({ novelId, novelTitle }: AIChatbotProps) {
	const [isOpen, setIsOpen] = useState(false);

	const { messages, input, handleInputChange, handleSubmit, isLoading } =
		useChat({
			api: `/api/chat?novelId=${novelId}`,
		});

	return (
		<div className="w-full">
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full mb-4"
				leftIcon={<Bot size={16} />}
			>
				{isOpen ? "关闭AI助手" : `打开AI助手 (《${novelTitle}》知识库)`}
			</Button>

			{isOpen && (
				<div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800 p-4">
					<div className="flex flex-col space-y-4 mb-4 max-h-80 overflow-y-auto">
						{messages.length === 0 ? (
							<div className="text-center text-gray-500 dark:text-gray-400 py-8">
								向AI提问关于《{novelTitle}》的内容，例如角色背景、剧情发展等
							</div>
						) : (
							messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.role === "user" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`max-w-[80%] rounded-lg px-4 py-2 ${
											message.role === "user"
												? "bg-blue-500 text-white"
												: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
										}`}
									>
										<div className="flex items-center gap-2 mb-1">
											{message.role === "user" ? (
												<User size={16} />
											) : (
												<Bot size={16} />
											)}
											<span className="font-medium">
												{message.role === "user" ? "您" : "AI助手"}
											</span>
										</div>
										<p className="whitespace-pre-wrap">{message.content}</p>
									</div>
								</div>
							))
						)}
					</div>

					<form onSubmit={handleSubmit} className="flex space-x-2">
						<Input
							className="flex-grow"
							value={input}
							onChange={handleInputChange}
							placeholder="询问关于这部小说的问题..."
							disabled={isLoading}
						/>
						<Button type="submit" disabled={isLoading || !input.trim()}>
							<Send size={16} />
						</Button>
					</form>
				</div>
			)}
		</div>
	);
}
