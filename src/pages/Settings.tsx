import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Key, Save, Monitor, Brain, Lock, Sun, Moon } from "lucide-react";
import { supabase } from "../lib/supabase";

function Settings() {
	const [loading, setLoading] = useState(false);
	const [passwordError, setPasswordError] = useState<string>("");
	const [passwordSuccess, setPasswordSuccess] = useState<string>("");

	// 主题设置
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			return (
				localStorage.getItem("darkMode") === "true" ||
				(!localStorage.getItem("darkMode") &&
					window.matchMedia("(prefers-color-scheme: dark)").matches)
			);
		}
		return false;
	});

	// 大模型设置
	const [aiModelSettings, setAiModelSettings] = useState({
		selectedModel: "glm-4-plus",
	});

	// 密码修改
	const [passwordSettings, setPasswordSettings] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// 主题切换效果
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		localStorage.setItem("darkMode", isDarkMode.toString());
	}, [isDarkMode]);

	// 切换主题模式
	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	const handleModelUpdate = async () => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// 在真实应用中，这里会更新用户的模型偏好设置
			console.log("Model updated to:", aiModelSettings.selectedModel);
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async () => {
		setPasswordError("");
		setPasswordSuccess("");

		// 表单验证
		if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
			setPasswordError("新密码和确认密码不匹配");
			return;
		}

		if (passwordSettings.newPassword.length < 6) {
			setPasswordError("新密码长度必须至少为6个字符");
			return;
		}

		setLoading(true);
		try {
			// 在真实应用中，使用Supabase更新密码
			const { error } = await supabase.auth.updateUser({
				password: passwordSettings.newPassword,
			});

			if (error) throw error;

			// 清空表单
			setPasswordSettings({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});

			setPasswordSuccess("密码已成功更新");
		} catch (error) {
			console.error("Error updating password:", error);
			setPasswordError("密码更新失败，请重试");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					设置
				</h1>
				<p className="text-gray-500 dark:text-gray-400">
					管理您的账户设置和偏好
				</p>
			</div>

			{/* 主题设置 */}
			<Card
				title="主题设置"
				icon={<Monitor className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
			>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							{isDarkMode ? (
								<Moon className="h-5 w-5 text-gray-400" />
							) : (
								<Sun className="h-5 w-5 text-gray-400" />
							)}
							<div>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
									深色模式
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									切换深色/浅色主题
								</p>
							</div>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer"
								checked={isDarkMode}
								onChange={toggleTheme}
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
						</label>
					</div>
				</div>
			</Card>

			{/* 大模型设置 */}
			<Card
				title="大模型设置"
				icon={<Brain className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
			>
				<div className="space-y-4">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="block text-sm terminal-text mb-1">
								选择AI模型
							</label>
							<select
								className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
								value={aiModelSettings.selectedModel}
								onChange={(e) =>
									setAiModelSettings({
										...aiModelSettings,
										selectedModel: e.target.value,
									})
								}
							>
								<option value="glm-4-plus">ChatGLM 4 Plus</option>
								<option value="glm-4">ChatGLM 4</option>
								<option value="glm-3">ChatGLM 3</option>
								<option value="qwen">通义千问</option>
								<option value="ernie">文心一言</option>
							</select>
						</div>
					</div>
					<div className="flex justify-end">
						<Button
							onClick={handleModelUpdate}
							isLoading={loading}
							leftIcon={<Save size={16} />}
						>
							保存模型设置
						</Button>
					</div>
				</div>
			</Card>

			{/* 修改密码 */}
			<Card
				title="修改密码"
				icon={<Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
			>
				<div className="space-y-4">
					{passwordError && (
						<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{passwordError}
						</div>
					)}

					{passwordSuccess && (
						<div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
							{passwordSuccess}
						</div>
					)}

					<div className="grid grid-cols-1 gap-4">
						<Input
							label="当前密码"
							type="password"
							value={passwordSettings.currentPassword}
							onChange={(e) =>
								setPasswordSettings({
									...passwordSettings,
									currentPassword: e.target.value,
								})
							}
						/>
						<Input
							label="新密码"
							type="password"
							value={passwordSettings.newPassword}
							onChange={(e) =>
								setPasswordSettings({
									...passwordSettings,
									newPassword: e.target.value,
								})
							}
						/>
						<Input
							label="确认新密码"
							type="password"
							value={passwordSettings.confirmPassword}
							onChange={(e) =>
								setPasswordSettings({
									...passwordSettings,
									confirmPassword: e.target.value,
								})
							}
						/>
					</div>

					<div className="flex justify-end">
						<Button
							onClick={handlePasswordChange}
							isLoading={loading}
							leftIcon={<Key size={16} />}
						>
							更新密码
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default Settings;
