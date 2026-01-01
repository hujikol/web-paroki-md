"use client";

import { useMemo, useRef, useState, useEffect } from "react";
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

  // Custom Image Handler
  const imageHandler = () => {
    setIsMediaModalOpen(true);
  };

  // Register Font
  useEffect(() => {
    const registerFormats = async () => {
        if (typeof window === "undefined") return;
        try {
            // Import the library dynamically to get the Quill class
            const { default: RQ } = await import("react-quill-new");
            // ReactQuill-new likely exposes Quill on the default export or simpler
            // But usually with react-quill v2+:
            const Quill = RQ.Quill; 
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

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': ['rubik', 'sans-serif'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const handleImageSelect = (path: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const position = range ? range.index : quill.getLength();
      quill.insertEmbed(position, "image", path);
      // Move cursor to next position
      quill.setSelection(position + 1);
    }
    setIsMediaModalOpen(false);
  };

  // No internal state for content to avoid synchronization loops
  // The editor is controlled by the 'value' prop from PostForm
  
  const handleEditorChange = (content: string, delta: any, source: any, editor: any) => {
    // Only notify parent if change is from user
    if (source === 'user') {
      const contents = editor.getContents();
      // Ensure we send a plain object to the parent for Server Actions
      const plainDelta = JSON.parse(JSON.stringify(contents));
      onChange(plainDelta);
    }
  };

  return (
    <div className="quill-editor-wrapper bg-white rounded-lg">
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
        /* Import Rubik if not already globally available or rely on global CSS var */
        
        .quill-editor-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          font-family: var(--font-rubik), sans-serif;
        }
        .quill-editor-wrapper .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: var(--font-rubik), sans-serif;
          font-size: 1rem;
        }
        .quill-editor-wrapper .ql-editor {
          min-height: 400px;
        }
        
        /* Font options in toolbar */
        .ql-font-rubik {
          font-family: var(--font-rubik), sans-serif;
        }
      `}</style>
    </div>
  );
}
