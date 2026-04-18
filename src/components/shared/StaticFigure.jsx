// StaticFigure — final-state numeric display in tabular numerals.
// Per design brief §6: render the final number on first paint (no count-up animation),
// reduced-motion compliant by construction. Replaces legacy CountUpNumber.
export default function StaticFigure({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  weight = 600,
  ariaLabel,
}) {
  const numeric =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.\-]/g, ''))
      : value;
  const display = Number.isFinite(numeric) ? numeric.toFixed(decimals) : String(value);
  const text = `${prefix}${display}${suffix}`;
  return (
    <span
      style={{ fontVariantNumeric: 'tabular-nums', fontWeight: weight }}
      aria-label={ariaLabel || text}
    >
      {text}
    </span>
  );
}
