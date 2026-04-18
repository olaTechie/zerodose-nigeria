import { useState, useMemo } from 'react';
import SiteNav from '../components/shared/SiteNav';
import PageHeader from '../components/shared/PageHeader';
import { getSortedGlossary } from '../data/glossary';

// Glossary route — flat alphabetical list of every term in the GLOSSARY registry,
// rendered as a definition list with anchor links and a search filter.
// Per design brief Section 7: every acronym has a canonical definition.

const SEARCH_STYLE = {
  width: '100%',
  maxWidth: '420px',
  padding: '0.55rem 0.75rem',
  fontSize: '0.9375rem',
  border: '1px solid #c7cfc7',
  borderRadius: '4px',
  fontFamily: 'inherit',
  marginBottom: '2rem',
  background: '#ffffff',
  color: '#1c211d',
};

const TERM_STYLE = {
  fontFamily: '"Source Serif 4", ui-serif, Georgia, serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#1c211d',
  margin: '0 0 0.25rem 0',
};

const EXPANSION_STYLE = {
  fontSize: '0.8125rem',
  color: '#697269',
  margin: '0 0 0.4rem 0',
  fontStyle: 'italic',
};

const DEFINITION_STYLE = {
  fontSize: '1rem',
  color: '#1c211d',
  lineHeight: 1.6,
  margin: '0 0 1.75rem 0',
  maxWidth: '60ch',
};

const ENTRY_STYLE = {
  paddingTop: '1.25rem',
  borderTop: '1px solid #c7cfc7',
  marginTop: '1.25rem',
};

export default function Glossary() {
  const [query, setQuery] = useState('');
  const all = useMemo(() => getSortedGlossary(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((e) =>
      [e.term, e.expansion, e.definition].filter(Boolean).some((s) => s.toLowerCase().includes(q))
    );
  }, [all, query]);

  return (
    <div style={{ background: '#fbfcfb', minHeight: '100vh' }}>
      <SiteNav activePage="methods" />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader
          title="Glossary"
          subtitle="Every acronym, statistical term, and intervention shorthand used on this site."
        />

        <input
          type="search"
          placeholder="Filter terms…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search glossary"
          style={SEARCH_STYLE}
        />

        {filtered.length === 0 && (
          <p style={{ color: '#697269', fontSize: '0.9375rem' }}>
            No terms match &ldquo;{query}&rdquo;.
          </p>
        )}

        <dl style={{ margin: 0 }}>
          {filtered.map((entry, idx) => (
            <div
              key={entry.id}
              id={entry.id}
              style={idx === 0 ? { ...ENTRY_STYLE, borderTop: 'none', marginTop: 0, paddingTop: 0 } : ENTRY_STYLE}
            >
              <dt>
                <a
                  href={`#${entry.id}`}
                  style={{ ...TERM_STYLE, display: 'block', textDecoration: 'none', color: '#1c211d' }}
                >
                  {entry.term}
                </a>
                {entry.expansion && <div style={EXPANSION_STYLE}>{entry.expansion}</div>}
              </dt>
              <dd style={DEFINITION_STYLE}>{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
