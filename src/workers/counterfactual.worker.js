import { trilinearInterpolate } from '../utils/interpolation';

let gridData = null;

async function loadGrid() {
  try {
    const baseUrl = self.location.href.replace(/\/assets\/.*$/, '');
    const resp = await fetch(`${baseUrl}/data/scenarios_interpolation_grid.json`);
    gridData = await resp.json();
    self.postMessage({ type: 'ready' });
  } catch (e) {
    console.error('Worker: failed to load grid', e);
  }
}

loadGrid();

self.onmessage = (e) => {
  if (e.data.type === 'compute' && gridData) {
    const params = e.data.payload;
    const result = trilinearInterpolate(
      gridData.grid,
      gridData.param_ranges,
      params
    );
    self.postMessage({ type: 'result', payload: result });
  }
};
