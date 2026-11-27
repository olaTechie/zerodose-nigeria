import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

/**
 * Horizontal bar chart for CNA necessity scores.
 * Shows a draggable/fixed threshold line.
 */
export default function NecessityBar({ data = [], threshold = 0.75 }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 500, height: 200 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width, height: Math.max(data.length * 40 + 60, 180) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [data.length]);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const sorted = [...data].sort((a, b) => b.necessity_consistency - a.necessity_consistency);
    const { width, height } = dims;
    const margin = { top: 10, right: 40, bottom: 30, left: 130 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleLinear().domain([0, 1]).range([0, w]);
    const y = scaleBand()
      .domain(sorted.map((d) => d.condition))
      .range([0, h])
      .padding(0.3);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(axisBottom(x).ticks(5).tickFormat((d) => d.toFixed(1)))
      .selectAll('text')
      .style('font-size', '10px');

    g.append('g')
      .call(axisLeft(y))
      .selectAll('text')
      .style('font-size', '11px')
      .style('font-family', 'Inter, sans-serif');

    // Threshold line
    g.append('line')
      .attr('x1', x(threshold)).attr('x2', x(threshold))
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', '#d32f2f')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,3');

    g.append('text')
      .attr('x', x(threshold) + 4)
      .attr('y', -3)
      .style('font-size', '9px')
      .style('fill', '#d32f2f')
      .style('font-weight', '600')
      .text(`Threshold: ${threshold}`);

    // Bars
    g.selectAll('.bar')
      .data(sorted)
      .enter()
      .append('rect')
      .attr('y', (d) => y(d.condition))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', (d) => d.necessity_consistency >= threshold ? '#006633' : '#cc8400')
      .attr('rx', 3)
      .transition()
      .duration(600)
      .delay((_, i) => i * 80)
      .attr('width', (d) => x(d.necessity_consistency));

    // Value labels
    g.selectAll('.val-label')
      .data(sorted)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.necessity_consistency) + 4)
      .attr('y', (d) => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('fill', '#546e7a')
      .text((d) => d.necessity_consistency.toFixed(2));

    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 28)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Necessity consistency');
  }, [data, dims, threshold]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
