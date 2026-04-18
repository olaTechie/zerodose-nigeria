// StaticFigure — transitional shim for the legacy CountUpNumber import.
// Per design brief §6: render the final number on first paint (no count-up animation),
// in tabular numerals so digits don't jiggle. /distill will rename to StaticFigure.
export default function CountUpNumber({ target, prefix = '', suffix = '', decimals = 0 }) {
  const numTarget =
    typeof target === 'string'
      ? parseFloat(target.replace(/[^0-9.-]/g, ''))
      : target;
  const value = Number.isFinite(numTarget) ? numTarget.toFixed(decimals) : String(target);
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
