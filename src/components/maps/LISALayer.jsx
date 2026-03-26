/**
 * LISALayer — provides LISA cluster type colour mapping.
 * The actual rendering is done by NigeriaMap with showLisa=true.
 */
import { LISA_COLOURS } from '../../data/constants';

export function getLisaColor(clusterType) {
  return LISA_COLOURS[clusterType] || '#bdbdbd';
}

export function getLisaLegend() {
  return Object.entries(LISA_COLOURS).map(([label, color]) => ({
    label,
    color,
  }));
}

export default function LISALayer() {
  return null;
}
