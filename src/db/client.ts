import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 获取环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const connectionString = import.meta.env.VITE_DATABASE_URL;

// 创建Supabase客户端（用于其他Supabase功能）
export const supabase = createClient(supabaseUrl, supabaseKey);

// 创建PostgreSQL客户端（用于Drizzle ORM）
// 注意：使用条件检查以处理服务器端和客户端环境差异
let client;
// 仅在服务器端或具有完整Node.js环境时初始化实际的postgres客户端
if (typeof window === "undefined" || import.meta.env.SSR) {
	client = postgres(connectionString, {
		ssl: "require", // 如果需要SSL连接
		max: 10, // 连接池最大连接数
		idle_timeout: 30, // 空闲连接超时（秒）
		connect_timeout: 10, // 连接超时（秒）
	});
} else {
	// 在浏览器环境中提供一个模拟对象
	// 这避免了浏览器中的连接尝试，同时保持代码结构
	client = {} as ReturnType<typeof postgres>;
	console.warn("在浏览器环境中postgres客户端不可用 - 仅在服务器端API中使用");
}

// 捕获未处理的Promise拒绝（仅在Node环境中有效）
if (typeof process !== "undefined" && process?.on) {
	process.on("unhandledRejection", (err) => {
		console.error("数据库连接错误:", err);
	});
}

// 用于在控制台输出数据库连接情况的函数
const logDatabaseConnection = () => {
	console.log("数据库连接初始化...");
	console.log(`数据库URL: ${connectionString ? "已配置" : "未配置"}`);
};

// 仅在适当的环境中调用函数
if (typeof window === "undefined" || import.meta.env.SSR) {
	logDatabaseConnection();
}

export const db = drizzle(client, { schema });

// 导出所有schema以便在其他文件中使用
export * from "./schema";
