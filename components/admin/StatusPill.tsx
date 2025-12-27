interface StatusPillProps {
  published: boolean;
}

export default function StatusPill({ published }: StatusPillProps) {
  const styles = published 
    ? { container: "bg-green-50 text-green-700 ring-green-600/20", dot: "fill-green-500", label: "Published" }
    : { container: "bg-yellow-50 text-yellow-800 ring-yellow-600/20", dot: "fill-yellow-500", label: "Draft" };

  return (
    <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles.container}`}>
      <svg className={`h-1.5 w-1.5 ${styles.dot}`} viewBox="0 0 6 6" aria-hidden="true">
        <circle cx="3" cy="3" r="3" />
      </svg>
      {styles.label}
    </span>
  );
}
