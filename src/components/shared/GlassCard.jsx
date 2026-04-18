// EditorialBlock — transitional shim for the legacy GlassCard import.
// /quieter strips the glass chrome (no backdrop blur, no shadow, no rounded fill);
// /distill will rename this to EditorialBlock and remove this shim.
// Renders as a semantic <article> with an optional 1 px top hairline and standard padding.
export default function GlassCard({ children, className = '', style, ...props }) {
  return (
    <article
      className={`border-t border-neutral-200 pt-6 pb-6 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </article>
  );
}
