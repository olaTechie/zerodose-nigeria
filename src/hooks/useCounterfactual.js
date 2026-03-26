import { useRef, useState, useEffect, useCallback } from 'react';

export function useCounterfactual() {
  const workerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/counterfactual.worker.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'ready') {
        setReady(true);
      } else if (e.data.type === 'result') {
        setResult(e.data.payload);
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const compute = useCallback((params) => {
    workerRef.current?.postMessage({ type: 'compute', payload: params });
  }, []);

  return { result, compute, ready };
}
