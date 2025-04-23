import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		nodePolyfills({
			// 启用所有 polyfills
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
			// 启用 node: 协议导入
			protocolImports: true,
		}),
	],
	optimizeDeps: {
		exclude: ["lucide-react"],
		// 强制预构建这些依赖项
		include: ["postgres"],
		// 为Node.js模块提供替代实现
		esbuildOptions: {
			define: {
				global: "globalThis",
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			// 添加对perf_hooks的别名解析
			perf_hooks: path.resolve(__dirname, "./src/lib/performance-polyfill.ts"),
		},
	},
	// 添加对 Node.js 模块的处理
	build: {
		rollupOptions: {
			// 外部化处理 postgres 包
			external: ["pg", "pg-native"],
		},
	},
	define: {
		// 为缺失的 Node.js API 提供空的实现
		"process.hrtime": "undefined",
		"process.env.NODE_DEBUG": "undefined",
		// 解决 perf_hooks 和 performance 问题
		global: "globalThis",
	},
});
