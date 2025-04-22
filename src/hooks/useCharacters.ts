import { useState } from "react";
import { db } from "@/db/client";
import { characters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabase";

export interface Character {
	id: number;
	name: string;
	gender: string;
	age: number | null;
	background: string | null;
	personality: string | null;
	avatar_url: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface CreateCharacterData {
	name: string;
	gender: string;
	age?: number;
	background?: string;
	personality?: string;
	avatar_url?: string;
}

export interface UpdateCharacterData {
	name?: string;
	gender?: string;
	age?: number | null;
	background?: string | null;
	personality?: string | null;
	avatar_url?: string | null;
}

export function useCharacters() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [characterList, setCharacterList] = useState<Character[]>([]);
	const [uploadProgress, setUploadProgress] = useState(0);

	// 获取所有角色
	const fetchCharacters = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await db.select().from(characters);
			// 处理可能为null的字段，确保符合Character接口要求
			const typedResult: Character[] = result.map((char) => ({
				id: char.id,
				name: char.name || "",
				gender: char.gender || "",
				age: char.age,
				background: char.background,
				personality: char.personality,
				avatar_url: char.avatar_url,
				created_at: char.created_at || new Date(),
				updated_at: char.updated_at || new Date(),
			}));
			setCharacterList(typedResult);
			return typedResult;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取角色列表失败";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	// 通过ID获取单个角色
	const getCharacterById = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.select()
				.from(characters)
				.where(eq(characters.id, id));
			if (result.length === 0) return null;

			const char = result[0];
			const typedChar: Character = {
				id: char.id,
				name: char.name || "",
				gender: char.gender || "",
				age: char.age,
				background: char.background,
				personality: char.personality,
				avatar_url: char.avatar_url,
				created_at: char.created_at || new Date(),
				updated_at: char.updated_at || new Date(),
			};

			return typedChar;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取角色详情失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 上传角色头像
	const uploadAvatar = async (file: File, characterId: number) => {
		setLoading(true);
		setError(null);
		setUploadProgress(0);

		try {
			const fileExt = file.name.split(".").pop();
			const filePath = `characters/${characterId}/${Date.now()}.${fileExt}`;

			// 上传头像
			const { error } = await supabase.storage
				.from("avatars")
				.upload(filePath, file, {
					upsert: true,
				});

			if (error) throw error;

			// 上传成功后设置进度为100%
			setUploadProgress(100);

			const { data: urlData } = supabase.storage
				.from("avatars")
				.getPublicUrl(filePath);

			return urlData.publicUrl;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "上传头像失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 创建新角色
	const createCharacter = async (data: CreateCharacterData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.insert(characters)
				.values({
					name: data.name,
					gender: data.gender,
					age: data.age || null,
					background: data.background || null,
					personality: data.personality || null,
					avatar_url: data.avatar_url || null,
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			await fetchCharacters(); // 刷新列表

			if (result.length === 0) return null;
			const char = result[0];
			const typedChar: Character = {
				id: char.id,
				name: char.name || "",
				gender: char.gender || "",
				age: char.age,
				background: char.background,
				personality: char.personality,
				avatar_url: char.avatar_url,
				created_at: char.created_at || new Date(),
				updated_at: char.updated_at || new Date(),
			};

			return typedChar;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "创建角色失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 更新角色
	const updateCharacter = async (id: number, data: UpdateCharacterData) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.update(characters)
				.set({
					...data,
					updated_at: new Date(),
				})
				.where(eq(characters.id, id))
				.returning();

			await fetchCharacters(); // 刷新列表

			if (result.length === 0) return null;
			const char = result[0];
			const typedChar: Character = {
				id: char.id,
				name: char.name || "",
				gender: char.gender || "",
				age: char.age,
				background: char.background,
				personality: char.personality,
				avatar_url: char.avatar_url,
				created_at: char.created_at || new Date(),
				updated_at: char.updated_at || new Date(),
			};

			return typedChar;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "更新角色失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 删除角色
	const deleteCharacter = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			// 获取角色信息以删除关联的头像
			const character = await getCharacterById(id);

			// 如果有头像，从存储中删除
			if (character && character.avatar_url) {
				const avatarPath = character.avatar_url.split("/").slice(-2).join("/");
				await supabase.storage.from("avatars").remove([avatarPath]);
			}

			await db.delete(characters).where(eq(characters.id, id));
			await fetchCharacters(); // 刷新列表
			return true;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "删除角色失败";
			setError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		uploadProgress,
		characters: characterList,
		fetchCharacters,
		getCharacterById,
		createCharacter,
		updateCharacter,
		deleteCharacter,
		uploadAvatar,
	};
}
