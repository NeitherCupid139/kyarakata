export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					email: string;
					full_name: string;
					role: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					email: string;
					full_name: string;
					role?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string;
					role?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			products: {
				Row: {
					id: string;
					name: string;
					description: string;
					price: number;
					stock: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description?: string;
					price: number;
					stock: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					description?: string;
					price?: number;
					stock?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			novels: {
				Row: {
					id: number;
					title: string;
					author: string;
					description: string;
					cover_image_url: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					title: string;
					author: string;
					description?: string;
					cover_image_url?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					title?: string;
					author?: string;
					description?: string;
					cover_image_url?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			chapters: {
				Row: {
					id: number;
					novel_id: number;
					title: string;
					content: string;
					order: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					novel_id: number;
					title: string;
					content: string;
					order: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					novel_id?: number;
					title?: string;
					content?: string;
					order?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			user_role: "admin" | "editor" | "viewer";
		};
	};
}
