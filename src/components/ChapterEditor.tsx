import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState, useCallback } from "react";

// 工具栏按钮组件
const MenuButton = ({
	onClick,
	isActive = false,
	disabled = false,
	children,
}: {
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`p-2 rounded mr-1 ${
				isActive
					? "bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-800"
					: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
			} ${
				disabled
					? "opacity-50 cursor-not-allowed"
					: "hover:bg-gray-300 dark:hover:bg-gray-600"
			}`}
		>
			{children}
		</button>
	);
};

// 颜色选择器组件
const ColorSelector = ({ editor }: { editor: Editor | null }) => {
	const colors = [
		"#000000",
		"#ff0000",
		"#0000ff",
		"#008000",
		"#ffa500",
		"#800080",
	];

	return (
		<div className="flex items-center">
			{colors.map((color) => (
				<button
					key={color}
					onClick={() => editor?.chain().focus().setColor(color).run()}
					className="w-5 h-5 mr-1 rounded-full border border-gray-300"
					style={{ backgroundColor: color }}
				/>
			))}
		</div>
	);
};

interface ChapterEditorProps {
	initialContent?: string;
	onChange?: (html: string) => void;
}

const ChapterEditor = ({
	initialContent = "",
	onChange,
}: ChapterEditorProps) => {
	const [imageUrl, setImageUrl] = useState("");

	const editor = useEditor({
		extensions: [
			StarterKit,
			TextStyle,
			Color,
			Highlight,
			Underline,
			Image,
			Link.configure({
				openOnClick: false,
			}),
		],
		content: initialContent,
		onUpdate: ({ editor }) => {
			if (onChange) {
				onChange(editor.getHTML());
			}
		},
	});

	const addImage = useCallback(() => {
		if (imageUrl && editor) {
			editor.chain().focus().setImage({ src: imageUrl }).run();
			setImageUrl("");
		}
	}, [imageUrl, editor]);

	const setLink = useCallback(() => {
		if (editor) {
			const url = window.prompt("URL:");
			if (url === null) return;

			if (url === "") {
				editor.chain().focus().extendMarkRange("link").unsetLink().run();
				return;
			}

			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();
		}
	}, [editor]);

	if (!editor) {
		return <div>加载编辑器中...</div>;
	}

	return (
		<div className="border border-gray-300 rounded-md dark:border-gray-700 overflow-hidden">
			<div className="bg-gray-100 dark:bg-gray-800 p-2 flex flex-wrap items-center border-b border-gray-300 dark:border-gray-700">
				<MenuButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
				>
					<span className="font-bold">B</span>
				</MenuButton>

				<MenuButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
				>
					<span className="italic">I</span>
				</MenuButton>

				<MenuButton
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					isActive={editor.isActive("underline")}
				>
					<span className="underline">U</span>
				</MenuButton>

				<MenuButton
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					isActive={editor.isActive("highlight")}
				>
					<span className="bg-yellow-200 px-1">H</span>
				</MenuButton>

				<div className="mx-2 border-r border-gray-300 dark:border-gray-600 h-6"></div>

				<MenuButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					isActive={editor.isActive("heading", { level: 1 })}
				>
					H1
				</MenuButton>

				<MenuButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					isActive={editor.isActive("heading", { level: 2 })}
				>
					H2
				</MenuButton>

				<MenuButton
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					isActive={editor.isActive("heading", { level: 3 })}
				>
					H3
				</MenuButton>

				<div className="mx-2 border-r border-gray-300 dark:border-gray-600 h-6"></div>

				<MenuButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					isActive={editor.isActive("bulletList")}
				>
					• 列表
				</MenuButton>

				<MenuButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive("orderedList")}
				>
					1. 编号
				</MenuButton>

				<MenuButton
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
				>
					" 引用
				</MenuButton>

				<div className="mx-2 border-r border-gray-300 dark:border-gray-600 h-6"></div>

				<ColorSelector editor={editor} />

				<div className="mx-2 border-r border-gray-300 dark:border-gray-600 h-6"></div>

				<MenuButton onClick={setLink} isActive={editor.isActive("link")}>
					链接
				</MenuButton>

				<div className="ml-2 flex items-center">
					<input
						type="text"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						placeholder="图片URL"
						className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
					<MenuButton onClick={addImage} disabled={!imageUrl}>
						插入图片
					</MenuButton>
				</div>
			</div>

			<EditorContent
				editor={editor}
				className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[500px] h-auto bg-white dark:bg-gray-900"
			/>
		</div>
	);
};

export default ChapterEditor;
