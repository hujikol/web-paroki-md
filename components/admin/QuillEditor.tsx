"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import MediaPickerModal from "./MediaPickerModal";

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

interface QuillEditorProps {
  value: any; // Delta or string
  onChange: (value: any) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const quillRef = useRef<any>(null);

  // Use a ref for the latest onChange to avoid closure issues in the stable modules object
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Image handler that opens the modal
  const imageHandler = useCallback(() => {
    setIsMediaModalOpen(true);
  }, []);

  // Register Font and other formats
  useEffect(() => {
    const registerFormats = async () => {
      if (typeof window === "undefined") return;
      try {
        const { default: RQ } = await import("react-quill-new");
        const Quill = (RQ as any).Quill;
        if (Quill) {
          const Font = Quill.import('formats/font') as any;
          Font.whitelist = ['rubik', 'sans-serif'];
          Quill.register(Font, true);
        }
      } catch (error) {
        console.error("Failed to register Quill formats", error);
      }
    };
    registerFormats();
  }, []);

  // Memoize modules to avoid toolbar disappearing/re-rendering
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': ['rubik', 'sans-serif'] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
        ['image', 'video', 'link'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const handleImageSelect = (path: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      // Focus the editor first to make sure we have a selection or it goes to the end
      quill.focus();
      const range = quill.getSelection();
      const position = range ? range.index : quill.getLength();

      // Insert the image
      quill.insertEmbed(position, "image", path, "user");

      // Move cursor to next position
      quill.setSelection(position + 1, 0, "user");

      // CRITICAL: Manually trigger the parent update because source is 'api' (implicitly) 
      // or even with 'user', we want to be absolutely sure the parent state is updated
      // before the modal closure triggers a re-render.
      const contents = quill.getContents();
      onChangeRef.current(JSON.parse(JSON.stringify(contents)));
    }
    setIsMediaModalOpen(false);
  };

  const handleEditorChange = (content: string, delta: any, source: any, editor: any) => {
    // Notify parent for user changes. 
    // Manual insertions via API in handleImageSelect will call onChange manually.
    if (source === 'user') {
      const contents = editor.getContents();
      const plainDelta = JSON.parse(JSON.stringify(contents));
      onChangeRef.current(plainDelta);
    }
  };

  return (
    <div className="quill-editor-wrapper bg-white rounded-lg border border-gray-200 shadow-sm">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || { ops: [] }}
        onChange={handleEditorChange}
        modules={modules}
      />

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleImageSelect}
      />

      <style jsx global>{`
        .quill-editor-wrapper .ql-toolbar {
          border: none;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          font-family: var(--font-rubik), sans-serif;
          padding: 8px;
          position: sticky;
          top: 152px;
          z-index: 50;
          border-radius: 0.5rem 0.5rem 0 0;
          margin-top: -1px;
        }
        /* Extension to prevent content from leaking through rounded corners when sticky */
        .quill-editor-wrapper .ql-toolbar::after {
          content: "";
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 9px;
          background: #ffffff;
          z-index: 1;
          display: block;
          border: 0px 2px solid #ffffff;
        }
        .quill-editor-wrapper .ql-container {
          border: none;
          font-family: var(--font-rubik), sans-serif;
          font-size: 1rem;
          min-height: 400px;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        .quill-editor-wrapper .ql-editor {
          min-height: 400px;
          padding: 2rem;
          line-height: 1.6;
        }
        .quill-editor-wrapper .ql-editor img {
            border-radius: 0.5rem;
            margin: 1rem 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .ql-font-rubik {
          font-family: var(--font-rubik), sans-serif;
        }
      `}</style>
    </div>
  );
}
