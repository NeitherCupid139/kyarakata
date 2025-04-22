import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, showCurrency = true): string {
	return new Intl.NumberFormat("en-US", {
		style: showCurrency ? "currency" : "decimal",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}
