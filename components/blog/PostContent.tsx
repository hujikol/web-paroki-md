"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css"; // Use bubble theme for clean look
import { useEffect } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

interface PostContentProps {
  content: any;
}

export default function PostContent({ content }: PostContentProps) {
  // Register Font for viewer as well
  useEffect(() => {
    const registerFonts = async () => {
        try {
            const { default: RQ } = await import("react-quill-new");
            const Quill = RQ.Quill;
            if (Quill) {
                const Font = Quill.import('formats/font') as any;
                Font.whitelist = ['rubik', 'sans-serif'];
                Quill.register(Font, true);
            }
        } catch (e) {}
    };
    registerFonts();
  }, []);

  return (
    <div className="quill-viewer-wrapper">
      <ReactQuill
        value={content}
        readOnly={true}
        theme="bubble"
        modules={{ toolbar: false }}
      />
      
      <style jsx global>{`
        .quill-viewer-wrapper .ql-container.ql-bubble {
          border: none;
          font-family: var(--font-rubik), sans-serif;
          font-size: 1.125rem;
          line-height: 1.75;
        }
        .quill-viewer-wrapper .ql-editor {
          padding: 0;
          color: inherit;
        }
        .quill-viewer-wrapper .ql-editor img {
          border-radius: 0.75rem;
          margin: 2rem auto;
          display: block;
        }
        .quill-viewer-wrapper .ql-editor iframe.ql-video {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 0.75rem;
          margin: 2rem 0;
        }
        /* Match Rubik class from editor */
        .ql-font-rubik {
          font-family: var(--font-rubik), sans-serif !important;
        }
      `}</style>
    </div>
  );
}
