declare module "asciichart" {
	export function plot(
		series: number[],
		config?: {
			height?: number;
			colors?: number[];
			offset?: number;
			padding?: string;
			format?: (x: number) => string;
		}
	): string;

	export const black: number;
	export const red: number;
	export const green: number;
	export const yellow: number;
	export const blue: number;
	export const magenta: number;
	export const cyan: number;
	export const white: number;
	export const reset: number;
	export const darkgray: number;
	export const lightred: number;
	export const lightgreen: number;
	export const lightyellow: number;
	export const lightblue: number;
	export const lightmagenta: number;
	export const lightcyan: number;
	export const lightwhite: number;
}
