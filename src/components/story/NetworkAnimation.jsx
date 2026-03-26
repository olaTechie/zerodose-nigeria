import { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';

/**
 * Simplified force-directed network of ~80 nodes representing
 * community clusters. Nodes coloured by trust state, with edges
 * showing peer influence connections.
 */
export default function NetworkAnimation({ step = 0, width = 500, height = 400 }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const nNodes = 80;
    const trustColors = ['#8b0000', '#cc8400', '#2e7d32'];
    const trustProbs = [0.284, 0.559, 0.157];

    // Generate nodes with random positions
    const nodes = Array.from({ length: nNodes }, (_, i) => {
      const rand = Math.random();
      const trustState = rand < trustProbs[0] ? 0 : rand < trustProbs[0] + trustProbs[1] ? 1 : 2;
      return {
        id: i,
        x: width * 0.15 + Math.random() * width * 0.7,
        y: height * 0.15 + Math.random() * height * 0.7,
        trustState,
        vaccinated: false,
        r: 4 + Math.random() * 3,
      };
    });

    // Generate edges (nearby nodes)
    const edges = [];
    nodes.forEach((n, i) => {
      nodes.forEach((m, j) => {
        if (j <= i) return;
        const dist = Math.hypot(n.x - m.x, n.y - m.y);
        if (dist < 80 && Math.random() < 0.4) {
          edges.push({ source: i, target: j });
        }
      });
    });

    // Draw edges
    svg
      .selectAll('.edge')
      .data(edges)
      .enter()
      .append('line')
      .attr('x1', (d) => nodes[d.source].x)
      .attr('y1', (d) => nodes[d.source].y)
      .attr('x2', (d) => nodes[d.target].x)
      .attr('y2', (d) => nodes[d.target].y)
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.4);

    // Draw nodes
    const circles = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', (d) => d.r)
      .attr('fill', '#bdbdbd')
      .attr('fill-opacity', 0.5)
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5);

    // Animate based on step
    if (step >= 1) {
      // Color by trust state
      circles
        .transition()
        .duration(800)
        .delay((_, i) => i * 15)
        .attr('fill', (d) => trustColors[d.trustState])
        .attr('fill-opacity', 0.8);
    }

    if (step >= 2) {
      // Vaccinate "willing" nodes
      circles
        .filter((d) => d.trustState === 2)
        .transition()
        .duration(600)
        .delay(800)
        .attr('stroke', '#006633')
        .attr('stroke-width', 2)
        .attr('r', (d) => d.r + 2);
    }

    simRef.current = { nodes, edges, circles };

    return () => {
      svg.selectAll('*').remove();
    };
  }, [step, width, height]);

  return (
    <svg
      ref={svgRef}
      style={{
        display: 'block',
        margin: '0 auto',
        background: 'transparent',
      }}
    />
  );
}
