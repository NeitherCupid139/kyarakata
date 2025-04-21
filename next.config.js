/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		// 启用Edge API支持
		runtime: "edge",
	},
	transpilePackages: ["ai"],
	webpack: (config) => {
		// 处理AI SDK中需要的依赖
		config.resolve.fallback = { fs: false, net: false, tls: false };
		return config;
	},
};

module.exports = nextConfig;
