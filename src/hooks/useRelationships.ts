import { useState } from "react";
import { db } from "@/db/client";
import { character_relationships } from "@/db/schema";
import { eq, or, and } from "drizzle-orm";

export interface Relationship {
	id: number;
	character1_id: number;
	character2_id: number;
	relationship_type: string;
	description: string | null;
	created_at: Date;
}

export interface CreateRelationshipData {
	character1_id: number;
	character2_id: number;
	relationship_type: string;
	description?: string;
}

export interface UpdateRelationshipData {
	relationship_type?: string;
	description?: string | null;
}

export function useRelationships() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [relationshipList, setRelationshipList] = useState<Relationship[]>([]);

	// 获取所有关系
	const fetchRelationships = async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await db.select().from(character_relationships);

			// 处理可能为null的字段，确保符合Relationship接口要求
			const typedResult: Relationship[] = result.map((relationship) => ({
				id: relationship.id,
				character1_id: relationship.character1_id ?? 0,
				character2_id: relationship.character2_id ?? 0,
				relationship_type: relationship.relationship_type || "",
				description: relationship.description,
				created_at: relationship.created_at || new Date(),
			}));

			setRelationshipList(typedResult);
			return typedResult;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取角色关系列表失败";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	// 获取特定角色的所有关系
	const fetchCharacterRelationships = async (characterId: number) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.select()
				.from(character_relationships)
				.where(
					or(
						eq(character_relationships.character1_id, characterId),
						eq(character_relationships.character2_id, characterId)
					)
				);

			// 处理可能为null的字段，确保符合Relationship接口要求
			const typedResult: Relationship[] = result.map((relationship) => ({
				id: relationship.id,
				character1_id: relationship.character1_id ?? 0,
				character2_id: relationship.character2_id ?? 0,
				relationship_type: relationship.relationship_type || "",
				description: relationship.description,
				created_at: relationship.created_at || new Date(),
			}));

			setRelationshipList(typedResult);
			return typedResult;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取角色关系列表失败";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	// 通过ID获取单个关系
	const getRelationshipById = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.select()
				.from(character_relationships)
				.where(eq(character_relationships.id, id));

			if (result.length === 0) return null;

			const relationship = result[0];
			const typedRelationship: Relationship = {
				id: relationship.id,
				character1_id: relationship.character1_id ?? 0,
				character2_id: relationship.character2_id ?? 0,
				relationship_type: relationship.relationship_type || "",
				description: relationship.description,
				created_at: relationship.created_at || new Date(),
			};

			return typedRelationship;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "获取角色关系详情失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 检查两个角色之间是否已存在关系
	const checkRelationshipExists = async (
		character1Id: number,
		character2Id: number
	) => {
		try {
			const result = await db
				.select()
				.from(character_relationships)
				.where(
					or(
						and(
							eq(character_relationships.character1_id, character1Id),
							eq(character_relationships.character2_id, character2Id)
						),
						and(
							eq(character_relationships.character1_id, character2Id),
							eq(character_relationships.character2_id, character1Id)
						)
					)
				);

			return result.length > 0;
		} catch (err) {
			console.error("检查角色关系失败:", err);
			return false;
		}
	};

	// 创建新关系
	const createRelationship = async (data: CreateRelationshipData) => {
		setLoading(true);
		setError(null);
		try {
			// 检查是否已存在关系
			const exists = await checkRelationshipExists(
				data.character1_id,
				data.character2_id
			);
			if (exists) {
				setError("这两个角色之间已存在关系");
				return null;
			}

			const result = await db
				.insert(character_relationships)
				.values({
					character1_id: data.character1_id,
					character2_id: data.character2_id,
					relationship_type: data.relationship_type,
					description: data.description || null,
					created_at: new Date(),
				})
				.returning();

			await fetchRelationships(); // 刷新列表

			if (result.length === 0) return null;

			const relationship = result[0];
			const typedRelationship: Relationship = {
				id: relationship.id,
				character1_id: relationship.character1_id ?? 0,
				character2_id: relationship.character2_id ?? 0,
				relationship_type: relationship.relationship_type || "",
				description: relationship.description,
				created_at: relationship.created_at || new Date(),
			};

			return typedRelationship;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "创建角色关系失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 更新关系
	const updateRelationship = async (
		id: number,
		data: UpdateRelationshipData
	) => {
		setLoading(true);
		setError(null);
		try {
			const result = await db
				.update(character_relationships)
				.set({
					...data,
				})
				.where(eq(character_relationships.id, id))
				.returning();

			await fetchRelationships(); // 刷新列表

			if (result.length === 0) return null;

			const relationship = result[0];
			const typedRelationship: Relationship = {
				id: relationship.id,
				character1_id: relationship.character1_id ?? 0,
				character2_id: relationship.character2_id ?? 0,
				relationship_type: relationship.relationship_type || "",
				description: relationship.description,
				created_at: relationship.created_at || new Date(),
			};

			return typedRelationship;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "更新角色关系失败";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	// 删除关系
	const deleteRelationship = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			await db
				.delete(character_relationships)
				.where(eq(character_relationships.id, id));
			await fetchRelationships(); // 刷新列表
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "删除角色关系失败";
			setError(errorMessage);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		relationships: relationshipList,
		fetchRelationships,
		fetchCharacterRelationships,
		getRelationshipById,
		checkRelationshipExists,
		createRelationship,
		updateRelationship,
		deleteRelationship,
	};
}
