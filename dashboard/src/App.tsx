import { useMemo, useState } from 'react';
import { Activity, CircleHelp, Film, Flame, Gauge, LineChart, Search, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const niches = [
  { niche: 'AI Agents', opportunity: 92, growth: 41, competition: 58, breakouts: 38, smallWins: 76, monetization: 91 },
  { niche: 'Humanoid Robotics', opportunity: 89, growth: 63, competition: 37, breakouts: 22, smallWins: 83, monetization: 88 },
  { niche: 'AI Video', opportunity: 87, growth: 36, competition: 61, breakouts: 44, smallWins: 71, monetization: 90 },
  { niche: 'Creator Automation', opportunity: 85, growth: 33, competition: 46, breakouts: 29, smallWins: 79, monetization: 86 },
  { niche: 'AI Coding', opportunity: 84, growth: 27, competition: 72, breakouts: 51, smallWins: 64, monetization: 92 },
  { niche: 'Home Robotics', opportunity: 82, growth: 44, competition: 31, breakouts: 17, smallWins: 81, monetization: 80 },
  { niche: 'Micro SaaS', opportunity: 80, growth: 24, competition: 68, breakouts: 26, smallWins: 61, monetization: 94 },
  { niche: 'Longevity', opportunity: 78, growth: 19, competition: 55, breakouts: 21, smallWins: 58, monetization: 89 },
  { niche: 'Personal Finance AI', opportunity: 77, growth: 22, competition: 74, breakouts: 32, smallWins: 49, monetization: 96 },
  { niche: 'Local Business AI', opportunity: 75, growth: 18, competition: 42, breakouts: 18, smallWins: 73, monetization: 95 },
];

const trend = [64, 66, 69, 71, 74, 73, 77, 80, 84, 86, 89, 92];
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

  const filtered = useMemo(() => niches.filter(n => n.niche.toLowerCase().includes(query.toLowerCase())), [query]);

  const trendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 18, top: 28, bottom: 32 },
    xAxis: { type: 'category', boundaryGap: false, data: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'] },
    yAxis: { type: 'value', min: 50, max: 100 },
    series: [
      { name: 'Opportunity', type: 'line', smooth: true, data: trend, symbolSize: 7, areaStyle: { opacity: 0.08 } },
      { name: 'Breakouts', type: 'line', smooth: true, data: breakoutTrend.map(v => 52 + v), symbolSize: 6 },
    ],
  };

  const scatterOption = {
    tooltip: { formatter: (p: any) => `${p.data[3]}<br/>Growth: ${p.data[0]}%<br/>Competition: ${p.data[1]}<br/>Opportunity: ${p.data[2]}` },
    grid: { left: 42, right: 24, top: 20, bottom: 38 },
    xAxis: { name: 'Growth', type: 'value' },
    yAxis: { name: 'Competition', type: 'value', min: 0, max: 100 },
    series: [{
      type: 'scatter',
      symbolSize: (v: number[]) => 10 + v[2] / 3,
      data: niches.map(n => [n.growth, n.competition, n.opportunity, n.niche]),
    }],
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">P</div>
        <nav>
          <button className="nav-active"><Activity size={19}/><span>Pulse</span></button>
          <button><Film size={19}/><span>OpenCut</span></button>
          <button><Target size={19}/><span>Watch</span></button>
        </nav>
        <div className="help-wrap" onMouseLeave={() => setHelpOpen(false)}>
          <button className="help-button" onMouseEnter={() => setHelpOpen(true)} onClick={() => setHelpOpen(v => !v)}>
            <CircleHelp size={19}/><span>Help</span>
          </button>
          {helpOpen && (
            <div className="help-popover" onMouseEnter={() => setHelpOpen(true)}>
              <strong>Start anywhere</strong>
              <button onClick={() => setMode('discover')}>Find a profitable niche</button>
              <button onClick={() => setMode('business')}>Create for a business</button>
              <button onClick={() => setMode('topic')}>Research a topic I know</button>
              <hr />
              <p><b>Opportunity</b> combines demand, growth, breakout activity, competition, small-channel success, monetization and confidence.</p>
              <p><b>Breakouts</b> are videos materially outperforming their channel baseline.</p>
              <p><b>Small-channel wins</b> estimates how often smaller creators are breaking through.</p>
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
          <button className="voice"><Sparkles size={17}/> Ask Pulse</button>
        </header>

        <section className="launch-card">
          <div className="mode-tabs">
            <button className={mode === 'discover' ? 'active' : ''} onClick={() => setMode('discover')}>Start from money</button>
            <button className={mode === 'business' ? 'active' : ''} onClick={() => setMode('business')}>Start from business</button>
            <button className={mode === 'topic' ? 'active' : ''} onClick={() => setMode('topic')}>Start from topic</button>
          </div>
          <div className="search-row">
            <Search size={20}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={mode === 'discover' ? 'Search niches, markets, trends…' : mode === 'business' ? 'Enter a business or industry…' : 'Enter a topic or creator…'} />
            <button>Analyze</button>
          </div>
        </section>

        <section className="kpi-grid">
          <Kpi icon={<Gauge/>} label="Opportunity" value={selected.opportunity} suffix="/100" delta="Composite market score" />
          <Kpi icon={<TrendingUp/>} label="Growth" value={selected.growth} suffix="%" delta="Momentum vs prior window" />
          <Kpi icon={<Flame/>} label="Breakouts" value={selected.breakouts} delta="Qualified abnormal winners" />
          <Kpi icon={<Users/>} label="Small wins" value={selected.smallWins} suffix="%" delta="Smaller creators breaking through" />
          <Kpi icon={<Target/>} label="Monetization" value={selected.monetization} suffix="/100" delta="Commercial-value estimate" />
        </section>

        <section className="chart-grid">
          <div className="panel wide">
            <div className="panel-head"><div><span className="mini">MOMENTUM</span><h2>{selected.niche} trajectory</h2></div><button>12 months</button></div>
            <ReactECharts option={trendOption} style={{height: 300}} />
          </div>
          <div className="panel">
            <div className="panel-head"><div><span className="mini">MARKET MAP</span><h2>Growth vs competition</h2></div></div>
            <ReactECharts option={scatterOption} style={{height: 300}} />
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-head"><div><span className="mini">DISCOVERY</span><h2>Top emerging niches</h2></div><button>View all</button></div>
          <div className="niche-table">
            <div className="table-row table-head"><span>Niche</span><span>Opportunity</span><span>Growth</span><span>Competition</span><span>Breakouts</span><span>Small wins</span><span>Monetization</span></div>
            {filtered.map(n => (
              <button key={n.niche} className={`table-row ${selected.niche === n.niche ? 'selected' : ''}`} onClick={() => setSelected(n)}>
                <span className="niche-name">{n.niche}</span>
                <span><b className={scoreTone(n.opportunity)}>{n.opportunity}</b></span>
                <span>+{n.growth}%</span>
                <span>{n.competition}</span>
                <span>{n.breakouts}</span>
                <span>{n.smallWins}%</span>
                <span>{n.monetization}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="diagnosis-grid">
          <div className="panel">
            <span className="mini">WHY IT IS INTERESTING</span>
            <h2>{selected.niche}</h2>
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
            <div className="step">1 <span>Find opportunity</span></div>
            <div className="step">2 <span>Analyze winning videos</span></div>
            <div className="step">3 <span>Generate CreativeSpec + script</span></div>
            <div className="step">4 <span>Send assets to Higgsfield / edit in OpenCut</span></div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Kpi({icon, label, value, suffix = '', delta}: {icon: React.ReactNode; label: string; value: number; suffix?: string; delta: string}) {
  return <div className="kpi"><div className="kpi-icon">{icon}</div><div><span>{label}</span><strong>{value}{suffix}</strong><small>{delta}</small></div></div>;
}
