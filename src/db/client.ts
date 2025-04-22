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
const client = postgres(connectionString, {
	ssl: "require", // 如果需要SSL连接
	max: 10, // 连接池最大连接数
	idle_timeout: 30, // 空闲连接超时（秒）
	connect_timeout: 10, // 连接超时（秒）
});

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

// 调用函数
logDatabaseConnection();

export const db = drizzle(client, { schema });

// 导出所有schema以便在其他文件中使用
export * from "./schema";
