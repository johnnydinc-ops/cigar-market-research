'use client';

import { useEffect } from 'react';

type Section = { id: string; title: string };

export function ReportShell({
  children,
  sections,
}: {
  children: React.ReactNode;
  sections: Section[];
}) {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <nav>
          <div style={{ padding: '0 0.6rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Contents
          </div>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
      </aside>
      {children}
    </div>
  );
}
