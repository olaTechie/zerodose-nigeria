// EditorialBlock — semantic <article> block for editorial body content.
// Per design brief §6: optional 1 px top hairline rule in neutral-300, no fill,
// no shadow, no backdrop blur. Variant `inset` adds a 2 px gold left rule for
// callouts. Replaces the legacy GlassCard.
export default function EditorialBlock({
  children,
  className = '',
  style,
  variant = 'default',
  hairline = true,
  ...props
}) {
  const baseClass = hairline ? 'border-t border-neutral-200 pt-6 pb-6' : 'pt-6 pb-6';
  const insetStyle =
    variant === 'inset'
      ? { borderLeft: '2px solid #cc8400', paddingLeft: '1.25rem' }
      : null;
  return (
    <article
      className={`${baseClass} ${className}`.trim()}
      style={{ ...insetStyle, ...style }}
      {...props}
    >
      {children}
    </article>
  );
}
