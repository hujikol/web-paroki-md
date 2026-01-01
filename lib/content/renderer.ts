import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export async function renderContent(content: any): Promise<string> {
  if (!content) return "";

  let deltaOps = null;

  // Case 1: content is already an object
  if (typeof content === 'object' && content !== null) {
    if (Array.isArray(content.ops)) {
      deltaOps = content.ops;
    } else if (Array.isArray(content)) {
      deltaOps = content;
    }
  }

  // Case 2: content is a string (could be stringified JSON or plain text)
  if (!deltaOps && typeof content === 'string') {
    const trimmed = content.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.ops && Array.isArray(parsed.ops)) {
          deltaOps = parsed.ops;
        } else if (Array.isArray(parsed)) {
          deltaOps = parsed;
        }
      } catch (e) {
        // Not valid JSON, treat as plain string
      }
    }
  }

  // If we found Delta operations, convert them to HTML
  if (deltaOps && Array.isArray(deltaOps)) {
    try {
      const converter = new QuillDeltaToHtmlConverter(deltaOps, {
        inlineStyles: true,
        multiLineBlockquote: true,
        multiLineParagraph: true,
        multiLineHeader: true,
      });
      return converter.convert();
    } catch (error) {
      console.error("Delta to HTML conversion failed:", error);
      // Fallback to rawContent or empty
    }
  }

  // Final fallback: return as string if it is one, otherwise empty
  return typeof content === 'string' ? content : "";
}
