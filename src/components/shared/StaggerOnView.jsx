import { Children, cloneElement, isValidElement } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * StaggerOnView — reveal children one by one when the parent enters the viewport.
 *
 * Behaviour:
 *   - First time the parent crosses the viewport threshold, each child fades up
 *     with a staggered delay (default 90 ms between siblings).
 *   - Choreography is a one-shot per mount; once revealed, children stay visible
 *     even if scrolled off and back into view (avoids re-firing on every scroll).
 *   - `prefers-reduced-motion: reduce` collapses the sequence to instant render
 *     at full opacity (no transform, no fade).
 *
 * Used by Story Act 2 (SHAP bars), Act 4 (scenario trajectories) and any
 * downstream cluster of items that wants a paced reveal.
 *
 * Each child is wrapped in a `<motion.div>` so the consumer doesn't need to
 * know about framer-motion.
 *
 *   <StaggerOnView staggerSeconds={0.12}>
 *     <Bar value={1.62} />
 *     <Bar value={1.34} />
 *     <Bar value={0.37} />
 *   </StaggerOnView>
 */
export default function StaggerOnView({
  children,
  staggerSeconds = 0.09,
  initialDelaySeconds = 0,
  itemDurationSeconds = 0.35,
  yOffset = 8,
  amount = 0.25,
  as: Tag = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children).filter(Boolean);

  if (reduce) {
    // Instant render at final state — no motion, no fade.
    return (
      <Tag className={className} style={style} {...rest}>
        {items}
      </Tag>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: initialDelaySeconds,
        staggerChildren: staggerSeconds,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: itemDurationSeconds, ease: [0.22, 0.61, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={containerVariants}
      {...rest}
    >
      {items.map((child, i) => {
        // Preserve keys from original children where possible.
        const key = isValidElement(child) && child.key != null ? child.key : i;
        return (
          <motion.div key={key} variants={itemVariants} style={{ willChange: 'opacity, transform' }}>
            {isValidElement(child) ? cloneElement(child) : child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
