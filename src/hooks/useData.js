import { useState, useEffect } from 'react';

const cache = {};

export function useData(filename) {
  const [data, setData] = useState(cache[filename] || null);
  const [loading, setLoading] = useState(!cache[filename]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache[filename]) {
      setData(cache[filename]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/${filename}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          cache[filename] = d;
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [filename]);

  return { data, loading, error };
}
