import { useRef, useEffect, useState, useCallback } from 'react';
import { LISA_COLOURS } from '../../data/constants';

// Convert raw tooltip value to a percent (0–100) for display.
// The scale is declared by the producer (see header comment above).
// Defaults to 'percent' for backwards compatibility with state files.
function formatTooltipValue(v, scale) {
  if (scale === 'proportion') return v * 100;
  return v; // 'percent' or undefined
}

const INITIAL_VIEW = { longitude: 8.0, latitude: 9.0, zoom: 5.5 };
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

/**
 * Lightweight SVG-based Nigeria map that does not require MapLibre GL JS.
 * Uses GeoJSON data loaded from public/data/ and renders polygons as SVG paths.
 * For cluster points, renders as SVG circles.
 */
/**
 * Value-scale convention (post-/harden):
 *   The two underlying datasets store prevalence on different scales —
 *     state_prevalence.json + lisa_clusters.json: weighted_prevalence in PERCENT (0–100)
 *     cluster_map.geojson:                       zero_dose_rate     in PROPORTION (0–1)
 *   Rather than guess from magnitude (the previous code did
 *   `value * (value > 1 ? 1 : 100)` which collapses at 1.0), each tooltip
 *   payload now declares its own `scale` so rendering is deterministic.
 *   `scale: 'percent'`     — value already in 0–100, render as `value.toFixed(1)%`
 *   `scale: 'proportion'`  — value in 0–1, render as `(value * 100).toFixed(1)%`
 */
export default function NigeriaMap({
  stateData,
  clusterData,
  lisaData,
  colorByField = 'weighted_prevalence',
  colorScale,
  onStateClick,
  onClusterHover,
  showClusters = false,
  showLisa = false,
  clusterColorFn,
  height = 500,
  children,
}) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height });

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setDimensions({ width, height });
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, [height]);

  // Simple Mercator projection for Nigeria (lon 2-15, lat 4-14)
  const project = useCallback(
    (lon, lat) => {
      const { width: w, height: h } = dimensions;
      const pad = 20;
      const x = pad + ((lon - 2.5) / (15 - 2.5)) * (w - 2 * pad);
      const y = pad + ((14 - lat) / (14 - 3.5)) * (h - 2 * pad);
      return [x, y];
    },
    [dimensions]
  );

  const polygonToPath = useCallback(
    (coordinates) => {
      return coordinates
        .map((ring) => {
          const pts = ring.map(([lon, lat]) => {
            const [x, y] = project(lon, lat);
            return `${x},${y}`;
          });
          return `M${pts.join('L')}Z`;
        })
        .join(' ');
    },
    [project]
  );

  const features = (showLisa && lisaData?.features) || stateData?.features || [];

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ background: 'transparent' }}
        role="img"
        aria-label="Map of Nigeria showing state-level data"
      >
        {/* State polygons */}
        {features.map((f, i) => {
          const geom = f.geometry;
          const props = f.properties;
          let paths = [];
          if (geom.type === 'Polygon') {
            paths = [polygonToPath(geom.coordinates)];
          } else if (geom.type === 'MultiPolygon') {
            paths = geom.coordinates.map((coords) => polygonToPath(coords));
          }

          let fillColor = '#e0e0e0';
          if (showLisa && props.cluster_type) {
            // Normalize key: handle "Not significant" vs "Not Significant"
            const normalizedType = Object.keys(LISA_COLOURS).find(
              (k) => k.toLowerCase() === props.cluster_type.toLowerCase()
            );
            fillColor = (normalizedType ? LISA_COLOURS[normalizedType] : null) || '#e0e0e0';
          } else if (colorScale && props[colorByField] != null) {
            fillColor = colorScale(props[colorByField]);
          }

          return paths.map((d, j) => (
            <path
              key={`${i}-${j}`}
              d={d}
              fill={fillColor}
              fillOpacity={0.75}
              stroke="#fff"
              strokeWidth={0.8}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.fillOpacity = '0.95';
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  name: props.state_name || props.gadm_name || '',
                  value: props[colorByField],
                  // state-level files are stored as percent (0–100)
                  scale: 'percent',
                  cluster_type: props.cluster_type,
                });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.fillOpacity = '0.75';
                setTooltip(null);
              }}
              onClick={() => onStateClick?.(props)}
            />
          ));
        })}

        {/* Cluster points */}
        {showClusters &&
          clusterData?.features?.map((f, i) => {
            const [lon, lat] = f.geometry.coordinates;
            const [x, y] = project(lon, lat);
            const props = f.properties;
            const fill = clusterColorFn
              ? clusterColorFn(props)
              : props.typology === 'Access-Constrained'
                ? '#1565c0'
                : '#2e7d32';
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                fill={fill}
                fillOpacity={0.6}
                stroke="#fff"
                strokeWidth={0.3}
                onMouseEnter={(e) => {
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    name: `Cluster ${props.cluster_id}`,
                    value: props.zero_dose_rate,
                    // cluster file is stored as proportion (0–1)
                    scale: 'proportion',
                    typology: props.typology,
                    zone: props.zone,
                  });
                  onClusterHover?.(props);
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}

        {children}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(tooltip.x + 12, window.innerWidth - 270),
            top: Math.max(tooltip.y - 10, 10),
            background: '#ffffff',
            border: '1px solid #c7cfc7',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8125rem',
            color: '#1c211d',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div style={{ fontWeight: 700 }}>{tooltip.name}</div>
          {tooltip.value != null && (
            <div>
              {typeof tooltip.value === 'number'
                ? `${formatTooltipValue(tooltip.value, tooltip.scale).toFixed(1)}%`
                : tooltip.value}
            </div>
          )}
          {tooltip.cluster_type && <div>{tooltip.cluster_type}</div>}
          {tooltip.typology && <div>{tooltip.typology}</div>}
          {tooltip.zone && <div>Zone: {tooltip.zone}</div>}
        </div>
      )}
    </div>
  );
}
