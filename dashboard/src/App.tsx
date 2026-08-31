import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CircleHelp,
  Film,
  Flame,
  Gauge,
  Radar,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const COLORS = {
  green: '#24d18a',
  red: '#ff4d5e',
  cyan: '#37c8ff',
  purple: '#9b7cff',
  amber: '#ffbe55',
  blue: '#5c8dff',
  muted: '#718096',
};

const niches = [
  { niche: 'AI Agents', opportunity: 92, growth: 41, competition: 58, breakouts: 38, smallWins: 76, monetization: 91, trend: 'up' },
  { niche: 'Humanoid Robotics', opportunity: 89, growth: 63, competition: 37, breakouts: 22, smallWins: 83, monetization: 88, trend: 'up' },
  { niche: 'AI Video', opportunity: 87, growth: 36, competition: 61, breakouts: 44, smallWins: 71, monetization: 90, trend: 'up' },
  { niche: 'Creator Automation', opportunity: 85, growth: 33, competition: 46, breakouts: 29, smallWins: 79, monetization: 86, trend: 'up' },
  { niche: 'AI Coding', opportunity: 84, growth: 27, competition: 72, breakouts: 51, smallWins: 64, monetization: 92, trend: 'up' },
  { niche: 'Home Robotics', opportunity: 82, growth: 44, competition: 31, breakouts: 17, smallWins: 81, monetization: 80, trend: 'up' },
  { niche: 'Micro SaaS', opportunity: 80, growth: 24, competition: 68, breakouts: 26, smallWins: 61, monetization: 94, trend: 'flat' },
  { niche: 'Longevity', opportunity: 78, growth: 19, competition: 55, breakouts: 21, smallWins: 58, monetization: 89, trend: 'flat' },
  { niche: 'Personal Finance AI', opportunity: 77, growth: 22, competition: 74, breakouts: 32, smallWins: 49, monetization: 96, trend: 'down' },
  { niche: 'Local Business AI', opportunity: 75, growth: 18, competition: 42, breakouts: 18, smallWins: 73, monetization: 95, trend: 'up' },
];

const opportunityTrend = [64, 66, 69, 71, 74, 73, 77, 80, 84, 86, 89, 92];
const growthTrend = [8, 11, 13, 16, 18, 17, 22, 26, 29, 33, 37, 41];
const competitionTrend = [44, 46, 47, 49, 50, 52, 53, 55, 56, 57, 58, 58];
const breakoutTrend = [11, 13, 12, 15, 17, 19, 21, 24, 26, 30, 34, 38];

function scoreTone(score: number) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  return 'watch';
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(niches[0]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mode, setMode] = useState<'discover' | 'business' | 'topic'>('discover');

  const filtered = useMemo(
    () => niches.filter((n) => n.niche.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const trendOption = {
    color: [COLORS.green, COLORS.cyan, COLORS.red, COLORS.purple],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0b111c',
      borderColor: 'rgba(255,255,255,.12)',
      textStyle: { color: '#f7f9ff' },
    },
    legend: {
      data: ['Opportunity', 'Growth', 'Competition', 'Breakouts'],
      textStyle: { color: '#8f9bb0' },
      top: 0,
      right: 8,
    },
    grid: { left: 42, right: 18, top: 50, bottom: 32 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } },
      axisLabel: { color: '#66748b' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: 'rgba(255,255,255,.055)' } },
      axisLabel: { color: '#66748b' },
    },
    series: [
      {
        name: 'Opportunity',
        type: 'line',
        smooth: true,
        data: opportunityTrend,
        symbolSize: 6,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.1 },
      },
      { name: 'Growth', type: 'line', smooth: true, data: growthTrend, symbolSize: 5, lineStyle: { width: 2 } },
      { name: 'Competition', type: 'line', smooth: true, data: competitionTrend, symbolSize: 5, lineStyle: { width: 2 } },
      {
        name: 'Breakouts',
        type: 'line',
        smooth: true,
        data: breakoutTrend.map((v) => Math.min(100, v * 1.7)),
        symbolSize: 5,
        lineStyle: { width: 2 },
      },
    ],
  };

  const scatterOption = {
    color: niches.map((n) => (n.competition > 65 ? COLORS.red : n.opportunity >= 85 ? COLORS.green : COLORS.cyan)),
    tooltip: {
      backgroundColor: '#0b111c',
      borderColor: 'rgba(255,255,255,.12)',
      textStyle: { color: '#f7f9ff' },
      formatter: (p: any) => `${p.data[3]}<br/>Growth: ${p.data[0]}%<br/>Competition: ${p.data[1]}<br/>Opportunity: ${p.data[2]}`,
    },
    grid: { left: 48, right: 24, top: 24, bottom: 42 },
    xAxis: {
      name: 'Growth →',
      type: 'value',
      axisLabel: { color: '#66748b' },
      nameTextStyle: { color: '#66748b' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,.055)' } },
    },
    yAxis: {
      name: 'Competition →',
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: '#66748b' },
      nameTextStyle: { color: '#66748b' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,.055)' } },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (v: number[]) => 10 + v[2] / 3,
        data: niches.map((n) => ({
          value: [n.growth, n.competition, n.opportunity, n.niche],
          itemStyle: {
            color: n.competition > 65 ? COLORS.red : n.opportunity >= 85 ? COLORS.green : COLORS.cyan,
            shadowBlur: 18,
            shadowColor: n.competition > 65 ? `${COLORS.red}55` : `${COLORS.green}44`,
          },
        })),
      },
    ],
  };

  const categoryOption = {
    color: [COLORS.green, COLORS.purple, COLORS.cyan, COLORS.amber, COLORS.red],
    tooltip: { trigger: 'item', backgroundColor: '#0b111c', borderColor: 'rgba(255,255,255,.12)', textStyle: { color: '#fff' } },
    legend: { bottom: 0, textStyle: { color: '#718096' } },
    series: [
      {
        type: 'pie',
        radius: ['55%', '76%'],
        center: ['50%', '43%'],
        itemStyle: { borderColor: '#101724', borderWidth: 4, borderRadius: 8 },
        label: { show: false },
        data: [
          { value: 34, name: 'Tutorial' },
          { value: 24, name: 'News' },
          { value: 19, name: 'Experiment' },
          { value: 14, name: 'Opinion' },
          { value: 9, name: 'Other' },
        ],
      },
    ],
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><Zap size={20} /></div>
        <nav>
          <button className="nav-active"><Activity size={19} /><span>Pulse</span></button>
          <button><Film size={19} /><span>OpenCut</span></button>
          <button><Radar size={19} /><span>Watch</span></button>
        </nav>
        <div className="sidebar-status">
          <span className="live-dot" />
          <small>Market live</small>
        </div>
        <div className="help-wrap" onMouseLeave={() => setHelpOpen(false)}>
          <button
            className="help-button"
            onMouseEnter={() => setHelpOpen(true)}
            onClick={() => setHelpOpen((v) => !v)}
          >
            <CircleHelp size={19} /><span>Help</span>
          </button>
          {helpOpen && (
            <div className="help-popover" onMouseEnter={() => setHelpOpen(true)}>
              <div className="help-title"><Sparkles size={15} /><strong>Start anywhere</strong></div>
              <button onClick={() => setMode('discover')}>Find a profitable niche</button>
              <button onClick={() => setMode('business')}>Create for a business</button>
              <button onClick={() => setMode('topic')}>Research a topic I know</button>
              <hr />
              <p><b>Opportunity</b> combines demand, growth, breakout activity, competition, small-channel success, monetization and confidence.</p>
              <p><b>Competition</b> estimates how crowded and difficult the niche is. Higher is harder.</p>
              <p><b>Breakouts</b> are videos materially outperforming their channel baseline.</p>
              <p><b>Small wins</b> estimates how often smaller creators are breaking through.</p>
            </div>
          )}
        </div>
      </aside>

      <main className="content">
        <header>
          <div>
            <div className="eyebrow">CONTENT MARKET INTELLIGENCE</div>
            <h1>Pulse</h1>
            <p>Find where attention is moving, why content wins, and what to create next.</p>
          </div>
          <div className="header-actions">
            <div className="signal-pill"><span /> Live signals</div>
            <button className="voice"><Sparkles size={17} /> Ask Pulse</button>
          </div>
        </header>

        <section className="launch-card">
          <div className="launch-copy">
            <span className="mini">START HERE</span>
            <h2>What are you trying to win?</h2>
          </div>
          <div className="mode-tabs">
            <button className={mode === 'discover' ? 'active' : ''} onClick={() => setMode('discover')}>Find money</button>
            <button className={mode === 'business' ? 'active' : ''} onClick={() => setMode('business')}>Grow a business</button>
            <button className={mode === 'topic' ? 'active' : ''} onClick={() => setMode('topic')}>Research a topic</button>
          </div>
          <div className="search-row">
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'discover' ? 'Search niches, markets, trends…' : mode === 'business' ? 'Enter a business or industry…' : 'Enter a topic or creator…'}
            />
            <button>Analyze market</button>
          </div>
        </section>

        <section className="kpi-grid">
          <Kpi tone="green" icon={<Gauge />} label="Opportunity" value={selected.opportunity} suffix="/100" delta="Composite market score" positive />
          <Kpi tone="cyan" icon={<TrendingUp />} label="Growth" value={selected.growth} suffix="%" delta="Momentum vs prior window" positive />
          <Kpi tone="purple" icon={<Flame />} label="Breakouts" value={selected.breakouts} delta="Qualified abnormal winners" positive />
          <Kpi tone="amber" icon={<Users />} label="Small wins" value={selected.smallWins} suffix="%" delta="Smaller creators breaking through" positive />
          <Kpi tone="red" icon={<Target />} label="Competition" value={selected.competition} suffix="/100" delta="Higher means harder to enter" positive={false} />
          <Kpi tone="blue" icon={<Zap />} label="Monetization" value={selected.monetization} suffix="/100" delta="Commercial-value estimate" positive />
        </section>

        <section className="chart-grid primary-charts">
          <div className="panel wide">
            <div className="panel-head">
              <div><span className="mini">MARKET MOMENTUM</span><h2>{selected.niche} trajectory</h2></div>
              <button>12 months</button>
            </div>
            <ReactECharts option={trendOption} style={{ height: 318 }} />
          </div>
          <div className="panel market-map">
            <div className="panel-head"><div><span className="mini">OPPORTUNITY MAP</span><h2>Growth vs competition</h2></div></div>
            <ReactECharts option={scatterOption} style={{ height: 318 }} />
            <div className="map-legend"><span className="green-dot" /> high opportunity <span className="red-dot" /> crowded</div>
          </div>
        </section>

        <section className="secondary-grid">
          <div className="panel insight-card">
            <span className="mini">MARKET SIGNAL</span>
            <div className="signal-score-row">
              <div className="signal-score">{selected.opportunity}</div>
              <div>
                <h2>Strong entry window</h2>
                <p>Growth and small-channel wins are outrunning competitive pressure.</p>
              </div>
            </div>
            <div className="signal-bars">
              <SignalBar label="Demand" value={91} tone="green" />
              <SignalBar label="Freshness" value={86} tone="cyan" />
              <SignalBar label="Creator access" value={selected.smallWins} tone="purple" />
              <SignalBar label="Saturation risk" value={selected.competition} tone="red" />
            </div>
          </div>
          <div className="panel format-card">
            <span className="mini">FORMAT MIX</span>
            <h2>What is winning</h2>
            <ReactECharts option={categoryOption} style={{ height: 255 }} />
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-head">
            <div><span className="mini">DISCOVERY</span><h2>Top emerging niches</h2></div>
            <button>View all</button>
          </div>
          <div className="niche-table">
            <div className="table-row table-head"><span>Niche</span><span>Opportunity</span><span>Growth</span><span>Competition</span><span>Breakouts</span><span>Small wins</span><span>Monetization</span></div>
            {filtered.map((n) => (
              <button key={n.niche} className={`table-row ${selected.niche === n.niche ? 'selected' : ''}`} onClick={() => setSelected(n)}>
                <span className="niche-name"><span className={`trend-icon ${n.trend}`}>{n.trend === 'down' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}</span>{n.niche}</span>
                <span><b className={scoreTone(n.opportunity)}>{n.opportunity}</b></span>
                <span className="positive">+{n.growth}%</span>
                <span className={n.competition > 65 ? 'negative' : ''}>{n.competition}</span>
                <span>{n.breakouts}</span>
                <span>{n.smallWins}%</span>
                <span>{n.monetization}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="diagnosis-grid">
          <div className="panel diagnosis-card">
            <span className="mini">WHY IT IS INTERESTING</span>
            <h2>{selected.niche}</h2>
            <div className="reason-grid">
              <Reason label="Momentum" value="Accelerating" tone="green" />
              <Reason label="Distribution" value="Accessible" tone="cyan" />
              <Reason label="Competition" value={selected.competition > 65 ? 'Crowded' : 'Manageable'} tone={selected.competition > 65 ? 'red' : 'green'} />
              <Reason label="Money" value="Strong" tone="purple" />
            </div>
            <ul>
              <li>Momentum is accelerating relative to its recent baseline.</li>
              <li>Small-channel breakout rate is high enough to signal accessible distribution.</li>
              <li>Commercial intent is strong enough to support customers, sponsorships or product demand.</li>
              <li>Next drill-down: winning topics, hooks, first 0–3 seconds, visuals, metadata and creative DNA.</li>
            </ul>
            <button className="primary">Diagnose winning videos</button>
          </div>
          <div className="panel next-step">
            <span className="mini">PRODUCTION HANDOFF</span>
            <h2>From signal to video</h2>
            <div className="step"><b>1</b><span>Find opportunity</span><small>Pulse</small></div>
            <div className="step"><b>2</b><span>Analyze winning videos</span><small>Creative DNA</small></div>
            <div className="step"><b>3</b><span>Generate CreativeSpec + script</span><small>AI</small></div>
            <div className="step"><b>4</b><span>Generate + edit</span><small>Higgsfield → OpenCut</small></div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Kpi({ icon, label, value, suffix = '', delta, tone, positive }: { icon: React.ReactNode; label: string; value: number; suffix?: string; delta: string; tone: string; positive: boolean }) {
  return (
    <div className={`kpi tone-${tone}`}>
      <div className="kpi-top"><div className="kpi-icon">{icon}</div><span className={`direction ${positive ? 'up' : 'risk'}`}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}</span></div>
      <span>{label}</span>
      <strong>{value}{suffix}</strong>
      <small>{delta}</small>
    </div>
  );
}

function SignalBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="signal-bar">
      <div><span>{label}</span><b>{value}</b></div>
      <div className="bar-track"><span className={`bar-fill tone-${tone}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Reason({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className={`reason tone-${tone}`}><span>{label}</span><strong>{value}</strong></div>;
}
