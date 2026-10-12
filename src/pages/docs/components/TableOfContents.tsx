interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0 not-prose">
      <div className="sticky top-28 lg:top-32 space-y-3 pl-4 border-l border-border/70 text-xs">
        <p className="font-mono uppercase tracking-wider text-foreground/40 font-semibold">
          On this page
        </p>
        <nav className="space-y-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block text-foreground/60 hover:text-foreground transition-colors leading-relaxed truncate"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};
