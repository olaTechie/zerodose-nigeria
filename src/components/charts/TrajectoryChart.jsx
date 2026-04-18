import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line as d3Line } from 'd3-shape';
import { SCENARIO_COLOURS } from '../../data/constants';

/**
 * Multi-line trajectory chart showing coverage over 60 months.
 * Each line corresponds to a scenario+typology combination.
 * Optionally shows 80% target line and uncertainty bands.
 *
 * Scroll choreography (Story Act 4 / Act 3 trust dynamics):
 *   `animated` (default true) — each scenario line draws in as a pen-stroke
 *   (stroke-dashoffset → 0) the first time the chart enters the viewport,
 *   staggered 180 ms between scenarios. The 80% target line draws last.
 *   `prefers-reduced-motion: reduce` collapses to instant render.
 */
export default function TrajectoryChart({
  trajectories = {},
  selectedScenarios = ['S0', 'S1', 'S5'],
  typology = 'Reference',
  showTarget = true,
  customTrajectory,
  customLabel,
  height = 350,
  animated = true,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [dims, setDims] = useState({ width: 600, height });
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
    if (!animated || reduceMotion || hasAnimatedRef.current) return undefined;
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
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [animated, reduceMotion]);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height: h } = dims;
    const margin = { top: 15, right: 120, bottom: 40, left: 50 };
    const w = width - margin.left - margin.right;
    const ch = h - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', h);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleLinear().domain([1, 60]).range([0, w]);
    const y = scaleLinear().domain([0, 1]).range([ch, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${ch})`)
      .call(axisBottom(x).ticks(6).tickFormat((d) => `M${d}`))
      .selectAll('text')
      .style('font-size', '10px');

    g.append('g')
      .call(axisLeft(y).ticks(5).tickFormat((d) => `${(d * 100).toFixed(0)}%`))
      .selectAll('text')
      .style('font-size', '10px');

    // Grid lines
    g.selectAll('.grid-line')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', '#f0f0f0')
      .attr('stroke-width', 0.5);

    const willAnimate = animated && !reduceMotion && shouldAnimate;
    const totalScenarios = selectedScenarios.length;

    const lineGen = d3Line()
      .x((_, i) => x(i + 1))
      .y((d) => y(d));

    const typSuffix = typology === 'Access-Constrained' ? 'AccessConstrained' : 'Reference';

    // Draw trajectories with optional pen-stroke reveal.
    selectedScenarios.forEach((scenarioId, idx) => {
      const key = `${scenarioId}_${typSuffix}`;
      const data = trajectories[key];
      if (!data) return;

      const color = SCENARIO_COLOURS[scenarioId] || '#888';

      const path = g
        .append('path')
        .datum(data)
        .attr('d', lineGen)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      if (willAnimate) {
        const total = path.node()?.getTotalLength?.() ?? 0;
        if (total > 0) {
          path
            .attr('stroke-dasharray', `${total} ${total}`)
            .attr('stroke-dashoffset', total)
            .transition()
            .delay(idx * 180)
            .duration(900)
            .ease((t) => t) // linear pen-stroke
            .attr('stroke-dashoffset', 0)
            .on('end', function endPenStroke() {
              select(this).attr('stroke-dasharray', null);
            });
        }
      }

      // Legend label at end
      const lastVal = data[data.length - 1];
      const label = g
        .append('text')
        .attr('x', w + 5)
        .attr('y', y(lastVal) + 4)
        .style('font-size', '10px')
        .style('fill', color)
        .style('font-weight', '600')
        .text(`${scenarioId} ${(lastVal * 100).toFixed(1)}%`);

      if (willAnimate) {
        label
          .attr('opacity', 0)
          .transition()
          .delay(idx * 180 + 700)
          .duration(250)
          .attr('opacity', 1);
      }
    });

    // 80% target line — drawn last so it sits visually on top of trajectories.
    if (showTarget) {
      const targetLine = g
        .append('line')
        .attr('x1', 0).attr('x2', w)
        .attr('y1', y(0.8)).attr('y2', y(0.8))
        .attr('stroke', '#cc8400')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6,3');

      const targetLabel = g
        .append('text')
        .attr('x', w + 5)
        .attr('y', y(0.8) + 4)
        .style('font-size', '10px')
        .style('fill', '#cc8400')
        .style('font-weight', '600')
        .text('80% target');

      if (willAnimate) {
        const totalDelay = totalScenarios * 180 + 600;
        targetLine
          .attr('opacity', 0)
          .transition()
          .delay(totalDelay)
          .duration(300)
          .attr('opacity', 1);
        targetLabel
          .attr('opacity', 0)
          .transition()
          .delay(totalDelay)
          .duration(300)
          .attr('opacity', 1);
      }
    }

    // Custom trajectory (from counterfactual engine) — never animated; live update.
    if (customTrajectory) {
      g.append('path')
        .datum(customTrajectory)
        .attr('d', lineGen)
        .attr('fill', 'none')
        .attr('stroke', '#e6a817')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '8,4')
        .attr('stroke-linecap', 'round');

      const lastVal = customTrajectory[customTrajectory.length - 1];
      g.append('text')
        .attr('x', w + 5)
        .attr('y', y(lastVal) + 4)
        .style('font-size', '10px')
        .style('fill', '#e6a817')
        .style('font-weight', '700')
        .text(customLabel || `Custom ${(lastVal * 100).toFixed(1)}%`);
    }

    // Axis labels
    g.append('text')
      .attr('x', w / 2)
      .attr('y', ch + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Month');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -ch / 2)
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Coverage');
  }, [trajectories, selectedScenarios, typology, showTarget, customTrajectory, customLabel, dims, animated, reduceMotion, shouldAnimate]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} role="img" aria-label="Coverage trajectory chart showing vaccination coverage over 60 months by scenario" />
    </div>
  );
}
