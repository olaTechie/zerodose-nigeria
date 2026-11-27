import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import FrontierChart from '../../components/charts/FrontierChart';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { SCENARIO_LABELS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

const TYPOLOGIES = ['Reference', 'Access-Constrained'];

const usd = (v) => Math.round(v).toLocaleString('en-GB');
const icerText = (v) => (v < 100 ? v.toFixed(2) : Math.round(v).toLocaleString('en-GB'));
const prob = (v) => v.toFixed(3);
const be = (v) => (v >= 0.01 ? v.toFixed(3) : v.toPrecision(2));
const num = { ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };

function statusText(r) {
  if (r.status === 'frontier') {
    return r.compared_with ? 'Frontier' : 'Frontier (cost-saving; dominates S0)';
  }
  if (r.status === 'extendedly dominated') return 'Extendedly dominated';
  return r.status.charAt(0).toUpperCase() + r.status.slice(1);
}

export default function EconomicsTab() {
  const { data: econ, loading, error, retry } = useData('economics.json');

  if (error) return <ErrorState onRetry={retry} />;
  if (loading) return <LoadingSpinner />;

  const vs = econ?.vsStatusQuo || [];
  const frontier = econ?.frontier || [];
  const step = (typ, s) => frontier.find((r) => r.typology === typ && r.scenario_id === s);

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.economics}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <MetricCard label="Supply-chain reinforcement" value="Cost-saving" sublabel="both community types (probability dominant 1.000)" color="green" />
        <MetricCard label="Outreach beyond supply" value={`USD ${icerText(step('Reference', 'S1').incremental_icer)} / ${icerText(step('Access-Constrained', 'S1').incremental_icer)}`} sublabel="per DALY averted (Reference / Access-Constrained); efficient at USD 800" color="green" />
        <MetricCard label="Full package beyond outreach" value={`USD ${icerText(step('Reference', 'S5').incremental_icer)} / ${icerText(step('Access-Constrained', 'S5').incremental_icer)}`} sublabel="per DALY averted (Reference / Access-Constrained); efficient at USD 2,400, not at USD 800" color="gold" />
      </div>
      <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 1.25rem' }}>
        Reaching 80% DTP1 coverage in Access-Constrained communities required the full package, so the step from outreach to the
        full package is the price of reaching the target where access is most constrained. The full package raised month-60
        coverage by 35.8 percentage points in Access-Constrained against 19.4 in Reference communities.
      </p>

      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Incremental Analysis (Efficiency Frontier)</h3>
        <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>
          Packages in cost order; dominated and extendedly dominated packages removed; incremental cost-effectiveness ratios (ICERs)
          along the frontier. Break-even: the DALYs averted per zero-dose child at which the step would be cost-effective at each
          threshold, against the assumed median of 0.060.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {TYPOLOGIES.map((typ) => {
            const rows = frontier.filter((r) => r.typology === typ).sort((a, b) => a.cost - b.cost);
            return (
              <div key={typ} style={{ flex: '1 1 460px', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.25rem 0 0.5rem' }}>{typ}</h4>
                <FrontierChart rows={frontier} typology={typ} />
                <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Package</th>
                        <th style={thStyle}>Status</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Incremental ICER (USD per DALY)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Break-even DALYs per child at USD 800 / 2,400 / 7,200</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.scenario_id} style={{ background: r.status === 'frontier' ? '#e8f5e9' : 'transparent' }}>
                          <td style={tdStyle}><strong>{r.scenario_id}</strong> {SCENARIO_LABELS[r.scenario_id]}</td>
                          <td style={tdStyle}>{statusText(r)}</td>
                          <td style={num}>{r.incremental_icer != null ? `${icerText(r.incremental_icer)} vs ${r.compared_with}` : '--'}</td>
                          <td style={num}>
                            {r.breakeven_800 != null
                              ? `${be(r.breakeven_800)} / ${be(r.breakeven_2400)} / ${be(r.breakeven_7200)}`
                              : '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Each Package Against the Status Quo</h3>
        <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>
          Mean incremental cost and DALYs averted with 95% uncertainty intervals from 5,000 probabilistic draws. Against the status quo
          every package looks favourable; the incremental analysis above is the comparison for choosing among them.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Community type</th>
                <th style={thStyle}>Package</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Incremental cost, USD (95% UI)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>DALYs averted (95% UI)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>ICER (USD per DALY)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>P(dominant)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>P(CE) at USD 800 / 2,400 / 7,200</th>
              </tr>
            </thead>
            <tbody>
              {TYPOLOGIES.flatMap((typ) => vs.filter((r) => r.typology === typ)).map((r, i) => (
                <tr key={`${r.typology}-${r.scenario_id}`} style={{ borderTop: i === 5 ? '2px solid #c7cfc7' : undefined }}>
                  <td style={tdStyle}>{r.typology}</td>
                  <td style={tdStyle}><strong>{r.scenario_id}</strong> {SCENARIO_LABELS[r.scenario_id]}</td>
                  <td style={num}>{usd(r.cost)} ({usd(r.cost_low)} to {usd(r.cost_high)})</td>
                  <td style={num}>{usd(r.dalys)} ({usd(r.dalys_low)} to {usd(r.dalys_high)})</td>
                  <td style={num}>{r.cost_saving ? 'Cost-saving' : icerText(r.icer)}</td>
                  <td style={num}>{prob(r.p_dominant)}</td>
                  <td style={num}>{prob(r.p_ce_800)} / {prob(r.p_ce_2400)} / {prob(r.p_ce_7200)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Methods and Assumptions</h3>
        <ul style={{ fontSize: '0.84rem', color: '#0d1b2a', lineHeight: 1.6, paddingLeft: '1.2rem', margin: 0 }}>
          <li>Decision-analytic model with four health states (unvaccinated, vaccinated, disease episode, death); societal perspective; five-year horizon; 3% annual discounting; 5,000 probabilistic draws; reported in line with CHEERS 2022.</li>
          <li>GDP-based thresholds lack country specificity, so results are shown at USD 800, 2,400 and 7,200 per DALY averted rather than against a single decision rule.</li>
          <li>Unit costs and the DALYs averted per zero-dose child (median 0.060) are literature-informed assumptions, and the cost sources state no price year.</li>
          <li>The DALY value was the only parameter with non-zero expected value of partial perfect information, so the break-even values show how far it would have to move to change each decision.</li>
          <li>The packages are those simulated by the linked agent-based simulation, which has no independent validation.</li>
        </ul>
      </GlassCard>
    </div>
  );
}
