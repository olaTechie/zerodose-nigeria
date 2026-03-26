import { useRef, useState, useEffect, useCallback } from 'react';

export function useCounterfactual() {
  const workerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/counterfactual.worker.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'ready') {
        setReady(true);
      } else if (e.data.type === 'error') {
        setError(e.data.payload);
      } else if (e.data.type === 'result') {
        setResult(e.data.payload);
      }
    };
    // Send init message with the base URL
    workerRef.current.postMessage({ type: 'init', baseUrl: import.meta.env.BASE_URL });
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const compute = useCallback((params) => {
    workerRef.current?.postMessage({ type: 'compute', payload: params });
  }, []);

  return { result, compute, ready, error };
}
