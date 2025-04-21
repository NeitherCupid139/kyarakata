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
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// 导出所有schema以便在其他文件中使用
export * from "./schema";
