import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import {
	Users,
	BookText,
	BookOpen,
	Scroll,
	GitBranch,
	Activity,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AsciiChart from "@/components/ui/AsciiChart";
import RetroEffects from "@/components/ui/RetroEffects";

interface StatCardProps {
	title: string;
	value: string | number;
	description: string;
	icon: React.ReactNode;
	trend?: "up" | "down";
	trendValue?: string;
	isLoading?: boolean;
	asciiIcon?: string;
}

function StatCard({
	title,
	value,
	description,
	icon,
	trend,
	trendValue,
	isLoading = false,
	asciiIcon,
}: StatCardProps) {
	const [blink, setBlink] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setBlink((prev) => !prev);
		}, 800);

		return () => clearInterval(timer);
	}, []);

	return (
		<Card className="flex flex-col card-retro">
			<div className="flex justify-between">
				<div>
					<p className="text-sm font-medium text-[var(--terminal-green)] truncate ascii-title">
						{title}
					</p>
					<p
						className={`mt-1 text-3xl font-bold terminal-text ${
							isLoading ? "animate-pulse" : ""
						}`}
					>
						{isLoading ? "..." : value}
						{!isLoading && blink && (
							<span className="inline-block ml-1 terminal-cursor">_</span>
						)}
					</p>
				</div>
				<div className="p-3 rounded-md bg-[rgba(0,255,0,0.05)] border border-[var(--terminal-green)] self-start">
					{asciiIcon ? (
						<pre className="text-[var(--terminal-green)] text-lg">
							{asciiIcon}
						</pre>
					) : (
						icon
					)}
				</div>
			</div>
			<div className="mt-4">
				{trend && trendValue && (
					<span
						className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${
							trend === "up"
								? "bg-[rgba(0,255,0,0.1)] text-[var(--terminal-green)]"
								: "bg-[rgba(255,0,0,0.1)] text-[var(--terminal-red)]"
						}`}
					>
						{trend === "up" ? "↑" : "↓"} {trendValue}
					</span>
				)}
				<p className="mt-1 text-sm text-[var(--terminal-dim)] terminal-text">
					{description}
				</p>
			</div>
		</Card>
	);
}

interface RecentActivity {
	id: string;
	action: string;
	user: string;
	time: string;
}

// ASCII 图表数据
const getRandomData = (length: number, min: number, max: number) => {
	return Array.from({ length }, () =>
		Math.floor(Math.random() * (max - min) + min)
	);
};

function Dashboard() {
	const [stats, setStats] = useState({
		totalNovels: 0,
		totalCharacters: 0,
		totalChapters: 0,
		totalRelationships: 0,
		totalEvents: 0,
		totalWords: 0,
	});

	const [isLoading, setIsLoading] = useState(true);

	const recentActivity: RecentActivity[] = [
		{
			id: "1",
			action: "新角色创建",
			user: "user@example.com",
			time: "5 分钟前",
		},
		{
			id: "2",
			action: "章节更新",
			user: "admin@example.com",
			time: "2 小时前",
		},
		{
			id: "3",
			action: "小说创建",
			user: "author@example.com",
			time: "4 小时前",
		},
		{ id: "4", action: "关系修改", user: "admin@example.com", time: "1 天前" },
	];

	// 图表数据
	const [chartData] = useState({
		novelTrend: getRandomData(20, 0, 10),
		characterTrend: getRandomData(20, 5, 15),
		chapterTrend: getRandomData(20, 10, 30),
	});

	useEffect(() => {
		// 获取小说、角色、章节统计数据
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				// 获取小说数量
				const { count: novelsCount, error: novelsError } = await supabase
					.from("novels")
					.select("*", { count: "exact", head: true });

				if (novelsError) console.error("获取小说数据失败:", novelsError);

				// 获取角色数量
				const { count: charactersCount, error: charactersError } =
					await supabase
						.from("characters")
						.select("*", { count: "exact", head: true });

				if (charactersError)
					console.error("获取角色数据失败:", charactersError);

				// 获取章节数量
				const { count: chaptersCount, error: chaptersError } = await supabase
					.from("chapters")
					.select("*", { count: "exact", head: true });

				if (chaptersError) console.error("获取章节数据失败:", chaptersError);

				// 获取角色关系数量
				const { count: relationshipsCount, error: relationshipsError } =
					await supabase
						.from("character_relationships")
						.select("*", { count: "exact", head: true });

				if (relationshipsError)
					console.error("获取关系数据失败:", relationshipsError);

				// 获取事件数量
				const { count: eventsCount, error: eventsError } = await supabase
					.from("events")
					.select("*", { count: "exact", head: true });

				if (eventsError) console.error("获取事件数据失败:", eventsError);

				// 设置统计数据
				setStats({
					totalNovels: novelsCount || 0,
					totalCharacters: charactersCount || 0,
					totalChapters: chaptersCount || 0,
					totalRelationships: relationshipsCount || 0,
					totalEvents: eventsCount || 0,
					totalWords: 125600, // 示例数据
				});
			} catch (error) {
				console.error("获取统计数据失败:", error);
			} finally {
				// 为了演示，添加延迟以展示加载效果
				setTimeout(() => {
					setIsLoading(false);

					// 演示数据
					setStats({
						totalNovels: 12,
						totalCharacters: 68,
						totalChapters: 153,
						totalRelationships: 42,
						totalEvents: 38,
						totalWords: 125600,
					});
				}, 1500);
			}
		};

		fetchStats();

		// 清除定时器
		return () => {
			// 清除可能存在的定时器
		};
	}, []);

	return (
		<RetroEffects enableGlitch enableScanlines>
			<div className="space-y-6">
				<div className="flex items-center space-x-3">
					<div>
						<h1 className="text-2xl font-bold text-[var(--terminal-green)] ascii-title">
							系统状态监控
						</h1>
						<p className="text-[var(--terminal-dim)] terminal-text">
							角色创作辅助系统 - 数据概览
						</p>
					</div>
				</div>

				{/* Stats grid */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					<StatCard
						title="小说总数"
						value={stats.totalNovels}
						description="系统中的小说作品数量"
						icon={<BookOpen className="h-6 w-6 text-[var(--terminal-green)]" />}
						trend="up"
						trendValue="12%"
						isLoading={isLoading}
						asciiIcon="[B]"
					/>

					<StatCard
						title="角色总数"
						value={stats.totalCharacters}
						description="系统中的角色数量"
						icon={<Users className="h-6 w-6 text-[var(--terminal-green)]" />}
						trend="up"
						trendValue="8%"
						isLoading={isLoading}
						asciiIcon="[C]"
					/>

					<StatCard
						title="章节总数"
						value={stats.totalChapters}
						description="所有小说的章节总数"
						icon={<BookText className="h-6 w-6 text-[var(--terminal-green)]" />}
						trend="up"
						trendValue="15%"
						isLoading={isLoading}
						asciiIcon="[S]"
					/>

					<StatCard
						title="角色关系"
						value={stats.totalRelationships}
						description="角色之间的关系数量"
						icon={
							<GitBranch className="h-6 w-6 text-[var(--terminal-green)]" />
						}
						trend="up"
						trendValue="6%"
						isLoading={isLoading}
						asciiIcon="[R]"
					/>

					<StatCard
						title="事件数量"
						value={stats.totalEvents}
						description="系统中记录的事件数量"
						icon={<Activity className="h-6 w-6 text-[var(--terminal-green)]" />}
						trend="down"
						trendValue="3%"
						isLoading={isLoading}
						asciiIcon="[E]"
					/>

					<StatCard
						title="总字数"
						value={formatCurrency(stats.totalWords, false)}
						description="所有章节的总字数"
						icon={<Scroll className="h-6 w-6 text-[var(--terminal-green)]" />}
						trend="up"
						trendValue="18%"
						isLoading={isLoading}
						asciiIcon="[W]"
					/>
				</div>

				{/* ASCII 趋势图表 */}
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					<Card title="小说趋势" className="card-retro">
						<AsciiChart
							data={chartData.novelTrend}
							height={10}
							colors={["terminal-green"]}
							animated={true}
							label="近期小说创建量趋势"
						/>
					</Card>

					<Card title="角色趋势" className="card-retro">
						<AsciiChart
							data={chartData.characterTrend}
							height={10}
							colors={["terminal-green"]}
							animated={true}
							label="近期角色创建量趋势"
						/>
					</Card>

					<Card title="章节趋势" className="card-retro">
						<AsciiChart
							data={chartData.chapterTrend}
							height={10}
							colors={["terminal-green"]}
							animated={true}
							label="近期章节创建量趋势"
						/>
					</Card>
				</div>

				{/* Recent Activity */}
				<Card title="最近活动" className="card-retro">
					<div className="flow-root">
						<ul className="divide-y divide-[rgba(0,255,0,0.1)]">
							{recentActivity.map((activity) => (
								<li key={activity.id} className="py-3 terminal-text group">
									<div className="flex items-center space-x-4 transition-all duration-200 cursor-pointer hover:bg-[rgba(0,255,0,0.05)] p-2 rounded">
										<div className="flex-1 min-w-0">
											<p className="font-mono text-[var(--terminal-green)] group-hover:text-[var(--terminal-bright-green)] truncate">
												&gt; {activity.action}
											</p>
											<p className="font-mono text-[var(--terminal-dim)] truncate text-sm">
												{activity.user}
											</p>
										</div>
										<div className="font-mono text-[var(--terminal-dim)] text-sm">
											{activity.time}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className="mt-3 pt-3 border-t border-[rgba(0,255,0,0.1)] font-mono text-[var(--terminal-dim)] text-sm animate-pulse">
						&gt; <span className="terminal-text">系统数据更新中</span>{" "}
						<span className="terminal-cursor inline-block">_</span>
					</div>
				</Card>
			</div>
		</RetroEffects>
	);
}

export default Dashboard;
