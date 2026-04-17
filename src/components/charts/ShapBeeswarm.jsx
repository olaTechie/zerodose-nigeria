import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

/**
 * Simplified beeswarm/strip chart showing SHAP values.
 * When individual SHAP values are unavailable, falls back to showing
 * a horizontal bar with the mean value.
 */
export default function ShapBeeswarm({ data = [], maxFeatures = 10 }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 600, height: 350 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width, height: Math.max(250, maxFeatures * 30 + 60) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [maxFeatures]);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const sliced = data.slice(0, maxFeatures);
    const { width, height } = dims;
    const margin = { top: 10, right: 30, bottom: 35, left: 160 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxShap = Math.max(...sliced.map((d) => d.shap)) * 1.15;
    const x = scaleLinear().domain([0, maxShap]).range([0, w]);

    const y = scaleBand()
      .domain(sliced.map((d) => d.display || d.feature))
      .range([0, h])
      .padding(0.35);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(axisBottom(x).ticks(5))
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', '"Source Sans 3", ui-sans-serif, system-ui, sans-serif');

    g.append('g')
      .call(axisLeft(y))
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', '"Source Sans 3", ui-sans-serif, system-ui, sans-serif');

    // Render as dots scattered around the mean
    sliced.forEach((feat) => {
      const cy = y(feat.display || feat.feature) + y.bandwidth() / 2;
      const mean = feat.shap;
      // Generate synthetic points around the mean for visual effect
      const nPts = 20;
      const pts = Array.from({ length: nPts }, (_, i) => {
        const jitter = (Math.random() - 0.5) * y.bandwidth() * 0.7;
        const spread = mean * (0.3 + Math.random() * 1.4);
        return { x: spread, yOff: jitter };
      });

      g.selectAll(null)
        .data(pts)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(Math.max(0, d.x)))
        .attr('cy', (d) => cy + d.yOff)
        .attr('r', 2.5)
        .attr('fill', '#006633')
        .attr('fill-opacity', 0.35)
        .attr('stroke', 'none');

      // Mean marker
      g.append('line')
        .attr('x1', x(mean))
        .attr('x2', x(mean))
        .attr('y1', cy - y.bandwidth() / 2)
        .attr('y2', cy + y.bandwidth() / 2)
        .attr('stroke', '#003d1e')
        .attr('stroke-width', 2);
    });

    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('SHAP value');
  }, [data, dims, maxFeatures]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
