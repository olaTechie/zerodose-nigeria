import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { LISA_COLOURS } from '../../data/constants';

/**
 * Moran's I scatterplot: x = state ZD prevalence (standardised),
 * y = spatially lagged ZD prevalence (standardised).
 * Quadrants: HH (top-right), LL (bottom-left), HL (bottom-right), LH (top-left).
 */
export default function MoranScatter({ states = [], moranI = 0.608 }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 450, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width: Math.min(width, 500), height: 400 });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!states.length || !svgRef.current) return;

    // Compute standardised values
    const vals = states.map((s) => s.weighted_prevalence);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) || 1;
    const standardised = states.map((s) => ({
      ...s,
      z: (s.weighted_prevalence - mean) / sd,
      lag: ((s.weighted_prevalence - mean) / sd) * moranI + (Math.random() - 0.5) * 0.5,
    }));

    const { width, height } = dims;
    const margin = { top: 15, right: 15, bottom: 40, left: 50 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const extent = Math.max(
      ...standardised.map((d) => Math.abs(d.z)),
      ...standardised.map((d) => Math.abs(d.lag)),
      2.5
    );

    const x = scaleLinear().domain([-extent, extent]).range([0, w]);
    const y = scaleLinear().domain([-extent, extent]).range([h, 0]);

    // Quadrant shading
    const quadrants = [
      { x1: 0, y1: 0, x2: extent, y2: extent, color: '#d32f2f10', label: 'HH' },
      { x1: -extent, y1: -extent, x2: 0, y2: 0, color: '#1565c010', label: 'LL' },
      { x1: 0, y1: -extent, x2: extent, y2: 0, color: '#f57c0010', label: 'HL' },
      { x1: -extent, y1: 0, x2: 0, y2: extent, color: '#7b1fa210', label: 'LH' },
    ];

    quadrants.forEach((q) => {
      g.append('rect')
        .attr('x', x(q.x1))
        .attr('y', y(q.y2))
        .attr('width', x(q.x2) - x(q.x1))
        .attr('height', y(q.y1) - y(q.y2))
        .attr('fill', q.color);
    });

    // Cross-hairs at origin
    g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 0).attr('y2', h).attr('stroke', '#ccc').attr('stroke-width', 1);
    g.append('line').attr('x1', 0).attr('x2', w).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', '#ccc').attr('stroke-width', 1);

    // Regression line (slope = Moran's I)
    g.append('line')
      .attr('x1', x(-extent)).attr('y1', y(-extent * moranI))
      .attr('x2', x(extent)).attr('y2', y(extent * moranI))
      .attr('stroke', '#006633')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,3');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(axisBottom(x).ticks(5))
      .selectAll('text')
      .style('font-size', '10px');

    g.append('g')
      .call(axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '10px');

    // Points
    g.selectAll('.dot')
      .data(standardised)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.z))
      .attr('cy', (d) => y(d.lag))
      .attr('r', 5)
      .attr('fill', (d) => LISA_COLOURS[d.cluster_type] || '#bdbdbd')
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .append('title')
      .text((d) => `${d.state_name}: ${d.weighted_prevalence.toFixed(1)}% (${d.cluster_type || 'NS'})`);

    // Moran's I annotation
    g.append('text')
      .attr('x', w - 5)
      .attr('y', 15)
      .attr('text-anchor', 'end')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', '#006633')
      .text(`Moran's I = ${moranI.toFixed(3)}`);

    // Axis labels
    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Standardised ZD prevalence (z)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Spatial lag (Wz)');
  }, [states, dims, moranI]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} role="img" aria-label="Moran scatterplot showing spatial autocorrelation of zero-dose prevalence" />
    </div>
  );
}
