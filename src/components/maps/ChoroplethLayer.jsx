/**
 * ChoroplethLayer — provides color scale functions for state polygons.
 * The actual rendering is handled by NigeriaMap's SVG paths.
 */
import { scaleSequential } from 'd3-scale';
import { interpolateReds, interpolateBlues, interpolateGreens } from 'd3-scale-chromatic';

export function getPrevalenceColorScale(maxPercent = 90) {
  return scaleSequential(interpolateReds).domain([0, maxPercent]);
}

export function getCoverageColorScale() {
  return scaleSequential(interpolateGreens).domain([0, 1]);
}

export function getZdColorScale() {
  return scaleSequential(interpolateReds).domain([0, 0.9]);
}

export default function ChoroplethLayer() {
  return null;
}
