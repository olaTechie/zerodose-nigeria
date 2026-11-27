import { useRef, useEffect, useState, useCallback } from 'react';
import { LISA_COLOURS } from '../../data/constants';

const INITIAL_VIEW = { longitude: 8.0, latitude: 9.0, zoom: 5.5 };
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

/**
 * Lightweight SVG-based Nigeria map that does not require MapLibre GL JS.
 * Uses GeoJSON data loaded from public/data/ and renders state polygons as SVG paths.
 * (The survey-cluster point layer was removed on 2026-11-27: it published DHS
 * cluster coordinates with cluster-level observed values.)
 */
export default function NigeriaMap({
  stateData,
  lisaData,
  colorByField = 'weighted_prevalence',
  colorScale,
  onStateClick,
  showLisa = false,
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
                  // state_prevalence.json + lisa_clusters.json store percent (0-100)
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

        {children}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(tooltip.x + 12, window.innerWidth - 270),
            top: Math.max(tooltip.y - 10, 10),
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,102,51,0.15)',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.78rem',
            color: '#0d1b2a',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontWeight: 700 }}>{tooltip.name}</div>
          {tooltip.value != null && (
            <div>
              {typeof tooltip.value === 'number'
                ? `${(tooltip.scale === 'proportion' ? tooltip.value * 100 : tooltip.value).toFixed(1)}%`
                : tooltip.value}
            </div>
          )}
          {tooltip.cluster_type && <div>{tooltip.cluster_type}</div>}
        </div>
      )}
    </div>
  );
}
