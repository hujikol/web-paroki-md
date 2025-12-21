import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export async function renderMarkdown(markdown: string): Promise<string> {
  // Sanitize input to prevent injection
  const sanitizedMarkdown = markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers

  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false }) // We pre-sanitize above
    .process(sanitizedMarkdown);

  return result.toString();
}
