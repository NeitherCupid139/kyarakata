import { useState } from "react";
import { supabase } from "@/lib/supabase";

// 定义世界观设定类型
export interface WorldSetting {
	id: number;
	novel_id: number;
	title: string;
	description: string;
	rules: string;
	background: string;
	history: string;
	geography: string;
	culture: string;
	magic_system: string;
	technology: string;
	created_at: string;
	updated_at: string;
}

// 创建新世界观设定的参数
export interface CreateWorldSettingParams {
	novel_id: number;
	title: string;
	description?: string;
	rules?: string;
	background?: string;
	history?: string;
	geography?: string;
	culture?: string;
	magic_system?: string;
	technology?: string;
}

// 更新世界观设定的参数
export interface UpdateWorldSettingParams {
	title?: string;
	description?: string;
	rules?: string;
	background?: string;
	history?: string;
	geography?: string;
	culture?: string;
	magic_system?: string;
	technology?: string;
}

interface ErrorWithMessage {
	message: string;
}

export const useWorldSettings = () => {
	const [worldSettings, setWorldSettings] = useState<WorldSetting[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 获取所有世界观设定
	const fetchWorldSettings = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("world_settings")
				.select("*")
				.order("title");

			if (error) throw error;
			setWorldSettings(data || []);
		} catch (err: unknown) {
			console.error("获取世界观设定失败:", err);
			setError((err as ErrorWithMessage).message || "未知错误");

			// 提供示例数据用于开发
			setWorldSettings([
				{
					id: 1,
					novel_id: 1,
					title: "三国演义世界观",
					description: "东汉末年的乱世",
					rules: "兵法、计谋与武力",
					background: "东汉末年，朝纲混乱，各地军阀割据",
					history: "自黄巾起义开始，到司马氏统一三国",
					geography: "以长江为界，北方中原、南方江东，西部蜀地",
					culture: "儒家思想为主，重视忠义",
					magic_system: "",
					technology: "司南、木牛流马等",
					created_at: "2023-01-01T00:00:00Z",
					updated_at: "2023-01-01T00:00:00Z",
				},
				{
					id: 2,
					novel_id: 2,
					title: "水浒传世界观",
					description: "北宋末年的乱世英雄",
					rules: "江湖规矩、武林门派",
					background: "北宋末年，朝廷腐败，民不聊生",
					history: "从梁山好汉聚义，到受招安征讨方腊",
					geography: "以梁山为中心，辐射周边州府",
					culture: "义气当先，兄弟情深",
					magic_system: "",
					technology: "古代冷兵器",
					created_at: "2023-02-01T00:00:00Z",
					updated_at: "2023-02-01T00:00:00Z",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	// 根据小说ID获取世界观设定
	const fetchWorldSettingsByNovelId = async (novelId: number) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("world_settings")
				.select("*")
				.eq("novel_id", novelId)
				.order("title");

			if (error) throw error;
			setWorldSettings(data || []);
		} catch (err: unknown) {
			console.error(`获取小说 ${novelId} 的世界观设定失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");

			// 提供示例数据
			if (novelId === 1) {
				setWorldSettings([
					{
						id: 1,
						novel_id: 1,
						title: "三国演义世界观",
						description: "东汉末年的乱世",
						rules: "兵法、计谋与武力",
						background: "东汉末年，朝纲混乱，各地军阀割据",
						history: "自黄巾起义开始，到司马氏统一三国",
						geography: "以长江为界，北方中原、南方江东，西部蜀地",
						culture: "儒家思想为主，重视忠义",
						magic_system: "",
						technology: "司南、木牛流马等",
						created_at: "2023-01-01T00:00:00Z",
						updated_at: "2023-01-01T00:00:00Z",
					},
				]);
			} else {
				setWorldSettings([]);
			}
		} finally {
			setLoading(false);
		}
	};

	// 获取单个世界观设定
	const fetchWorldSettingById = async (id: number) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("world_settings")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;
			return data as WorldSetting;
		} catch (err: unknown) {
			console.error(`获取世界观设定 ${id} 失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 创建世界观设定
	const createWorldSetting = async (params: CreateWorldSettingParams) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("world_settings")
				.insert([
					{
						...params,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					},
				])
				.select();

			if (error) throw error;

			setWorldSettings([...worldSettings, data[0] as WorldSetting]);
			return data[0] as WorldSetting;
		} catch (err: unknown) {
			console.error("创建世界观设定失败:", err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 更新世界观设定
	const updateWorldSetting = async (
		id: number,
		params: UpdateWorldSettingParams
	) => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("world_settings")
				.update({ ...params, updated_at: new Date().toISOString() })
				.eq("id", id)
				.select();

			if (error) throw error;

			setWorldSettings(
				worldSettings.map((setting) =>
					setting.id === id
						? { ...setting, ...params, updated_at: new Date().toISOString() }
						: setting
				)
			);

			return data[0] as WorldSetting;
		} catch (err: unknown) {
			console.error(`更新世界观设定 ${id} 失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// 删除世界观设定
	const deleteWorldSetting = async (id: number) => {
		try {
			setLoading(true);
			setError(null);

			const { error } = await supabase
				.from("world_settings")
				.delete()
				.eq("id", id);

			if (error) throw error;

			setWorldSettings(worldSettings.filter((setting) => setting.id !== id));
		} catch (err: unknown) {
			console.error(`删除世界观设定 ${id} 失败:`, err);
			setError((err as ErrorWithMessage).message || "未知错误");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		worldSettings,
		loading,
		error,
		fetchWorldSettings,
		fetchWorldSettingsByNovelId,
		fetchWorldSettingById,
		createWorldSetting,
		updateWorldSetting,
		deleteWorldSetting,
	};
};
