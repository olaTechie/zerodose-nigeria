import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

/**
 * Funnel plot: state-level scatter with national mean line and
 * approximate confidence bounds that widen as sample size decreases.
 */
export default function FunnelPlot({ states = [], nationalMean = 0.368 }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width, height: 400 });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!states.length || !svgRef.current) return;

    const { width, height } = dims;
    const margin = { top: 15, right: 20, bottom: 40, left: 50 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxN = Math.max(...states.map((s) => s.n_children || 1));
    const x = scaleLinear().domain([0, maxN * 1.1]).range([0, w]);
    const y = scaleLinear().domain([0, 1]).range([h, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(axisBottom(x).ticks(6))
      .selectAll('text')
      .style('font-size', '10px');

    g.append('g')
      .call(axisLeft(y).ticks(5).tickFormat((d) => `${(d * 100).toFixed(0)}%`))
      .selectAll('text')
      .style('font-size', '10px');

    // National mean line
    g.append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', y(nationalMean)).attr('y2', y(nationalMean))
      .attr('stroke', '#d32f2f')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,3');

    g.append('text')
      .attr('x', w - 5)
      .attr('y', y(nationalMean) - 5)
      .attr('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', '#d32f2f')
      .text(`National: ${(nationalMean * 100).toFixed(1)}%`);

    // Approximate CI funnel (95% bounds)
    const nPoints = 50;
    const upperLine = [];
    const lowerLine = [];
    for (let i = 1; i <= nPoints; i++) {
      const n = (maxN / nPoints) * i;
      const se = Math.sqrt((nationalMean * (1 - nationalMean)) / Math.max(n, 1));
      upperLine.push({ n, v: nationalMean + 1.96 * se });
      lowerLine.push({ n, v: nationalMean - 1.96 * se });
    }

    const linePath = (points) =>
      points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.n)},${y(Math.max(0, Math.min(1, p.v)))}`).join('');

    g.append('path')
      .attr('d', linePath(upperLine))
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3');

    g.append('path')
      .attr('d', linePath(lowerLine))
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,3');

    // State dots
    const ZONE_COLORS = {
      NW: '#8b0000', NE: '#cc4400', NC: '#cc8400',
      SE: '#006633', SS: '#1565c0', SW: '#4a148c',
    };

    g.selectAll('.state-dot')
      .data(states)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.n_children || 1))
      .attr('cy', (d) => y(d.weighted_prevalence / 100))
      .attr('r', 5)
      .attr('fill', (d) => ZONE_COLORS[d.zone] || '#888')
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.8)
      .style('cursor', 'pointer')
      .append('title')
      .text((d) => `${d.state_name}: ${d.weighted_prevalence.toFixed(1)}% (n=${d.n_children})`);

    // Labels for outliers
    states
      .filter((d) => d.weighted_prevalence / 100 > nationalMean + 0.25 || d.weighted_prevalence / 100 < 0.05)
      .forEach((d) => {
        g.append('text')
          .attr('x', x(d.n_children || 1) + 7)
          .attr('y', y(d.weighted_prevalence / 100) + 3)
          .style('font-size', '9px')
          .style('fill', '#546e7a')
          .text(d.state_name);
      });

    // Axis labels
    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Sample size (n children)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#78909c')
      .text('Zero-dose prevalence');
  }, [states, dims, nationalMean]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
