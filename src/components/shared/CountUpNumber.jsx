import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

export default function CountUpNumber({ target, duration = 1500, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const numTarget = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.-]/g, '')) : target;

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(numTarget * eased);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="count-up">
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}
