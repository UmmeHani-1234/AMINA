import { useMemo, useState } from "react";
import { Appear } from "arwes";
import { useMission } from "../context/MissionContext";
import "./Dashboard.css";

const targetSeed = [
  { id: "01", name: "Basalt Ridge", science: 72, confidence: 88, access: 74, distance: 22, risk: 28, energy: 34, status: "GOOD" },
  { id: "03", name: "Layered Outcrop", science: 79, confidence: 84, access: 69, distance: 18, risk: 41, energy: 31, status: "VISITED" },
  { id: "07", name: "Hydrated Vein", science: 87, confidence: 91, access: 81, distance: 14, risk: 35, energy: 29, status: "HIGH PRIORITY" },
  { id: "09", name: "Shadow Crater", science: 92, confidence: 76, access: 42, distance: 31, risk: 68, energy: 52, status: "HIGH RISK" },
];

const healthBase = [
  ["Battery", "78%", "nominal"], ["Motor current", "1.8 A", "nominal"], ["Motor temperature", "38 C", "nominal"],
  ["Wheel status", "4 / 4", "nominal"], ["Camera", "ONLINE", "nominal"], ["LiDAR / depth", "ONLINE", "nominal"],
  ["IMU", "LOCKED", "nominal"], ["Computing / AI", "NOMINAL", "nominal"], ["Communication", "LINKED", "nominal"],
];

function utility(target, battery, hazard) {
  const batteryPenalty = battery < 35 ? 20 : battery < 60 ? 8 : 0;
  const hazardPenalty = hazard && target.id === "07" ? 25 : 0;
  return Math.max(0, Math.round(target.science * 0.42 + target.access * 0.2 + target.confidence * 0.18 - target.energy * 0.1 - target.risk * 0.1 - batteryPenalty - hazardPenalty));
}

const Dashboard = ({ entered }) => {
  const { scenario, setScenario, current, events, scenarioData } = useMission();
  const [showWhy, setShowWhy] = useState(false);

  const rankedTargets = useMemo(() => targetSeed.map(target => ({ ...target, utility: utility(target, current.battery, current.hazard) })).sort((a, b) => b.utility - a.utility), [current]);
  const selected = rankedTargets[0];
  const energyState = current.battery >= 75 ? "HIGH" : current.battery >= 35 ? "MEDIUM" : current.battery >= 15 ? "LOW" : "CRITICAL";
  const energyMode = energyState === "HIGH" ? "EXPLORE BROADLY" : energyState === "MEDIUM" ? "BALANCE SCIENCE / RESOURCES" : energyState === "LOW" ? "PRIORITISE RETURN / SAFETY" : "SAFE MODE";
  const runScenario = (key) => { setScenario(key); };

  return <Appear id="dashboard" animate show={entered}>
    <div className="dashboard-shell">

      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">AMINA-LUNAR / LIVE MISSION OPERATIONS</p>
          <h1>Mission intelligence, in the loop.</h1>
          <p className="hero-copy">AMINA does not just collect data. It uses data to make mission decisions, monitors itself, and changes its plan when conditions change.</p>
        </div>
        <div className="demo-control">
          <span className="live-dot" /> DEMO MODE
          <select value={scenario} onChange={event => runScenario(event.target.value)} aria-label="Choose simulation scenario">
            {Object.entries(scenarioData).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
          </select>
        </div>
      </section>

      <section className="video-hero-banner">
        <video autoPlay muted loop playsInline className="video-hero-bg">
          <source src="/img/iss-timelapse.mp4" type="video/mp4" />
        </video>
        <div className="video-hero-overlay">
          <div className="video-hero-hud-top">
            <span><span className="live-dot" /> ISS ORBITAL FEED &middot; 412 km ALT &middot; 7.66 km/s</span>
            <span>FULL MOON PASS &middot; EUROPE / MIDDLE EAST</span>
          </div>
          <div className="video-hero-center">
            <p className="eyebrow" style={{ marginBottom: 10 }}>AMINA-LUNAR</p>
            <h2 className="video-hero-title">MISSION CONTROL</h2>
            <p className="video-hero-sub">Real-time orbital telemetry &middot; Rover autonomy &middot; Spacecraft FDIR</p>
          </div>
          <div className="video-hero-hud-bottom">
            <span>ALTITUDE: 412 km</span>
            <span>VELOCITY: 7.66 km/s</span>
            <span>PERIOD: 92.6 min</span>
            <span>INCLINATION: 51.6deg</span>
            <span>STATUS: <b style={{ color: "#b5ff74" }}>NOMINAL</b></span>
          </div>
        </div>
      </section>

      <section className="metric-strip" aria-label="Mission summary">
        <div><span>MISSION</span><strong>ALPHA / SOL 042</strong><small>PLANETARY SURVEY</small></div>
        <div><span>ROVER STATE</span><strong className={current.status === "NOMINAL" ? "good" : "warn"}>{current.status}</strong><small>AMINA ROVER &middot; 04:18:22 UPTIME</small></div>
        <div><span>ACTIVE TARGET</span><strong>TARGET #{selected.id}</strong><small>{selected.name} &middot; {selected.distance} m</small></div>
        <div><span>MISSION PROGRESS</span><strong>64%</strong><small>OBJECTIVE 03 / 05</small></div>
      </section>

      <section className="video-feeds-section">
        <div className="panel-heading video-feeds-heading">
          <div><span className="section-index">00</span><h2>LIVE VIDEO FEEDS</h2></div>
          <span className="status-chip"><span className="live-dot" style={{ width: 5, height: 5 }} /> 3 ACTIVE FEEDS</span>
        </div>
        <div className="video-feeds-grid">
          <div className="video-feed-card">
            <div className="video-feed-label"><span className="live-dot" style={{ width: 5, height: 5, marginRight: 5 }} />ISS &middot; ORBITAL TIMELAPSE</div>
            <video autoPlay muted loop playsInline className="video-feed-player">
              <source src="/img/iss-timelapse.mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">FULL MOON PASS &middot; EUROPE / MIDDLE EAST &middot; JAN 2025</div>
          </div>
          <div className="video-feed-card">
            <div className="video-feed-label"><span className="live-dot" style={{ width: 5, height: 5, marginRight: 5 }} />ROVER &middot; SESSION 1</div>
            <video autoPlay muted loop playsInline className="video-feed-player">
              <source src="/img/recording-1.mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">MOBILITY TELEMETRY &middot; SOL 042 &middot; 18:17 UTC</div>
          </div>
          <div className="video-feed-card">
            <div className="video-feed-label"><span className="live-dot" style={{ width: 5, height: 5, marginRight: 5 }} />ROVER &middot; SESSION 3</div>
            <video autoPlay muted loop playsInline className="video-feed-player">
              <source src="/img/recording-3.mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">MOBILITY TELEMETRY &middot; SOL 042 &middot; 18:47 UTC</div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid top-grid">
        <div className="panel map-panel">
          <div className="panel-heading"><div><span className="section-index">01</span><h2>LIVE TERRAIN / MAP</h2></div><span className="status-chip">SIMULATED TERRAIN</span></div>
          <div className="terrain-map">
            <div className="map-label explored">EXPLORED REGION</div><div className="map-label destination">TARGET #{selected.id}</div><div className="map-label rover-label">ROVER / 64%</div>
            <svg viewBox="0 0 700 330" role="img" aria-label="Simulated terrain map with rover route and target">
              <path className="contour" d="M-20 220 C100 120 180 280 300 170 S520 80 740 170" /><path className="contour" d="M-20 265 C110 165 180 325 325 220 S545 135 740 225" />
              <path className={current.hazard ? "route route-alert" : "route"} d={current.hazard ? "M88 248 C200 235 260 100 390 132 S510 220 618 84" : "M88 248 C200 235 260 188 390 195 S510 150 618 84"} />
              <g className="map-rover" transform="translate(88 248) rotate(-13)" aria-label="AMINA six-wheel exploration rover">
                <ellipse className="rover-shadow" cx="0" cy="13" rx="29" ry="7" />
                <path className="rover-suspension" d="M-27 7 H27 M-21 7 L-14 15 M-7 7 L0 15 M7 7 L14 15 M21 7 L28 15" />
                <path className="rover-chassis" d="M-28-7 L-19-15 H19 L28-7 V6 H-28Z" />
                <path className="rover-deck" d="M-17-15 H17 L21-7 H-21Z" />
                <rect className="rover-camera-mast" x="-3" y="-30" width="6" height="15" rx="1" />
                <rect className="rover-camera" x="-8" y="-35" width="16" height="7" rx="2" />
                <circle className="rover-lens" cx="4" cy="-31.5" r="2" />
                <rect className="rover-panel" x="-14" y="-12" width="16" height="6" rx="1" />
                <path className="rover-antenna" d="M13-15 L18-29" />
                <circle className="rover-antenna-tip" cx="18" cy="-30" r="2" />
                <circle className="rover-wheel" cx="-21" cy="15" r="7" /><circle className="rover-wheel" cx="0" cy="15" r="7" /><circle className="rover-wheel" cx="21" cy="15" r="7" />
                <path className="rover-wheel-hub" d="M-24 15H-18 M-3 15H3 M18 15H24" />
              </g>
              <circle className="target-point" cx="618" cy="84" r="10" />
              <circle className="hazard-point" cx="390" cy="132" r={current.hazard ? 24 : 0} />
              <path className="explored-line" d="M88 248 L170 228 L250 235" />
            </svg>
            {current.hazard && <div className="hazard-callout">HAZARD DETECTED<br /><b>REROUTING</b></div>}
          </div>
          <div className="map-legend"><span><i className="key rover-key" />ROVER</span><span><i className="key target-key" />SCIENCE TARGET</span><span><i className="key hazard-key" />HIGH-RISK TERRAIN</span><span><i className="key route-key" />PLANNED PATH</span></div>
        </div>

        <div className="panel decision-panel">
          <div className="panel-heading"><div><span className="section-index">02</span><h2>MISSION DECISION ENGINE</h2></div><span className="decision-mark">DECISION READY</span></div>
          <div className="decision-callout"><span>AMINA DECISION</span><strong>TARGET #{selected.id} SELECTED</strong><p>{current.battery < 35 ? "Energy policy favours the most efficient valuable target." : current.hazard ? "Risk increased on the original route; an alternative path preserves mission value." : "High scientific value with acceptable terrain risk and energy requirement."}</p><button className="text-button" onClick={() => setShowWhy(value => !value)}>{showWhy ? "CLOSE EXPLANATION" : "WHY THIS DECISION?"}</button></div>
          {showWhy && <div className="explain-box"><b>WHY TARGET #{selected.id}?</b><ul><li>Science value: {selected.science}%</li><li>Confidence: {selected.confidence}%</li><li>Accessibility: {selected.access}%</li><li>{current.battery >= 35 ? "Battery sufficient for approach" : "Lowest energy cost in the candidate set"}</li></ul><strong>DECISION: APPROACH TARGET #{selected.id}</strong></div>}
          <div className="utility-list">{rankedTargets.map((target, index) => <div className={index === 0 ? "utility-row selected" : "utility-row"} key={target.id}><span><b>#{target.id}</b> {target.name}</span><span className="utility-bar"><i style={{ width: `${target.utility}%` }} /></span><strong>{target.utility}</strong></div>)}</div>
          <div className="formula">UTILITY = SCIENCE + ACCESSIBILITY - ENERGY - DISTANCE - RISK</div>
        </div>
      </section>

      <section className="dashboard-grid middle-grid">
        <div className="panel energy-panel"><div className="panel-heading"><div><span className="section-index">04</span><h2>ENERGY MANAGEMENT</h2></div><span className={`status-chip ${energyState === "LOW" ? "warning-chip" : ""}`}>{energyState}</span></div><div className="battery-readout"><strong>{current.battery}%</strong><span>BATTERY RESERVE</span></div><div className="battery-bar"><i style={{ width: `${current.battery}%` }} /></div><div className="energy-mode"><span>MISSION MODE</span><b>{energyMode}</b></div><div className="energy-scale"><span>CRITICAL<br />&lt;15%</span><span>LOW<br />15-34%</span><span>MEDIUM<br />35-74%</span><span>HIGH<br />75-100%</span></div></div>
      </section>

      <section className="dashboard-grid lower-grid">
        <div className="panel health-panel"><div className="panel-heading"><div><span className="section-index">05</span><h2>ROVER HEALTH</h2></div><span className={current.status === "NOMINAL" ? "status-chip" : "status-chip warning-chip"}>{current.status}</span></div><div className="health-grid">{healthBase.map(([label, value]) => <div className="health-row" key={label}><span className="health-led" /><span>{label}</span><b>{label === "Battery" ? `${current.battery}%` : scenario === "fault" && label === "Motor current" ? "4.9 A" : value}</b></div>)}</div>{scenario === "fault" && <div className="fault-banner"><b>FAULT DETECTED &middot; OPEN FDIR</b><span>Left wheel current abnormal &middot; select FDIR for isolation and recovery details</span></div>}</div>
        <div className="panel target-panel"><div className="panel-heading"><div><span className="section-index">06</span><h2>SCIENCE TARGETS</h2></div><span className="status-chip">4 DETECTED</span></div><div className="target-table">{rankedTargets.map(target => <div className="target-row" key={target.id}><div><b>#{target.id}</b><span>{target.name}</span></div><div><span>SCIENCE <b>{target.science}%</b></span><span>CONFIDENCE <b>{target.confidence}%</b></span></div><div><span>RISK <b>{target.risk}%</b></span><span>DISTANCE <b>{target.distance} m</b></span></div><strong className={target === selected ? "priority" : ""}>{target === selected ? "SELECTED" : target.status}</strong></div>)}</div></div>
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="panel log-panel"><div className="panel-heading"><div><span className="section-index">07</span><h2>LIVE MISSION EVENT LOG</h2></div><span className="status-chip">STREAMING</span></div><div className="event-list">{events.map(([time, message, type], index) => <div className="event-row" key={`${time}-${index}`}><time>{time}</time><span className="event-type">{type}</span><b>{message}</b></div>)}</div></div>
        <div className="panel telemetry-panel"><div className="panel-heading"><div><span className="section-index">08</span><h2>ADAPTIVE TELEMETRY</h2></div><span className="status-chip">{current.bandwidth}</span></div><div className="telemetry-copy">AMINA prioritises mission-critical information before bandwidth is spent on detail.</div><div className="telemetry-list"><span className="sending">&#10003; P1 Critical health / fault</span><span className="sending">&#10003; P2 Target #{selected.id} science result</span><span className="sending">&#10003; P3 Rover position</span><span className="deferred">&#9675; P4 Full-resolution image</span><span className="deferred">&#9675; Routine telemetry batch</span></div></div>
      </section>

    </div>
  </Appear>;
};

export default Dashboard;
