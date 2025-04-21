import { useState, FormEvent, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Lock, User, Terminal, Zap } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [bootSequence, setBootSequence] = useState(true);
	const [showAsciiArt, setShowAsciiArt] = useState(false);
	const [bootText, setBootText] = useState<string[]>([]);
	const formRef = useRef<HTMLFormElement>(null);
	const { login, user, loading, error } = useAuthStore();

	useEffect(() => {
		// 启动序列动画
		const bootLines = [
			"初始化系统...",
			"加载驱动程序...",
			"检查安全协议...",
			"启动用户验证模块...",
			"准备登录界面...",
		];

		bootLines.forEach((line, index) => {
			setTimeout(() => {
				setBootText((prev) => [...prev, line]);
			}, index * 400 + 100);
		});

		const timer1 = setTimeout(() => setBootSequence(false), 2500);
		const timer2 = setTimeout(() => setShowAsciiArt(true), 800);

		// 添加扫描线效果
		const formElement = formRef.current;
		if (formElement) {
			const scanline = document.createElement("div");
			scanline.className = "absolute inset-0 scanline pointer-events-none";
			formElement.appendChild(scanline);
		}

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	}, []);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		// 添加点击反馈动画
		const form = e.currentTarget as HTMLFormElement;
		form.classList.add("pulse");
		setTimeout(() => form.classList.remove("pulse"), 500);

		// 添加屏幕闪烁效果
		document.body.classList.add("screen-flicker");
		setTimeout(() => document.body.classList.remove("screen-flicker"), 300);

		await login(email, password);
	};

	// Redirect if already logged in
	if (user) {
		return <Navigate to="/" replace />;
	}

	const asciiLogo = `
 _    ___   ___ ___ _  _   ___  _   _  _ ___ _    
| |  / _ \\ / __|_ _| \\| | | _ \\/_\\ | \\| | __| |   
| |_| (_) | (_ || || .\` | |  _/ _ \\| .\` | _|| |__ 
|____\\___/ \\___|___|_|\\_| |_|/_/ \\_\\_|\\_|___|____|
`;

	return (
		<div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 terminal-bg">
			<div
				className={`max-w-md w-full space-y-8 ${
					bootSequence ? "boot-sequence" : ""
				}`}
			>
				{bootSequence && (
					<div className="boot-text-container p-4 text-cyan-400 font-mono text-sm">
						{bootText.map((line, index) => (
							<div
								key={index}
								className="typewriter"
								style={{ animationDelay: `${index * 400}ms` }}
							>
								&gt; {line}
							</div>
						))}
					</div>
				)}

				{showAsciiArt && (
					<div className="ascii-logo text-center retro-font terminal-glow mb-6 typewriter">
						<pre className="text-cyan-500 inline-block text-left mx-auto">
							{asciiLogo}
						</pre>
					</div>
				)}

				<div className="card-retro p-6 terminal-border relative overflow-hidden">
					{/* 添加噪点效果 */}
					<div className="absolute inset-0 noise opacity-10 pointer-events-none"></div>

					<div className="ascii-border">
						<h2 className="mt-2 text-center text-2xl retro-font text-cyan-400 retro-text-shadow">
							═══ 登录 ═══
						</h2>
					</div>

					<div className="grid-bg absolute inset-0 opacity-10 pointer-events-none"></div>

					<form
						ref={formRef}
						className="mt-8 space-y-6 relative"
						onSubmit={handleSubmit}
					>
						<div className="space-y-4 pixel-noise">
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								label="账号:"
								leftIcon={<User className="h-5 w-5 text-cyan-400" />}
								value={email}
								onChange={(e) => {
									// 添加按键音效反馈
									const audio = new Audio("/sounds/keypress.mp3");
									audio.volume = 0.2;
									audio.play().catch(() => {});
									setEmail(e.target.value);
								}}
								className="input-retro bg-black text-cyan-300 border-cyan-700 focus:border-cyan-400"
							/>

							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								label="密码:"
								leftIcon={<Lock className="h-5 w-5 text-cyan-400" />}
								value={password}
								onChange={(e) => {
									// 添加按键音效反馈
									const audio = new Audio("/sounds/keypress.mp3");
									audio.volume = 0.2;
									audio.play().catch(() => {});
									setPassword(e.target.value);
								}}
								className="input-retro bg-black text-cyan-300 border-cyan-700 focus:border-cyan-400"
							/>
						</div>

						{error && (
							<div className="text-red-500 text-sm text-center typewriter terminal-glow blink">
								<Zap className="inline-block h-4 w-4 mr-1" />
								&gt;&gt; 登录失败: {error} &lt;&lt;
								<Zap className="inline-block h-4 w-4 ml-1" />
							</div>
						)}

						<div>
							<Button
								type="submit"
								className="w-full btn-cyan retro-font"
								isLoading={loading}
								loadingText="登录中..."
								leftIcon={<Terminal className="h-4 w-4" />}
							>
								登录
							</Button>
						</div>

						<div className="text-xs text-cyan-600 text-center mt-4 retro-font">
							<span className="blink inline-block">█</span> 系统 V2.86{" "}
							<span className="blink inline-block">█</span>
						</div>
					</form>
				</div>
			</div>

			{/* CRT效果的全局覆盖层 */}
			<div className="fixed inset-0 pointer-events-none z-50 crt-overlay">
				<div className="absolute inset-0 scanline opacity-10"></div>
			</div>
		</div>
	);
}

export default Login;
