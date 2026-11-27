import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line as d3Line, area as d3Area, curveBasis } from 'd3-shape';

/**
 * KDE posterior density plot for a single ABM parameter.
 */
function kde(values, bandwidth, nBins = 80) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / nBins;
  const bins = Array.from({ length: nBins }, (_, i) => min + i * step);
  const density = bins.map((x) => {
    const sum = values.reduce((acc, v) => {
      const u = (x - v) / bandwidth;
      return acc + Math.exp(-0.5 * u * u);
    }, 0);
    return { x, y: sum / (values.length * bandwidth * Math.sqrt(2 * Math.PI)) };
  });
  return density;
}

export default function PosteriorDensity({ values = [], paramName = '', color = '#006633' }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 300, height: 200 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width: Math.min(width, 400), height: 200 });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!values.length || !svgRef.current) return;

    const { width, height } = dims;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    // Compute bandwidth (Silverman's rule)
    const std = Math.sqrt(values.reduce((a, v) => a + (v - values.reduce((s, x) => s + x, 0) / values.length) ** 2, 0) / values.length) || 0.01;
    const bw = 1.06 * std * Math.pow(values.length, -0.2);
    const density = kde(values, Math.max(bw, 0.001));

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = scaleLinear()
      .domain([density[0].x, density[density.length - 1].x])
      .range([0, w]);

    const maxY = Math.max(...density.map((d) => d.y));
    const y = scaleLinear().domain([0, maxY * 1.1]).range([h, 0]);

    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(axisBottom(x).ticks(4))
      .selectAll('text')
      .style('font-size', '9px');

    g.append('g')
      .call(axisLeft(y).ticks(3))
      .selectAll('text')
      .style('font-size', '9px');

    const areaGen = d3Area()
      .x((d) => x(d.x))
      .y0(h)
      .y1((d) => y(d.y))
      .curve(curveBasis);

    const lineGen = d3Line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(curveBasis);

    g.append('path')
      .datum(density)
      .attr('d', areaGen)
      .attr('fill', color)
      .attr('fill-opacity', 0.15);

    g.append('path')
      .datum(density)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2);

    // Parameter name
    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 26)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#546e7a')
      .style('font-weight', '600')
      .text(paramName);
  }, [values, dims, paramName, color]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
