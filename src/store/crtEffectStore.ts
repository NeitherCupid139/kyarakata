import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CrtEffectState {
	enabled: boolean;
	toggleCrtEffect: () => void;
	enableCrtEffect: () => void;
	disableCrtEffect: () => void;
}

export const useCrtEffectStore = create<CrtEffectState>()(
	persist(
		(set) => ({
			enabled: true, // 默认开启 CRT 效果

			toggleCrtEffect: () => set((state) => ({ enabled: !state.enabled })),
			enableCrtEffect: () => set({ enabled: true }),
			disableCrtEffect: () => set({ enabled: false }),
		}),
		{
			name: "crt-effect-storage",
		}
	)
);
