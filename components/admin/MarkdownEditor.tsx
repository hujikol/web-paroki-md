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
  linkPlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  UndoRedo,
  InsertTable,
  InsertImage,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  CodeToggle,
  HighlightToggle,
  CreateLink,
  StrikeThroughSupSubToggles
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState, useRef } from "react";
import MediaPickerModal from "./MediaPickerModal";
import Tooltip from "./Tooltip";
import { useFormStatus } from "react-dom";

// Standard Markdown doesn't support alignment, so we'll use HTML as the most compatible way
// with the existing remark-html renderer which allows raw HTML.
const TextAlignButtons = ({ onInsert }: { onInsert: (align: string) => void }) => {
  return (
    <div className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-1">
      <button
        type="button"
        onClick={() => onInsert('left')}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Align Left"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onInsert('center')}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Align Center"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onInsert('right')}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Align Right"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

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

  const handleAlign = (align: string) => {
    if (editorRef.current) {
        // We wrap selection in an HTML div with alignment
        // In MDXEditor, we can't easily get the current selection and wrap it without a plugin
        // but we can insert the tags around it if we use a hack or just insert the block.
        // For simplicity and compatibility, we'll insert a template block.
        editorRef.current.insertMarkdown(`\n\n<div align="${align}">\n\nWrite aligned text here...\n\n</div>\n\n`);
    }
  };

  return (
    <div className="mdx-editor-wrapper border rounded-lg bg-white transition-shadow flex flex-col h-full overflow-visible">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName="max-w-none p-4 min-h-[400px] outline-none"
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
          imagePlugin({}),
          linkPlugin(),
          linkDialogPlugin(),
          codeBlockPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-col w-full gap-2">
                {/* Row 1: Primary Formatting */}
                <div className="flex flex-wrap items-center gap-1">
                  <UndoRedo />
                  <Separator />
                  <BlockTypeSelect />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <HighlightToggle />
                  <Separator />
                  <ListsToggle />
                  <TextAlignButtons onInsert={handleAlign} />
                </div>
                
                {/* Row 2: Inserts and Advanced */}
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-gray-50">
                  <StrikeThroughSupSubToggles />
                  <Separator />
                  <InsertTable />
                  <CreateLink />
                  <InsertImage />
                  <InsertThematicBreak />
                  <Separator />
                  <Tooltip content="Insert from Media Library" position="bottom">
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-brand-blue hover:text-white border border-brand-blue/20 text-brand-blue rounded bg-brand-blue/5 transition-all active:scale-95 whitespace-nowrap"
                    >
                      Media Library
                    </button>
                  </Tooltip>
                </div>
              </div>
            )
          })
        ]}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .mdx-editor-wrapper [class*="_toolbarRoot"],
        .mdx-editor-wrapper .mdx-toolbar-container {
          overflow: visible !important;
          position: sticky !important;
          top: 136px !important;
          z-index: 10 !important;
          background: white !important;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          padding: 8px 12px !important;
        }

        .mdx-editor-wrapper [class*="_dropdownMenuContent"],
        .mdx-editor-wrapper [class*="_popoverContent"],
        .mdx-editor-wrapper [role="menu"],
        .mdx-editor-wrapper [role="listbox"] {
          z-index: 150 !important;
        }

        /* Visible formatting inside the editor */
        .mdx-editor-wrapper [contenteditable] {
          font-family: inherit;
        }
        .mdx-editor-wrapper [contenteditable] h1 { font-size: 2.25rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 1rem; color: #111827; }
        .mdx-editor-wrapper [contenteditable] h2 { font-size: 1.875rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.75rem; color: #1f2937; }
        .mdx-editor-wrapper [contenteditable] h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #374151; }
        .mdx-editor-wrapper [contenteditable] blockquote { 
          border-left: 4px solid #3b82f6; 
          padding-left: 1rem; 
          font-style: italic; 
          color: #4b5563; 
          margin: 1.5rem 0;
          background: #f9fafb;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .mdx-editor-wrapper [contenteditable] ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .mdx-editor-wrapper [contenteditable] ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .mdx-editor-wrapper [contenteditable] p { margin-bottom: 1rem; line-height: 1.6; }
        .mdx-editor-wrapper [contenteditable] code:not(pre code) {
          background-color: #f3f4f6;
          color: #ef4444;
          padding: 0.2rem 0.4rem;
          rounded: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }
      `}} />

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
