import KeyFigure from './KeyFigure';

// KeyFiguresList — secondary panel of editorial key figures.
// Per design brief §6: a <dl> rendered inline below the hero standfirst, with
// 1 px vertical rules in neutral-300 between items. No box, no background.
//
// Items: [{ label, value, sublabel?, color?, source? }]
export default function KeyFiguresList({ items, columns = 'auto-fit', gap = '0' }) {
  const tmpl =
    columns === 'auto-fit'
      ? 'repeat(auto-fit, minmax(170px, 1fr))'
      : `repeat(${columns}, minmax(0, 1fr))`;

  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: tmpl,
        gap,
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item, idx) => (
        <div
          key={item.label}
          style={{
            paddingInline: idx === 0 ? '0 1.25rem' : '1.25rem',
            borderLeft: idx === 0 ? 'none' : '1px solid #c7cfc7',
          }}
          className="key-figures-list-item"
        >
          <KeyFigure
            label={item.label}
            value={item.value}
            sublabel={item.sublabel}
            color={item.color || 'green'}
            source={item.source}
            size={item.size || 'md'}
          />
        </div>
      ))}
      <style>{`
        @media (max-width: 720px) {
          .key-figures-list-item {
            border-left: none !important;
            padding-inline: 0 !important;
            border-top: 1px solid #c7cfc7;
            padding-top: 1rem;
            padding-bottom: 0.5rem;
          }
        }
      `}</style>
    </dl>
  );
}
