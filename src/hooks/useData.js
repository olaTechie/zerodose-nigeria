import { useState, useEffect, useCallback, useRef } from 'react';

const cache = {};

export function useData(filename) {
  const [data, setData] = useState(cache[filename] || null);
  const [loading, setLoading] = useState(!cache[filename]);
  const [error, setError] = useState(null);
  // bump to force a refetch (clears cache for this filename)
  const [retryCount, setRetryCount] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    if (cache[filename] && retryCount === 0) {
      setData(cache[filename]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.BASE_URL}data/${filename}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!cancelledRef.current) {
          cache[filename] = d;
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelledRef.current) {
          setError(e);
          setLoading(false);
        }
      });
    return () => {
      cancelledRef.current = true;
    };
  }, [filename, retryCount]);

  // retry() — clear the cache entry and trigger a refetch. Safe to call from
  // an ErrorState onRetry handler.
  const retry = useCallback(() => {
    delete cache[filename];
    setError(null);
    setRetryCount((c) => c + 1);
  }, [filename]);

  return { data, loading, error, retry };
}
