import { COVERAGE_TIERS } from '../data/constants';

export function getCoverageTier(value) {
  if (value >= COVERAGE_TIERS.ontrack.min) return COVERAGE_TIERS.ontrack;
  if (value >= COVERAGE_TIERS.atrisk.min) return COVERAGE_TIERS.atrisk;
  if (value >= COVERAGE_TIERS.critical.min) return COVERAGE_TIERS.critical;
  return COVERAGE_TIERS.crisis;
}
