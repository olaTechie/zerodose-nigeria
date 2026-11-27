import { useState, useCallback } from 'react';

const INITIAL_VIEW = {
  longitude: 8.0,
  latitude: 9.0,
  zoom: 5.5,
  pitch: 0,
  bearing: 0,
};

export function useMapView() {
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const resetView = useCallback(() => {
    setViewState(INITIAL_VIEW);
    setSelectedFeature(null);
    setTooltip(null);
  }, []);

  return {
    viewState,
    setViewState,
    selectedFeature,
    setSelectedFeature,
    tooltip,
    setTooltip,
    resetView,
  };
}
