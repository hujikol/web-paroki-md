"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  imagePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  UndoRedo,
  InsertTable,
  InsertImage,
  InsertThematicBreak
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState, useRef } from "react";
import MediaPickerModal from "./MediaPickerModal";
import { useFormStatus } from "react-dom";

// Helper to insert image into editor
// We can't access the editor instance easily from outside without a ref or custom plugin
// But MDXEditor exposes a ref that has manipulation methods? Not fully.
// However, we can use the `ref` prop to get access to `insertMarkdown` or similar.
// Let's rely on standard image plugin for now, and a custom button for Media Picker?
// Actually, let's keep it simple: Standard MDXEditor for writing. 
// For images, we can use the `imageUploadHandler` to support drag/drop.
// For picking existing, we can add a button ABOVE the editor "Insert Media" which appends to the markdown?
// Or we can try to customize the toolbar.

interface MarkdownEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export default function MarkdownEditor({ markdown, onChange }: MarkdownEditorProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const editorRef = useRef<any>(null); // MDXEditor type ref

  const handleImageSelect = (path: string) => {
    if (editorRef.current) {
        editorRef.current.insertMarkdown(`![Image](${path})`);
    } else {
        onChange(markdown + `\n![Image](${path})`);
    }
    setIsMediaModalOpen(false);
  };

  return (
    <div className="mdx-editor-wrapper border rounded-lg overflow-hidden bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-brand-blue transition-shadow flex flex-col h-full">
      <div className="bg-gray-50 border-b p-2 flex justify-between items-center">
         <span className="text-xs font-bold text-gray-500 uppercase">Content Editor</span>
         <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="flex items-center gap-1 text-xs font-medium text-brand-blue hover:underline"
         >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Media Library
         </button>
      </div>

      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName="prose dark:prose-invert max-w-none p-4 min-h-[400px] outline-none"
        // The toolbar plugin adds a toolbar in the DOM. We can target it via CSS in global or simpler: 
        // We can't easily control the toolbar DOM node classes here without custom CSS.
        // However, we can wrap the MDXEditor in a sticky container for the toolbar? 
        // No, the toolbar is part of the editor structure usually at top.
        // Let's rely on standard flow but ensure z-index is lower than Header.
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin({
             // No upload handler for now, we rely on the Media Library button + simple url input if needed
             // Or we could implement a basic one that auto-uploads to 'inline'
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <InsertTable />
                <InsertImage />
                <InsertThematicBreak />
              </>
            )
          })
        ]}
      />

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
