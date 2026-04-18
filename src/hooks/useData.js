import { useState, useEffect, useCallback, useRef } from 'react';

const cache = {};

export function useData(filename) {
  const [data, setData] = useState(cache[filename] || null);
  const [loading, setLoading] = useState(!cache[filename]);
  const [error, setError] = useState(null);
  // Bumping nonce forces useEffect to re-run on retry (clears cache + refetches).
  const [nonce, setNonce] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    if (nonce === 0 && cache[filename]) {
      setData(cache[filename]);
      setLoading(false);
      setError(null);
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
  }, [filename, nonce]);

  // retry — clear the cache for this file and bump the nonce so useEffect re-runs.
  const retry = useCallback(() => {
    delete cache[filename];
    setNonce((n) => n + 1);
  }, [filename]);

  return { data, loading, error, retry };
}
