/**
 * Trilinear interpolation on a precomputed scenario grid.
 * Given a query point {outreach_mult, engagement_rate, supply_reduction, typology},
 * find the 8 surrounding grid points and interpolate trajectory arrays.
 */

function findBracket(sortedValues, target) {
  let lo = 0;
  for (let i = 0; i < sortedValues.length; i++) {
    if (sortedValues[i] <= target) lo = i;
  }
  const hi = Math.min(lo + 1, sortedValues.length - 1);
  const range = sortedValues[hi] - sortedValues[lo];
  const t = range > 0 ? (target - sortedValues[lo]) / range : 0;
  return { lo, hi, t };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpArray(a, b, t) {
  return a.map((val, i) => lerp(val, b[i], t));
}

export function trilinearInterpolate(grid, paramRanges, queryPoint) {
  const { outreach_mult, engagement_rate, supply_reduction, typology } = queryPoint;

  // Filter grid by typology
  const filtered = grid.filter((g) => g.typology === typology);
  if (filtered.length === 0) return null;

  const oVals = paramRanges.outreach_mult;
  const eVals = paramRanges.engagement_rate;
  const sVals = paramRanges.supply_reduction;

  const oB = findBracket(oVals, outreach_mult);
  const eB = findBracket(eVals, engagement_rate);
  const sB = findBracket(sVals, supply_reduction);

  // Look up grid point by parameter values
  function lookup(oi, ei, si) {
    const oVal = oVals[oi];
    const eVal = eVals[ei];
    const sVal = sVals[si];
    const point = filtered.find(
      (g) =>
        Math.abs(g.outreach_mult - oVal) < 0.001 &&
        Math.abs(g.engagement_rate - eVal) < 0.001 &&
        Math.abs(g.supply_reduction - sVal) < 0.001
    );
    return point;
  }

  // Get all 8 corners
  const c000 = lookup(oB.lo, eB.lo, sB.lo);
  const c001 = lookup(oB.lo, eB.lo, sB.hi);
  const c010 = lookup(oB.lo, eB.hi, sB.lo);
  const c011 = lookup(oB.lo, eB.hi, sB.hi);
  const c100 = lookup(oB.hi, eB.lo, sB.lo);
  const c101 = lookup(oB.hi, eB.lo, sB.hi);
  const c110 = lookup(oB.hi, eB.hi, sB.lo);
  const c111 = lookup(oB.hi, eB.hi, sB.hi);

  // If any corner is missing, return nearest
  const corners = [c000, c001, c010, c011, c100, c101, c110, c111];
  const valid = corners.filter(Boolean);
  if (valid.length === 0) return null;
  if (valid.length < 8) {
    // Fall back to nearest neighbor
    let best = null;
    let bestDist = Infinity;
    for (const g of filtered) {
      const dist =
        Math.abs(g.outreach_mult - outreach_mult) +
        Math.abs(g.engagement_rate - engagement_rate) +
        Math.abs(g.supply_reduction - supply_reduction);
      if (dist < bestDist) {
        bestDist = dist;
        best = g;
      }
    }
    return best
      ? {
          trajectory: best.trajectory,
          median_m36: best.median_m36,
          p025_m36: best.p025_m36,
          p975_m36: best.p975_m36,
        }
      : null;
  }

  // Trilinear interpolation on trajectories
  const t00 = lerpArray(c000.trajectory, c100.trajectory, oB.t);
  const t01 = lerpArray(c001.trajectory, c101.trajectory, oB.t);
  const t10 = lerpArray(c010.trajectory, c110.trajectory, oB.t);
  const t11 = lerpArray(c011.trajectory, c111.trajectory, oB.t);
  const t0 = lerpArray(t00, t10, eB.t);
  const t1 = lerpArray(t01, t11, eB.t);
  const trajectory = lerpArray(t0, t1, sB.t);

  const median_m36 = lerp(
    lerp(
      lerp(c000.median_m36, c100.median_m36, oB.t),
      lerp(c010.median_m36, c110.median_m36, oB.t),
      eB.t
    ),
    lerp(
      lerp(c001.median_m36, c101.median_m36, oB.t),
      lerp(c011.median_m36, c111.median_m36, oB.t),
      eB.t
    ),
    sB.t
  );

  const p025_m36 = lerp(
    lerp(
      lerp(c000.p025_m36, c100.p025_m36, oB.t),
      lerp(c010.p025_m36, c110.p025_m36, oB.t),
      eB.t
    ),
    lerp(
      lerp(c001.p025_m36, c101.p025_m36, oB.t),
      lerp(c011.p025_m36, c111.p025_m36, oB.t),
      eB.t
    ),
    sB.t
  );

  const p975_m36 = lerp(
    lerp(
      lerp(c000.p975_m36, c100.p975_m36, oB.t),
      lerp(c010.p975_m36, c110.p975_m36, oB.t),
      eB.t
    ),
    lerp(
      lerp(c001.p975_m36, c101.p975_m36, oB.t),
      lerp(c011.p975_m36, c111.p975_m36, oB.t),
      eB.t
    ),
    sB.t
  );

  return { trajectory, median_m36, p025_m36, p975_m36 };
}
