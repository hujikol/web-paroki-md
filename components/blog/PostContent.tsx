interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
