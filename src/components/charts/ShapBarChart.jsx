import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';

export default function ShapBarChart({ data = [], maxFeatures = 15, animated = true }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDims({ width, height: Math.max(300, Math.min(maxFeatures * 28 + 60, 500)) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [maxFeatures]);

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
      .style('font-family', 'Inter, sans-serif');

    // Y axis
    g.append('g')
      .call(axisLeft(y))
      .selectAll('text')
      .style('font-size', '11px')
      .style('font-family', 'Inter, sans-serif');

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

    if (animated) {
      bars
        .attr('width', 0)
        .transition()
        .duration(800)
        .delay((_, i) => i * 50)
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
      .style('font-family', 'Inter, sans-serif')
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
  }, [data, dims, maxFeatures, animated]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
