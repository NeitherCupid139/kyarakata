# 小说章节管理与 AI 助手

这是一个小说章节管理系统，集成了 AI 聊天助手和内容审核功能。用户可以管理小说章节，同时利用 AI 功能查询小说内容并获取审核建议。

## 主要功能

1. **小说章节管理**：创建、编辑、删除小说章节
2. **AI 聊天助手**：基于已上传章节内容回答用户问题
3. **内容审核**：在发布前使用 AI 审核章节内容质量

## 技术栈

- React 前端框架
- Next.js 应用框架
- Tailwind CSS 样式库
- Vercel AI SDK AI 集成
- ZhipuAI 提供 AI 能力
- Supabase 数据存储

## 开始使用

### 环境要求

- Node.js 16+
- Bun 包管理器

### 安装依赖

```bash
bun install
```

### 环境变量配置

在项目根目录创建 `.env.local` 文件并配置以下变量：

```
# Supabase配置
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# ZhipuAI配置
ZHIPU_API_KEY=your-zhipu-api-key
```

### 启动开发服务器

```bash
bun run dev
```

## 数据库结构

该项目需要在 Supabase 中创建以下表：

1. **novels** 表：

   - id: 唯一标识符
   - title: 小说标题
   - author: 作者
   - description: 描述
   - created_at: 创建时间
   - updated_at: 更新时间

2. **chapters** 表：
   - id: 唯一标识符
   - novel_id: 关联的小说 ID
   - title: 章节标题
   - content: 章节内容
   - chapter_number: 章节序号
   - created_at: 创建时间
   - updated_at: 更新时间

## AI 功能使用

### 章节知识库查询

用户可以在小说详情页面中通过 AI 聊天组件询问与小说相关的问题。AI 将基于所有已上传章节的内容提供答案。

### 章节内容审核

在创建或编辑章节时，用户可以使用 AI 审核功能对内容进行质量评估。审核结果包括质量评分和具体的改进建议。
