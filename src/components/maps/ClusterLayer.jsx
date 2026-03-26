/**
 * ClusterLayer — renders cluster points on the NigeriaMap.
 * This component provides the color function logic for cluster rendering.
 */
import { TYPOLOGY_COLOURS, ZONE_COLOURS } from '../../data/constants';

export function getClusterColorByTypology(props) {
  return TYPOLOGY_COLOURS[props.typology] || '#888';
}

export function getClusterColorByZone(props) {
  return ZONE_COLOURS[props.zone] || '#888';
}

export function getClusterColorByZdRate(props) {
  const rate = props.zero_dose_rate || 0;
  if (rate >= 0.8) return '#6b1a1a';
  if (rate >= 0.6) return '#b33000';
  if (rate >= 0.4) return '#cc8400';
  if (rate >= 0.2) return '#006633';
  return '#1565c0';
}

