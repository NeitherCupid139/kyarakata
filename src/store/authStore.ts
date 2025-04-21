import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { type User, Session } from "@supabase/supabase-js";

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (
		username: string,
		email: string,
		password: string
	) => Promise<void>;
	logout: () => Promise<void>;
	initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	session: null,
	loading: true,
	error: null,

	initialize: async () => {
		try {
			set({ loading: true, error: null });

			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				throw error;
			}

			if (session) {
				set({
					user: session.user,
					session,
					loading: false,
				});
			} else {
				set({
					user: null,
					session: null,
					loading: false,
				});
			}
		} catch (error) {
			set({
				user: null,
				session: null,
				loading: false,
				error: (error as Error).message,
			});
		}
	},

	login: async (email: string, password: string) => {
		try {
			set({ loading: true, error: null });

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				throw error;
			}

			set({
				user: data.user,
				session: data.session,
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: (error as Error).message,
			});
		}
	},

	register: async (username: string, email: string, password: string) => {
		try {
			set({ loading: true, error: null });

			// 注册新用户
			const {
				data: { user, session },
				error,
			} = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username,
					},
				},
			});

			if (error) {
				throw error;
			}

			set({
				user,
				session,
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: (error as Error).message,
			});
		}
	},

	logout: async () => {
		try {
			set({ loading: true, error: null });

			const { error } = await supabase.auth.signOut();

			if (error) {
				throw error;
			}

			set({
				user: null,
				session: null,
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: (error as Error).message,
			});
		}
	},
}));
