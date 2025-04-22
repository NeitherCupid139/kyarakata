import {
	pgTable,
	serial,
	varchar,
	timestamp,
	boolean,
	integer,
	text,
	json,
} from "drizzle-orm/pg-core";

// 用户表
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	username: varchar("username", { length: 100 }).unique(),
	email: varchar("email", { length: 100 }).unique(),
	password_hash: varchar("password_hash", { length: 255 }), // 加密存储密码
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
	is_active: boolean("is_active").default(true), // 是否启用
});

// 角色表
export const characters = pgTable("characters", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }), // 角色名称
	gender: varchar("gender", { length: 20 }), // 性别
	age: integer("age"), // 年龄
	background: text("background"), // 背景故事
	personality: text("personality"), // 个性描述
	avatar_url: varchar("avatar_url", { length: 255 }), // 角色头像URL
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

// 世界观事件表
export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }), // 事件标题
	description: text("description"), // 事件描述
	timestamp: timestamp("timestamp"), // 事件发生时间
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

// 角色与事件关系表
export const character_event_relations = pgTable("character_event_relations", {
	id: serial("id").primaryKey(),
	character_id: integer("character_id").references(() => characters.id),
	event_id: integer("event_id").references(() => events.id),
	role_in_event: text("role_in_event"), // 在该事件中的角色作用
	created_at: timestamp("created_at").defaultNow(),
});

// 角色关系表（如敌人、朋友等）
export const character_relationships = pgTable("character_relationships", {
	id: serial("id").primaryKey(),
	character1_id: integer("character1_id").references(() => characters.id),
	character2_id: integer("character2_id").references(() => characters.id),
	relationship_type: varchar("relationship_type", { length: 50 }), // 关系类型（朋友、敌人、盟友等）
	description: text("description"), // 关系的详细描述
	created_at: timestamp("created_at").defaultNow(),
});

// 用户与角色的关系（用户管理的角色）
export const user_character_relations = pgTable("user_character_relations", {
	id: serial("id").primaryKey(),
	user_id: integer("user_id").references(() => users.id),
	character_id: integer("character_id").references(() => characters.id),
	role_in_world: varchar("role_in_world", { length: 100 }), // 该角色在用户的世界设定中扮演的角色
	created_at: timestamp("created_at").defaultNow(),
});

// 新增：小说表
export const novels = pgTable("novels", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }), // 小说标题
	author: varchar("author", { length: 100 }), // 作者
	description: text("description"), // 简介
	cover_image_url: varchar("cover_image_url", { length: 255 }), // 封面图片URL
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

// 新增：章节表
export const chapters = pgTable("chapters", {
	id: serial("id").primaryKey(),
	novel_id: integer("novel_id").references(() => novels.id), // 关联小说
	title: varchar("title", { length: 255 }), // 章节标题
	content: text("content"), // 章节内容
	chapter_number: integer("chapter_number"), // 章节编号（如第1章）
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

// 新增：世界观设定表
export const worldSettings = pgTable("world_settings", {
	id: serial("id").primaryKey(),
	novel_id: integer("novel_id").references(() => novels.id), // 关联小说
	title: varchar("title", { length: 255 }), // 世界观标题
	description: text("description"), // 世界观详细描述
	rules: text("rules"), // 世界规则设定
	background: text("background"), // 世界背景描述
	history: text("history"), // 世界历史
	geography: text("geography"), // 地理环境
	culture: text("culture"), // 文化特点
	magic_system: text("magic_system"), // 魔法体系(如果适用)
	technology: text("technology"), // 技术水平
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

// 新增：时间线表
export const timelines = pgTable("timelines", {
	id: serial("id").primaryKey(),
	novel_id: integer("novel_id").references(() => novels.id), // 关联小说
	title: varchar("title", { length: 255 }), // 时间线标题
	description: text("description"), // 时间线描述
	nodes: json("nodes"), // 存储节点数据
	edges: json("edges"), // 存储连接数据
	created_at: timestamp("created_at").defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

// 时间线节点事件关联表
export const timeline_events = pgTable("timeline_events", {
	id: serial("id").primaryKey(),
	timeline_id: integer("timeline_id").references(() => timelines.id),
	event_id: integer("event_id").references(() => events.id),
	node_id: varchar("node_id", { length: 100 }), // 对应时间线中的节点ID
	created_at: timestamp("created_at").defaultNow(),
});
