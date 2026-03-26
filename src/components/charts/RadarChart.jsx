import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

/**
 * Radar chart for LCA class profiles.
 * Each class is a polygon; axes are the LCA indicator variables.
 */
const DEFAULT_AXES = ['Trust Score', 'Proportion', 'SD'];

export default function RadarChart({ classes = [], axes = DEFAULT_AXES, size = 300 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!classes.length || !svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', size).attr('height', size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 40;
    const nAxes = axes.length;
    const angleSlice = (2 * Math.PI) / nAxes;

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    const rScale = scaleLinear().domain([0, 1]).range([0, r]);

    // Grid circles
    [0.25, 0.5, 0.75, 1.0].forEach((level) => {
      g.append('circle')
        .attr('r', rScale(level))
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 0.5);

      g.append('text')
        .attr('x', 3)
        .attr('y', -rScale(level) + 3)
        .style('font-size', '8px')
        .style('fill', '#bdbdbd')
        .text(`${(level * 100).toFixed(0)}%`);
    });

    // Axis lines and labels
    axes.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const xEnd = r * Math.cos(angle);
      const yEnd = r * Math.sin(angle);

      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', xEnd).attr('y2', yEnd)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 0.5);

      const labelR = r + 15;
      g.append('text')
        .attr('x', labelR * Math.cos(angle))
        .attr('y', labelR * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .style('fill', '#546e7a')
        .text(axis);
    });

    // Class polygons
    const COLORS = { Willing: '#2e7d32', Hesitant: '#cc8400', Refusing: '#8b0000' };

    classes.forEach((cls) => {
      const values = [cls.meanTrust, cls.proportion, Math.min(cls.sd * 5, 1)]; // Normalised to 0-1
      const points = values.map((v, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return [rScale(v) * Math.cos(angle), rScale(v) * Math.sin(angle)];
      });

      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join('') + 'Z';
      const color = COLORS[cls.label] || '#888';

      g.append('path')
        .attr('d', pathData)
        .attr('fill', color)
        .attr('fill-opacity', 0.12)
        .attr('stroke', color)
        .attr('stroke-width', 2);

      // Dots at vertices
      points.forEach(([px, py]) => {
        g.append('circle')
          .attr('cx', px)
          .attr('cy', py)
          .attr('r', 3)
          .attr('fill', color);
      });
    });
  }, [classes, axes, size]);

  return <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }} />;
}
