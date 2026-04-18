import SourceMark from './SourceMark';

// MetricWithCI — render a numeric metric followed by an optional confidence
// interval, per design brief Section 7 (inline-CI rendering convention).
//
// Examples:
//   <MetricWithCI value="90.7" suffix="%" ciLow="90.3" ciHigh="91.1" />
//     -> 90.7% (95% CI 90.3 – 91.1)
//
//   <MetricWithCI value="82.0" suffix="%" ciLow="81.6" ciHigh="82.4" kind="CrI" />
//     -> 82.0% (95% CrI 81.6 – 82.4)
//
//   <MetricWithCI value="0.943" prefix="r = " ciLow="0.918" ciHigh="0.961" />
//     -> r = 0.943 (95% CI 0.918 – 0.961)
//
// Always renders in tabular numerals, with spaces around the en-dash, and
// embeds a SourceMark when `sourceId` is provided.
//
// Props:
//   value, ciLow, ciHigh — strings or numbers (rendered as-is)
//   prefix, suffix       — optional flanking strings
//   kind                 — "CI" (default) or "CrI" (Bayesian credible)
//   sourceId             — optional id from sources.js
//   inline               — if true, render as <span> instead of <span style="display:inline-block">

export default function MetricWithCI({
  value,
  ciLow,
  ciHigh,
  prefix = '',
  suffix = '',
  kind = 'CI',
  sourceId,
  inline = true,
  className,
}) {
  if (value == null || value === '') return null;

  const Wrapper = inline ? 'span' : 'div';

  const renderedValue = `${prefix}${value}${suffix}`;
  const hasCi = ciLow != null && ciHigh != null && ciLow !== '' && ciHigh !== '';

  return (
    <Wrapper
      className={className}
      style={{
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}
    >
      {renderedValue}
      {hasCi && (
        <span style={{ color: '#697269', marginLeft: '0.4em' }}>
          {`(95% ${kind} ${ciLow}${suffix} \u2013 ${ciHigh}${suffix})`}
        </span>
      )}
      {sourceId && <SourceMark id={sourceId} />}
    </Wrapper>
  );
}
