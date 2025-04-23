/**
 * 性能钩子的浏览器兼容层
 * 提供一个与Node.js perf_hooks兼容的接口，在浏览器中使用Web API
 */

// 导出一个与Node.js perf_hooks兼容的performance对象
export const performance = globalThis.performance || {
	now: () => Date.now(),
	mark: () => {},
	measure: () => {},
	getEntriesByName: () => [],
	getEntriesByType: () => [],
	clearMarks: () => {},
	clearMeasures: () => {},
	timeOrigin: Date.now(),
};

// 其他可能需要的性能相关功能
export const PerformanceObserver =
	globalThis.PerformanceObserver ||
	class PerformanceObserver {
		constructor() {}
		observe() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
	};

// 提供一个类似Node.js的export格式，用于静态替换
export default {
	performance,
	PerformanceObserver,
};
