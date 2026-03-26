import { trilinearInterpolate } from '../utils/interpolation';

let gridData = null;

self.onmessage = async (e) => {
  if (e.data.type === 'init') {
    try {
      const resp = await fetch(`${e.data.baseUrl}data/scenarios_interpolation_grid.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      gridData = await resp.json();
      self.postMessage({ type: 'ready' });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err.message });
    }
    return;
  }

  if (e.data.type === 'compute') {
    if (!gridData) {
      self.postMessage({ type: 'error', payload: 'Grid data not loaded' });
      return;
    }
    try {
      const params = e.data.payload;
      const result = trilinearInterpolate(
        gridData.grid,
        gridData.param_ranges,
        params
      );
      self.postMessage({ type: 'result', payload: result });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err.message });
    }
  }
};
