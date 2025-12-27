import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdown(markdown: string): Promise<string> {
  // Post-sanitize input but maintain safe tags
  const sanitizedMarkdown = markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  // Pre-process highlighting syntax: ==text== -> <mark>text</mark>
  let processedMarkup = sanitizedMarkdown
    .replace(/==([^=]+)==/g, '<mark>$1</mark>');

  // Ensure HTML blocks have double newlines around them so Remark parses internal content
  // We use extra newlines inside the div to guarantee the parser triggers on the content
  processedMarkup = processedMarkup
    .replace(/(<div align="[^"]+">)/g, '\n\n$1\n\n')
    .replace(/(<\/div>)/g, '\n\n$1\n\n');

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(processedMarkup);

  return String(file);
}
