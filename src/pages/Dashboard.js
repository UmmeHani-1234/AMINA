import { useMemo, useState, useCallback, memo } from "react";
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

const Dashboard = memo(({ entered }) => {
  const { scenario, setScenario, current, events, scenarioData } = useMission();
  const [showWhy, setShowWhy] = useState(false);

  const rankedTargets = useMemo(() => targetSeed.map(target => ({ ...target, utility: utility(target, current.battery, current.hazard) })).sort((a, b) => b.utility - a.utility), [current]);
  const selected = rankedTargets[0];
  const runScenario = useCallback((key) => { setScenario(key); }, [setScenario]);

  return <Appear id="dashboard" animate show={entered}>
    <div className="dashboard-shell">

      <section className="video-hero-banner">
        <video autoPlay muted loop playsInline preload="metadata" className="video-hero-bg">
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

      <section className="mission-modes-bar" aria-label="Mission simulation modes">
        <div className="mode-bar-header">
          <span className="live-dot" />
          <span>SIMULATION MODE</span>
        </div>
        <div className="mode-bar-controls">
          <div className="mode-bar-pills">
            {Object.entries(scenarioData).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={`mode-pill ${scenario === key ? "active" : ""}`}
                onClick={() => runScenario(key)}
              >
                {value.label}
              </button>
            ))}
          </div>
          <div className="mode-bar-select-wrap">
            <select
              value={scenario}
              onChange={event => runScenario(event.target.value)}
              aria-label="Choose simulation scenario"
              className="mode-bar-select"
            >
              {Object.entries(scenarioData).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
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
          <span className="status-chip"><span className="live-dot" style={{ width: 5, height: 5 }} /> 4 ACTIVE FEEDS</span>
        </div>
        <div className="video-feeds-grid">
          <div className="video-feed-card video-feed-primary">
            <div className="video-feed-label">
              <span className="live-dot" style={{ width: 6, height: 6, marginRight: 6 }} />
              <strong style={{ color: "#b5ff74", marginRight: 8, letterSpacing: "1.5px" }}>[PRIMARY FEED]</strong>
              ROVER &middot; LATEST TELEMETRY
            </div>
            <video autoPlay muted loop playsInline preload="metadata" className="video-feed-player">
              <source src="/img/recording-3.mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">
              <b style={{ color: "#b5ff74", marginRight: 6 }}>● ACTIVE STREAM</b> &middot; MOBILITY TELEMETRY &middot; SOL 042 &middot; 18:47 UTC
            </div>
          </div>
          <div className="video-feed-card">
            <div className="video-feed-label">
              <span className="live-dot" style={{ width: 5, height: 5, marginRight: 5 }} />
              ROVER &middot; PLAYBACK 1
            </div>
            <video autoPlay muted loop playsInline preload="metadata" className="video-feed-player">
              <source src="/img/videoplayback (1).mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">SURFACE CAM &middot; PLAYBACK 01 ARCHIVE</div>
          </div>
          <div className="video-feed-card">
            <div className="video-feed-label">
              <span className="live-dot" style={{ width: 5, height: 5, marginRight: 5 }} />
              ROVER &middot; PLAYBACK 2
            </div>
            <video autoPlay muted loop playsInline preload="metadata" className="video-feed-player">
              <source src="/img/videoplayback (2).mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">SURFACE CAM &middot; PLAYBACK 02 ARCHIVE</div>
          </div>
          <div className="video-feed-card">
            <div className="video-feed-label">
              <span className="live-dot" style={{ width: 5, height: 5, marginRight: 5 }} />
              ISS &middot; ORBITAL TIMELAPSE
            </div>
            <video autoPlay muted loop playsInline preload="metadata" className="video-feed-player">
              <source src="/img/iss-timelapse.mp4" type="video/mp4" />
            </video>
            <div className="video-feed-footer">FULL MOON PASS &middot; EUROPE / MIDDLE EAST &middot; JAN 2025</div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid top-grid">
        <div className="panel map-panel">
          <div className="panel-heading">
            <div><span className="section-index">01</span><h2>LIVE TERRAIN / MAP</h2></div>
            <span className="status-chip">HiRISE ORBITAL TOPOGRAPHY &middot; 0.25 m/px</span>
          </div>
          <div className="terrain-map terrain-map-real">
            <img src="/img/mars-terrain-map.jpg" alt="HiRISE Orbital Mars Jezero Crater Terrain" className="terrain-photo-bg" loading="lazy" decoding="async" />
            <div className="terrain-photo-overlay" />
            <div className="terrain-hud-grid" />

            <div className="map-label explored">EXPLORED CORRIDOR &middot; SOL 042</div>
            <div className="map-label destination">TARGET #{selected.id} &middot; {selected.name.toUpperCase()}</div>
            <div className="map-label rover-label">AMINA ROVER &middot; {current.battery}% PWR</div>
            <div className="map-coords-top">LAT: 18&deg;23'42.1"N &middot; LON: 77&deg;27'14.8"E</div>
            <div className="map-coords-bottom">ELEV: -2,560 m &middot; RES: 0.25 m/px &middot; TRAVERSABILITY: 84%</div>

            <svg viewBox="0 0 700 330" className="terrain-hud-svg" role="img" aria-label="Authentic Mars Jezero Crater traverse map with AMINA route and target">
              <defs>
                <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,100,100,0.5)" />
                  <stop offset="70%" stopColor="rgba(255,100,100,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,100,100,0)" />
                </radialGradient>
                <pattern id="hazardHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,115,115,0.4)" strokeWidth="2" />
                </pattern>
              </defs>

              <g className="hud-crosshairs" stroke="rgba(161,236,251,0.25)" strokeWidth="1">
                <path d="M100 70 H120 M110 60 V80" />
                <path d="M350 70 H370 M360 60 V80" />
                <path d="M580 70 H600 M590 60 V80" />
                <path d="M100 250 H120 M110 240 V260" />
                <path d="M350 250 H370 M360 240 V260" />
                <path d="M580 250 H600 M590 240 V260" />
              </g>

              <path className="explored-track" d="M30 290 L60 270 L95 245 L115 235" />

              <path
                className={current.hazard ? "route route-alert" : "route"}
                d={current.hazard ? "M115 235 C200 220 250 90 390 120 S510 200 605 92" : "M115 235 C210 220 280 170 390 180 S510 140 605 92"}
              />

              {current.hazard && (
                <g className="hazard-zone">
                  <circle cx="390" cy="120" r="38" fill="url(#hazardGlow)" />
                  <circle cx="390" cy="120" r="38" fill="url(#hazardHatch)" stroke="var(--red)" strokeWidth="1.5" strokeDasharray="5 3" />
                  <circle cx="390" cy="120" r="4" fill="var(--red)" />
                </g>
              )}

              <g className="tactical-rover" transform="translate(115 235)">
                <line x1="0" y1="0" x2="26" y2="-12" stroke="var(--cyan-bright)" strokeWidth="2" strokeDasharray="3 2" />
                <polygon points="26,-12 21,-16 23,-11 19,-9" fill="var(--cyan-bright)" />
                <circle cx="0" cy="0" r="16" fill="rgba(3,18,25,0.7)" stroke="var(--cyan-bright)" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(95,240,255,0.4)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="-20" x2="0" y2="-13" stroke="var(--cyan-bright)" strokeWidth="1.5" />
                <line x1="0" y1="13" x2="0" y2="20" stroke="var(--cyan-bright)" strokeWidth="1.5" />
                <line x1="-20" y1="0" x2="-13" y2="0" stroke="var(--cyan-bright)" strokeWidth="1.5" />
                <line x1="13" y1="0" x2="20" y2="0" stroke="var(--cyan-bright)" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3.5" fill="var(--cyan-bright)" />
                <text x="0" y="34" fill="var(--cyan-bright)" fontSize="9" textAnchor="middle" fontFamily="'Source Code Pro', monospace" fontWeight="600" letterSpacing="1">ROVER FIX</text>
              </g>

              <g className="tactical-target" transform="translate(605 92)">
                <circle cx="0" cy="0" r="14" fill="rgba(3,18,25,0.7)" stroke="var(--green)" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="rgba(181,255,116,0.5)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M-10 -7 V-10 H-7 M7 -10 H10 V-7 M10 7 V10 H7 M-7 10 H-10 V7" fill="none" stroke="var(--green)" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="var(--green)" />
                <text x="0" y="-16" fill="var(--green)" fontSize="9" textAnchor="middle" fontFamily="'Source Code Pro', monospace" fontWeight="600" letterSpacing="1">TARGET #{selected.id}</text>
                <text x="0" y="32" fill="rgba(181,255,116,0.85)" fontSize="8" textAnchor="middle" fontFamily="'Source Code Pro', monospace">14.2 m &middot; 078&deg; AZ</text>
              </g>
            </svg>

            {current.hazard && (
              <div className="hazard-callout">
                HAZARD DETECTED: ESCARPMENT (28&deg; SLOPE)<br />
                <b>AUTONAV REROUTING ENGAGED</b>
              </div>
            )}
          </div>
          <div className="map-legend">
            <span><i className="key rover-key" />AMINA ROVER (LOCAL FIX)</span>
            <span><i className="key target-key" />TARGET #{selected.id} ({selected.name})</span>
            <span><i className="key hazard-key" />HIGH-RISK ESCARPMENT</span>
            <span><i className="key route-key" />AUTONAV CORRIDOR</span>
          </div>
        </div>

        <div className="panel decision-panel">
          <div className="panel-heading"><div><span className="section-index">02</span><h2>MISSION DECISION ENGINE</h2></div><span className="decision-mark">DECISION READY</span></div>
          <div className="decision-callout"><span>AMINA DECISION</span><strong>TARGET #{selected.id} SELECTED</strong><p>{current.battery < 35 ? "Energy policy favours the most efficient valuable target." : current.hazard ? "Risk increased on the original route; an alternative path preserves mission value." : "High scientific value with acceptable terrain risk and energy requirement."}</p><button className="text-button" onClick={() => setShowWhy(value => !value)}>{showWhy ? "CLOSE EXPLANATION" : "WHY THIS DECISION?"}</button></div>
          {showWhy && <div className="explain-box"><b>WHY TARGET #{selected.id}?</b><ul><li>Science value: {selected.science}%</li><li>Confidence: {selected.confidence}%</li><li>Accessibility: {selected.access}%</li><li>{current.battery >= 35 ? "Battery sufficient for approach" : "Lowest energy cost in the candidate set"}</li></ul><strong>DECISION: APPROACH TARGET #{selected.id}</strong></div>}
          <div className="utility-list">{rankedTargets.map((target, index) => <div className={index === 0 ? "utility-row selected" : "utility-row"} key={target.id}><span><b>#{target.id}</b> {target.name}</span><span className="utility-bar"><i style={{ width: `${target.utility}%` }} /></span><strong>{target.utility}</strong></div>)}</div>
          <div className="formula">UTILITY = SCIENCE + ACCESSIBILITY - ENERGY - DISTANCE - RISK</div>
        </div>
      </section>

      <section className="dashboard-grid lower-grid">
        <div className="panel health-panel"><div className="panel-heading"><div><span className="section-index">03</span><h2>ROVER HEALTH</h2></div><span className={current.status === "NOMINAL" ? "status-chip" : "status-chip warning-chip"}>{current.status}</span></div><div className="health-grid">{healthBase.map(([label, value]) => <div className="health-row" key={label}><span className="health-led" /><span>{label}</span><b>{label === "Battery" ? `${current.battery}%` : scenario === "fault" && label === "Motor current" ? "4.9 A" : value}</b></div>)}</div>{scenario === "fault" && <div className="fault-banner"><b>FAULT DETECTED &middot; OPEN FDIR</b><span>Left wheel current abnormal &middot; select FDIR for isolation and recovery details</span></div>}</div>
        <div className="panel target-panel"><div className="panel-heading"><div><span className="section-index">04</span><h2>SCIENCE TARGETS</h2></div><span className="status-chip">4 DETECTED</span></div><div className="target-table">{rankedTargets.map(target => <div className="target-row" key={target.id}><div><b>#{target.id}</b><span>{target.name}</span></div><div><span>SCIENCE <b>{target.science}%</b></span><span>CONFIDENCE <b>{target.confidence}%</b></span></div><div><span>RISK <b>{target.risk}%</b></span><span>DISTANCE <b>{target.distance} m</b></span></div><strong className={target === selected ? "priority" : ""}>{target === selected ? "SELECTED" : target.status}</strong></div>)}</div></div>
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="panel log-panel"><div className="panel-heading"><div><span className="section-index">05</span><h2>LIVE MISSION EVENT LOG</h2></div><span className="status-chip">STREAMING</span></div><div className="event-list">{events.map(([time, message, type], index) => <div className="event-row" key={`${time}-${index}`}><time>{time}</time><span className="event-type">{type}</span><b>{message}</b></div>)}</div></div>
        <div className="panel telemetry-panel"><div className="panel-heading"><div><span className="section-index">06</span><h2>ADAPTIVE TELEMETRY</h2></div><span className="status-chip">{current.bandwidth}</span></div><div className="telemetry-copy">AMINA prioritises mission-critical information before bandwidth is spent on detail.</div><div className="telemetry-list"><span className="sending">&#10003; P1 Critical health / fault</span><span className="sending">&#10003; P2 Target #{selected.id} science result</span><span className="sending">&#10003; P3 Rover position</span><span className="deferred">&#9675; P4 Full-resolution image</span><span className="deferred">&#9675; Routine telemetry batch</span></div></div>
      </section>

    </div>
  </Appear>;
});

export default Dashboard;
