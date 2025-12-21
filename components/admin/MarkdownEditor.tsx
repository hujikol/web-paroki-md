"use client";

import { useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => insertMarkdown("**", "**")}
          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-semibold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("*", "*")}
          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("## ", "")}
          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("[", "](url)")}
          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("![alt](", ")")}
          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
          title="Image"
        >
          🖼️
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("```\n", "\n```")}
          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
          title="Code Block"
        >
          &lt;/&gt;
        </button>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      {showPreview ? (
        <div className="p-4 prose dark:prose-invert max-w-none min-h-[400px] bg-white dark:bg-gray-900">
          <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br>") }} />
        </div>
      ) : (
        <textarea
          id="markdown-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 min-h-[400px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-y focus:outline-none"
          placeholder="Write your post content in markdown..."
        />
      )}
    </div>
  );
}
