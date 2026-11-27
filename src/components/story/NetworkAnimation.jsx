import { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import 'd3-transition';

/**
 * Illustrative network of ~80 nodes (virtual children). Step 1 colours nodes by
 * caregiver engagement class (published class shares); step 2 rings the nodes
 * that are vaccinated, with probability one minus the class's observed
 * zero-dose prevalence. Edges stand for neighbourhood (peer) connections.
 */
import { ENGAGEMENT_CLASSES } from '../../data/constants';

export default function NetworkAnimation({ step = 0, width = 500, height = 400 }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const nNodes = 80;
    const classColors = ENGAGEMENT_CLASSES.map((c) => c.color);
    const classShares = ENGAGEMENT_CLASSES.map((c) => c.share);
    const classZeroDose = ENGAGEMENT_CLASSES.map((c) => c.zeroDose);

    // Generate nodes with random positions
    const nodes = Array.from({ length: nNodes }, (_, i) => {
      const rand = Math.random();
      let cls = 0;
      let cum = classShares[0];
      while (rand > cum && cls < classShares.length - 1) {
        cls += 1;
        cum += classShares[cls];
      }
      return {
        id: i,
        x: width * 0.15 + Math.random() * width * 0.7,
        y: height * 0.15 + Math.random() * height * 0.7,
        cls,
        vaccinated: Math.random() > classZeroDose[cls],
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
      // Colour by engagement class
      circles
        .transition()
        .duration(800)
        .delay((_, i) => i * 15)
        .attr('fill', (d) => classColors[d.cls])
        .attr('fill-opacity', 0.8);

      // Legend
      const legend = svg.append('g').attr('transform', `translate(8, ${height - 4 * 15 - 4})`);
      ENGAGEMENT_CLASSES.forEach((c, i) => {
        legend.append('circle').attr('cx', 6).attr('cy', i * 15).attr('r', 5).attr('fill', c.color);
        legend.append('text').attr('x', 16).attr('y', i * 15 + 4)
          .attr('font-size', 10).attr('fill', '#37474f').attr('font-family', 'Inter, sans-serif')
          .text(`${c.name}: ${c.short}`);
      });
    }

    if (step >= 2) {
      // Ring the vaccinated nodes
      circles
        .filter((d) => d.vaccinated)
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
