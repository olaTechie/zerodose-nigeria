import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line as d3Line, curveMonotoneX } from 'd3-shape';

/**
 * TrustDynamicsChart — Story Act 3 inset.
 *
 * Two synthetic 60-month trust-score trajectories illustrating how trust
 * evolves under the status-quo (S0) versus the full intervention package
 * (S5). Numbers are illustrative — derived from the LCA-anchored class
 * proportions in `outputs/stage1/ml_to_abm_params.json` (Willing 0.95,
 * Hesitant 0.49, Refusing 0.06; weighted to ~0.45 baseline mean trust).
 *
 * Choreography:
 *   - On viewport entry, both lines pen-stroke in (S0 first, then S5
 *     180 ms later), mirroring the TrajectoryChart Act 4 idiom.
 *   - prefers-reduced-motion: render both lines at final state.
 */

// 60-month trust-score curves (illustrative, anchored on LCA proportions).
const MONTHS = 60;

function buildSeries(start, target, k) {
  // Logistic-style approach to `target` from `start`; k controls steepness.
  const out = [];
  for (let m = 1; m <= MONTHS; m++) {
    const t = m / MONTHS;
    const sig = 1 / (1 + Math.exp(-k * (t - 0.5)));
    out.push(start + (target - start) * sig);
  }
  return out;
}

const S0_TRUST = buildSeries(0.45, 0.50, 4); // status quo: trust drifts gently
const S5_TRUST = buildSeries(0.45, 0.78, 6); // full package: trust climbs

export default function TrustDynamicsChart({ height = 260 }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [dims, setDims] = useState({ width: 480, height });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width, height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [height]);

  useEffect(() => {
    if (reduceMotion || hasAnimatedRef.current) return undefined;
    const node = containerRef.current;
    if (!node) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          hasAnimatedRef.current = true;
          setShouldAnimate(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!svgRef.current) return;
    const { width, height: h } = dims;
    const margin = { top: 20, right: 90, bottom: 36, left: 44 };
    const w = width - margin.left - margin.right;
    const ch = h - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', h);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleLinear().domain([1, MONTHS]).range([0, w]);
    const y = scaleLinear().domain([0, 1]).range([ch, 0]);

    g.append('g')
      .attr('transform', `translate(0,${ch})`)
      .call(axisBottom(x).ticks(5).tickFormat((d) => `M${d}`))
      .selectAll('text').style('font-size', '10px');

    g.append('g')
      .call(axisLeft(y).ticks(4).tickFormat((d) => d.toFixed(1)))
      .selectAll('text').style('font-size', '10px');

    g.selectAll('.grid')
      .data(y.ticks(4))
      .enter()
      .append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', '#f0f0f0').attr('stroke-width', 0.5);

    const lineGen = d3Line()
      .x((_, i) => x(i + 1))
      .y((d) => y(d))
      .curve(curveMonotoneX);

    const willAnimate = !reduceMotion && shouldAnimate;

    function drawSeries(series, color, dashed, idx, label) {
      const path = g.append('path')
        .datum(series)
        .attr('d', lineGen)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');
      if (dashed) path.attr('stroke-dasharray', '5,3');

      if (willAnimate) {
        const total = path.node()?.getTotalLength?.() ?? 0;
        if (total > 0) {
          const baseDash = dashed ? '5,3' : null;
          path
            .attr('stroke-dasharray', `${total} ${total}`)
            .attr('stroke-dashoffset', total)
            .transition()
            .delay(idx * 200)
            .duration(900)
            .ease((t) => t)
            .attr('stroke-dashoffset', 0)
            .on('end', function endStroke() {
              select(this).attr('stroke-dasharray', baseDash);
            });
        }
      }

      const lastVal = series[series.length - 1];
      const lab = g.append('text')
        .attr('x', w + 4)
        .attr('y', y(lastVal) + 4)
        .style('font-size', '10px')
        .style('fill', color)
        .style('font-weight', 600)
        .text(`${label} ${lastVal.toFixed(2)}`);
      if (willAnimate) {
        lab.attr('opacity', 0)
          .transition().delay(idx * 200 + 700).duration(250).attr('opacity', 1);
      }
    }

    // S0 first (dashed muted), then S5 (solid green).
    drawSeries(S0_TRUST, '#697269', true, 0, 'S0');
    drawSeries(S5_TRUST, '#006633', false, 1, 'S5');

    g.append('text')
      .attr('x', w / 2)
      .attr('y', ch + 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#78909c')
      .text('Month');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -ch / 2)
      .attr('y', -32)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#78909c')
      .text('Mean trust score');
  }, [dims, shouldAnimate, reduceMotion]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} role="img" aria-label="Trust score evolution under status quo S0 versus full intervention package S5 over 60 months" />
    </div>
  );
}
