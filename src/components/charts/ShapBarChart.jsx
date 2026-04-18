import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';

/**
 * ShapBarChart — horizontal bar chart of mean |SHAP| values, with optional
 * scroll-driven sequential reveal in argument order (top driver first).
 *
 * `animated`            — when true, bars draw left-to-right with a 90 ms
 *                         stagger between siblings the first time the chart
 *                         crosses the viewport threshold.
 * `prefers-reduced-motion: reduce` collapses the choreography: bars render
 * at final width on first paint, no stagger.
 */
export default function ShapBarChart({ data = [], maxFeatures = 15, animated = true }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [dims, setDims] = useState({ width: 600, height: 400 });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Detect reduced-motion once.
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width, height: Math.max(300, Math.min(maxFeatures * 28 + 60, 500)) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [maxFeatures]);

  // IntersectionObserver: wait until the chart is on-screen before kicking off
  // the staggered draw. One-shot per mount.
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
    if (!data.length || !svgRef.current) return;

    const sliced = data.slice(0, maxFeatures);
    const { width, height } = dims;
    const margin = { top: 10, right: 40, bottom: 30, left: 180 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleLinear()
      .domain([0, Math.max(...sliced.map((d) => d.shap)) * 1.1])
      .range([0, w]);

    const y = scaleBand()
      .domain(sliced.map((d) => d.display || d.feature))
      .range([0, h])
      .padding(0.25);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(axisBottom(x).ticks(5).tickFormat(format('.2f')))
      .selectAll('text')
      .style('font-size', '11px')
      .style('font-family', '"Source Sans 3", ui-sans-serif, system-ui, sans-serif');

    // Y axis
    g.append('g')
      .call(axisLeft(y))
      .selectAll('text')
      .style('font-size', '11px')
      .style('font-family', '"Source Sans 3", ui-sans-serif, system-ui, sans-serif');

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(sliced)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.display || d.feature))
      .attr('height', y.bandwidth())
      .attr('fill', '#006633')
      .attr('rx', 3);

    // Sequential pen-stroke reveal in SHAP order (top driver first), but only
    // when the chart is on-screen and the user hasn't asked for less motion.
    if (animated && !reduceMotion && shouldAnimate) {
      bars
        .attr('width', 0)
        .transition()
        .duration(700)
        .delay((_, i) => i * 90)
        .attr('width', (d) => x(d.shap));
    } else {
      bars.attr('width', (d) => x(d.shap));
    }

    // Value labels
    g.selectAll('.label')
      .data(sliced)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.shap) + 4)
      .attr('y', (d) => y(d.display || d.feature) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('font-family', '"Source Sans 3", ui-sans-serif, system-ui, sans-serif')
      .style('fill', '#546e7a')
      .text((d) => d.shap.toFixed(3));

    // X axis label
    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 28)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Mean |SHAP|');
  }, [data, dims, maxFeatures, animated, shouldAnimate, reduceMotion]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
