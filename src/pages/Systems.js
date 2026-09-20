import { useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";
import { Appear } from "arwes";
import { useMission } from "../context/MissionContext";
import "./Systems.css";
import "./PlatformVisuals.css";
import "./CubeSatVisual.css";
import "./RoverOverview.css";
import "./ModelLinks.css";
import "./VehicleMotion.css";
import MissionFeed from "./MissionFeed";

const configs = {
  rover: { code: "ROV", title: "Rover Overview", kicker: "PHYSICAL PLATFORM / AMINA ROVER", summary: "Inspect the six-wheel exploration system and its onboard sensing stack.", accent: "ROVER ONLINE", cards: [["Mobility", "6 / 6 wheels", "ROCKER-BOGIE INSPIRED"], ["Compute", "EDGE AI / SBC", "DECISION LOOP ONLINE"], ["Sensors", "7 / 7 online", "HEALTHY"], ["Uptime", "04:18:22", "SOL 042"]], sections: [["CAMERA", "Observation feed", "1280 x 720 · ONLINE"], ["LIDAR / DEPTH", "Terrain perception", "4.2 m range · LOCKED"], ["IMU", "Orientation estimate", "ROLL 1.2° · PITCH 0.8°"], ["SCIENCE PAYLOAD", "Spectral proxy", "TCS34725 · READY"]] },
  navigation: { code: "NAV", title: "Navigation & Terrain", kicker: "TRAVERSABILITY / ROUTE PLANNING", summary: "Compare terrain risk, energy cost, and scientific return before AMINA commits to a route.", accent: "ROUTE OPTIMISED", cards: [["Position", "14.2 N / 32.8 E", "LOCAL FRAME"], ["Speed", "0.18 m/s", "CRAWL MODE"], ["Traversability", "82%", "SAFE CORRIDOR"], ["Waypoints", "06 / 09", "TARGET #07"]], sections: [["TARGET A", "Science 92 · Risk LOW · Energy MEDIUM", "UTILITY 89"], ["TARGET B", "Science 96 · Risk HIGH · Energy HIGH", "UTILITY 61"], ["TARGET C", "Science 88 · Risk LOW · Energy MEDIUM", "UTILITY 92 / SELECTED"], ["ROUTE POLICY", "Preserve energy margin above 35%", "ACTIVE"]] },
  science: { code: "SCI", title: "Scientific Intelligence", kicker: "PERCEPTION / TARGET DETECTION", summary: "Turn camera observations into ranked science opportunities and actionable investigations.", accent: "4 TARGETS DETECTED", cards: [["Observation", "TARGET #07", "HYDRATED VEIN"], ["Confidence", "91%", "HIGH"], ["Science value", "87%", "PRIORITY 01"], ["Investigation", "14 m", "ENERGY 29%"]], sections: [["TARGET #07", "Hydrated vein · confidence 91% · accessibility 81%", "HIGH PRIORITY"], ["TARGET #01", "Basalt ridge · confidence 88% · accessibility 74%", "GOOD"], ["TARGET #03", "Layered outcrop · confidence 84% · visited", "MEMORY HIT"], ["OPPORTUNITY", "Unexpected feature · confidence 84% · value 92%", "REVIEW"]] },
  ai: { code: "AI", title: "Mission Decision Engine", kicker: "EXPLAINABLE AUTONOMY / UTILITY", summary: "See why AMINA selects one target over another instead of treating autonomy as a black box.", accent: "DECISION EXPLAINED", cards: [["Selected", "TARGET #07", "APPROACH"], ["Utility", "92", "TOP SCORE"], ["Confidence", "91%", "SUPPORTED"], ["Margin", "+18", "SAFE ENERGY"]], sections: [["SCIENCE VALUE", "+87", "HIGH CONTRIBUTION"], ["ACCESSIBILITY", "+81", "GOOD TRAVERSAL"], ["ENERGY / DISTANCE", "−43", "14 m APPROACH"], ["RISK", "−35", "WITHIN POLICY"]] },
  fdir: { code: "FDI", title: "Fault Detection, Isolation & Recovery", kicker: "ROVER HEALTH / RESILIENCE", summary: "Follow the complete path from an abnormal signal to an isolated subsystem and recovery action.", accent: "MONITORING", cards: [["Detection", "MOTOR CURRENT", "ABNORMAL"], ["Isolation", "LEFT REAR WHEEL", "CONFIRMED"], ["Recovery", "REDUCE / REVERSE", "RUNNING"], ["Outcome", "ROUTE REPLANNED", "MISSION SAFE"]], sections: [["14:32:08", "Left rear motor current rose above threshold", "DETECT"], ["14:32:09", "Fault isolated to left rear wheel", "ISOLATE"], ["14:32:11", "Rover speed reduced and wheel reversed", "RECOVER"], ["14:32:21", "Alternate path calculated; mission resumed", "RESOLVED"]] },
  energy: { code: "PWR", title: "Power & Energy Management", kicker: "ENERGY POLICY / MISSION MODE", summary: "Energy state directly changes what the rover is allowed to do next.", accent: "HIGH · EXPLORE BROADLY", cards: [["Reserve", "78%", "HIGH"], ["Voltage", "12.4 V", "STABLE"], ["Current", "1.8 A", "NOMINAL"], ["Policy", "EXPLORE", "BROADLY"]], sections: [["HIGH · 75–100%", "Explore broadly and investigate opportunities", "ACTIVE"], ["MEDIUM · 35–74%", "Balance science value and resource margin", "STANDBY"], ["LOW · 15–34%", "Stop optional exploration; prioritise return", "STANDBY"], ["CRITICAL · <15%", "Disable science and enter safe behaviour", "STANDBY"]] },
  telemetry: { code: "TLM", title: "Adaptive Telemetry", kicker: "COMMUNICATION / PRIORITY QUEUE", summary: "When the link is constrained, AMINA sends the information that protects the mission first.", accent: "BANDWIDTH LIMITED", cards: [["Link", "LIMITED", "SCHEDULED"], ["P1", "CRITICAL HEALTH", "SENDING"], ["P2", "SCIENCE RESULT", "SENDING"], ["P4", "FULL IMAGE", "DEFERRED"]], sections: [["P1 · CRITICAL", "Faults, battery, rover health, safe-state changes", "SEND NOW"], ["P2 · HIGH VALUE", "Target #07 science result and observation summary", "SEND NEXT"], ["P3 · ROUTINE", "Position, speed, environmental telemetry", "BATCH"], ["P4 · LOW", "Full-resolution imagery and non-critical detail", "DEFER"]] },
  cubesat: { code: "SAT", title: "1U CubeSat-Style Demonstrator", kicker: "SECONDARY PLATFORM / SOFTWARE DEMONSTRATOR", summary: "Demonstrate how AMINA's autonomy and FDIR concepts transfer to a small spacecraft without presenting it as launched hardware.", accent: "MISSION MODE", cards: [["Power", "83%", "NOMINAL"], ["Computer", "ONLINE", "HEALTHY"], ["Thermal", "24.8 °C", "STABLE"], ["State", "MISSION", "AUTONOMOUS"]], sections: [["SENSE", "Sensor and telemetry data", "COMPLETE"], ["ANALYSE", "Health assessment / anomaly check", "ACTIVE"], ["DECIDE", "Continue, delay, reconfigure, or safe mode", "READY"], ["ACT / MONITOR", "Apply action and verify recovery", "READY"]] },
};

const systemMeta = {
  fdir: {
    badge: "FAULT ISOLATION & DIAGNOSTICS",
    source: "NASA JPL · MAHLI WHEEL INSPECTION",
    tag: "WHEEL DRIVE ACTUATOR · ABNORMAL → ISOLATED → RECOVERING",
    status: "RECOVERY POLICY ACTIVE",
    telemetry: "MOTOR CURRENT: 3.4A (ISOLATED)"
  },
  navigation: {
    badge: "TERRAIN PERCEPTION & NAVCAM",
    source: "NASA CURIOSITY · STEREO NAVCAM DRIVE TRACKS",
    tag: "TRAVERSABILITY 82% · SAFE CORRIDOR LOCKED",
    status: "LOCAL WAYPOINT 06 / 09",
    telemetry: "PITCH: 0.8° · ROLL: 1.2° · SPEED: 0.18 m/s"
  },
  science: {
    badge: "SPECTRAL TARGETING & PERCEPTION",
    source: "NASA CURIOSITY · CHEMCAM LASER TARGET ROCK",
    tag: "TARGET #07 HYDRATED VEIN · CONFIDENCE 91%",
    status: "SPECTRAL ANALYSIS COMPLETE",
    telemetry: "PRIORITY: 01 HIGH · SCIENCE VALUE: 87%"
  },
  ai: {
    badge: "AUTONOMOUS DECISION ENGINE",
    source: "NASA PERSEVERANCE · AUTONAV HAZARD AVOIDANCE",
    tag: "TARGET SELECTION UTILITY: 92 (OPTIMAL)",
    status: "MULTI-CRITERIA DECISION COMPUTED",
    telemetry: "UTILITY SCORE: 92 · ENERGY MARGIN: +18"
  },
  energy: {
    badge: "POWER & ENERGY SUBSYSTEM",
    source: "NASA JPL · MARS ROVER MMRTG POWER SYSTEM",
    tag: "POWER BUS 12.4V · RESERVE 78% · EXPLORE BROADLY",
    status: "NOMINAL POWER PROFILE",
    telemetry: "CURRENT: 1.8A · VOLTAGE: 12.4V · MARGIN: 78%"
  },
  telemetry: {
    badge: "COMMUNICATIONS & LINK TELEMETRY",
    source: "NASA DEEP SPACE NETWORK · 70m ANTENNA GOLDSTONE",
    tag: "ADAPTIVE PACKET QUEUE · P1 CRITICAL HEALTH SENDING",
    status: "BANDWIDTH MANAGED",
    telemetry: "SIGNAL LATENCY: 4.3m · LINK: LIMITED SCHEDULED"
  },
  cubesat: {
    badge: "1U CUBESAT FLIGHT DEMONSTRATOR",
    source: "NASA MarCO · INTERPLANETARY CUBESAT IN ORBIT",
    tag: "AUTONOMOUS ATTITUDE & SUBSYSTEM TELEMETRY",
    status: "ORBITAL FLIGHT NOMINAL",
    telemetry: "THERMAL: 24.8°C · POWER: 83% · CPU: HEALTHY"
  }
};

const energyTaskMeta = [
  {
    title: "BROAD EXPLORATION & PEAK POWER",
    task: "Planetary Traverse & Active Autonomy",
    mode: "HIGH · 75–100%",
    image: "/img/systems/energy-high.jpg",
    badge: "MMRTG / PEAK POWER INFLUX",
    source: "NASA CURIOSITY · NAUKLUFT TRAVERSE",
    tag: "POWER DRAW: 1.8A · BUS 12.4V · BROAD EXPLORATION",
    status: "ENERGY RESERVE: 78% (NOMINAL)",
    telemetry: "MMRTG OUTPUT: 110W · MARGIN: +24%",
    taskSummary: "Full power reserve enables maximum crawl speed, stereo Navcam terrain scanning, and edge AI obstacle evaluation across open Jezero plains."
  },
  {
    title: "SCIENCE CORING & ACTUATOR DRAW",
    task: "Robotic Arm Rock Sampling & Cache Operations",
    mode: "MEDIUM · 35–74%",
    image: "/img/systems/energy-medium.jpg",
    badge: "ROBOTIC ARM POWER BUDGETING",
    source: "NASA PERSEVERANCE · ROCK CORE EXTRACTION",
    tag: "ACTUATOR CURRENT: 2.9A · SAMPLE CORING ACTIVE",
    status: "ENERGY RESERVE: 54% (BALANCED)",
    telemetry: "DRILL MOTOR DRAW: 48W · THERMAL: 21°C",
    taskSummary: "Robotic arm coring drill and carousel mechanisms draw peak actuator current; non-critical mobility is paused to preserve cell margin while caching samples."
  },
  {
    title: "POWER CONSERVATION RETURN DRIVE",
    task: "Low-Drag Path Retracement & Power Saving",
    mode: "LOW · 15–34%",
    image: "/img/systems/energy-low.jpg",
    badge: "LOW-POWER CRAWL CORRIDOR",
    source: "NASA CURIOSITY · DUNE TRAVERSE TRACKS",
    tag: "MOTOR CURRENT: 1.1A · REVERSING PATH",
    status: "ENERGY RESERVE: 27% (CONSERVATION)",
    telemetry: "MOBILITY DRAW: 22W · SCIENCE: STANDBY",
    taskSummary: "Optional science investigations suspended. AMINA prioritises low-drag crawl along proven wheel tracks to return to safe haven and optimize recharge angles."
  },
  {
    title: "EMERGENCY SAFE-MODE & HIBERNATION",
    task: "Survival Thermal Preservation & Solar Standby",
    mode: "CRITICAL · <15%",
    image: "/img/systems/energy-critical.jpg",
    badge: "THERMAL PRESERVATION STANDBY",
    source: "NASA OPPORTUNITY · SOLAR ARRAY PRESERVATION",
    tag: "STANDBY DRAW: 0.3A · SURVIVAL HEATERS ONLY",
    status: "ENERGY RESERVE: 12% (SAFE MODE)",
    telemetry: "SURVIVAL HEATER: ACTIVE · CPU: LOW CLOCK",
    taskSummary: "All mobility, science cameras, and AI coprocessors are powered down. Rover enters survival hibernation, orienting solar arrays toward sunlight vectors and prioritizing vital battery thermal blankets."
  }
];

const SystemVisual = memo(({ type, simulating, config, selectedIndex = 0 }) => {
  const isEnergy = type === "energy";
  const energyMeta = isEnergy ? energyTaskMeta[selectedIndex] || energyTaskMeta[0] : null;

  const meta = isEnergy ? energyMeta : (systemMeta[type] || {
    badge: "SYSTEM TELEMETRY",
    source: "NASA ARCHIVES",
    tag: "REAL-TIME SUBSYSTEM STATUS",
    status: "OPERATIONAL",
    telemetry: "STATE: NOMINAL"
  });

  const imgSrc = isEnergy ? energyMeta.image : `/img/systems/${type}.jpg`;

  return (
    <div className="system-real-visual">
      <img src={imgSrc} alt={isEnergy ? energyMeta.title : config.title} className="system-visual-img" loading="lazy" decoding="async" />
      <div className="system-visual-hud-top">
        <span className="system-hud-badge">{meta.badge}</span>
        <span className="system-hud-source">{meta.source}</span>
      </div>
      <div className="system-visual-hud-center">
        <div className="system-hud-crosshair" />
        <span className="system-hud-tag">{meta.tag}</span>
      </div>
      <div className="system-visual-hud-bottom">
        <span className="system-hud-status">
          <span className="live-dot" /> {meta.telemetry}
        </span>
        <span className="system-hud-sim">
          {simulating ? "● REAL-TIME SIMULATION ACTIVE" : `STATUS: ${meta.status}`}
        </span>
      </div>
    </div>
  );
});

const Systems = memo(({ entered, type }) => {
  const config = configs[type] || configs.rover;
  const { current } = useMission();
  const [selected, setSelected] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const isEnergy = type === "energy";
  const rows = useMemo(() => config.sections.map((row, index) => ({ row, index })), [config]);

  return <Appear animate show={entered}>
    <div className={`systems-page ${type === "rover" ? "rover-overview" : ""}`}>
      <div className="systems-hero"><div><span className="eyebrow">AMINA-LUNAR / {config.kicker}</span><h1>{config.title}</h1><p>{config.summary}</p></div><div className="system-code">{config.code}<small>{current.status} · {current.battery}% POWER</small></div></div>
      <div className="system-tabs">{Object.entries(configs).map(([key, value]) => <Link className={key === type ? "active" : ""} to={`/${key}`} key={key}>{value.code}</Link>)}<Link to="/tracking">TRACK</Link><Link to="/satellite">ORBIT</Link></div>
      <div className="system-cards">{config.cards.map(([label, value, note]) => <div className="system-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <div className="systems-content-grid">
        <section className="systems-panel visual-panel">
          <div className="systems-heading">
            <span>{isEnergy ? `TASK VIEW: ${energyTaskMeta[selected].title}` : "LIVE SYSTEM VIEW"}</span>
            <b>{simulating ? "SIMULATION RUNNING" : "SIMULATION READY"}</b>
          </div>
          {type === "rover" ? <MissionFeed current={current} /> : <SystemVisual type={type} simulating={simulating} config={config} selectedIndex={selected} />}
          <button className="simulate-button" onClick={() => setSimulating(value => !value)}>
            {simulating ? "STOP SIMULATION" : "RUN LIVE SIMULATION"}
          </button>
        </section>
        <section className="systems-panel detail-panel">
          <div className="systems-heading">
            <span>{isEnergy ? "ENERGY TASK POLICIES" : "MISSION LOGIC"}</span>
            <b>INTERACTIVE (SELECT TASK)</b>
          </div>
          <div className="detail-list">
            {rows.map(({ row, index }) => (
              <button
                className={selected === index ? "detail-row selected" : "detail-row"}
                onClick={() => setSelected(index)}
                key={`${row[0]}-${index}`}
              >
                <span className="detail-index">0{index + 1}</span>
                {isEnergy && (
                  <img
                    src={energyTaskMeta[index].image}
                    alt={energyTaskMeta[index].title}
                    className="detail-thumb"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span>
                  <strong>{row[0]}</strong>
                  <small>{isEnergy ? energyTaskMeta[index].task : row[1]}</small>
                </span>
                <b>{row[2]}</b>
              </button>
            ))}
          </div>
          <div className="detail-explanation">
            <span>{isEnergy ? "ACTIVE TASK POLICY & POWER PROFILE" : "ACTIVE INTERPRETATION"}</span>
            <b>{isEnergy ? energyTaskMeta[selected].title : config.sections[selected][0]}</b>
            <p>{isEnergy ? energyTaskMeta[selected].taskSummary : `${config.sections[selected][1]}. AMINA uses this state as an input to the next mission decision.`}</p>
          </div>
        </section>
      </div>

      {isEnergy && (
        <section className="energy-tasks-gallery panel" style={{ marginTop: 16 }}>
          <div className="panel-heading">
            <div>
              <span className="section-index">04</span>
              <h2>POWER & ENERGY TASK PROFILES</h2>
            </div>
            <span className="status-chip">4 OPERATIONAL TASK MODES</span>
          </div>
          <div className="energy-tasks-grid">
            {energyTaskMeta.map((task, idx) => (
              <div
                key={task.title}
                className={`energy-task-card ${selected === idx ? "active" : ""}`}
                onClick={() => setSelected(idx)}
              >
                <div className="energy-task-img-wrap">
                  <img src={task.image} alt={task.title} className="energy-task-card-img" loading="lazy" decoding="async" />
                  <span className="energy-task-badge">{task.mode}</span>
                </div>
                <div className="energy-task-body">
                  <strong>{task.title}</strong>
                  <small>{task.task}</small>
                  <div className="energy-task-footer">
                    <span>{task.source}</span>
                    <b className={selected === idx ? "task-active-indicator" : ""}>
                      {selected === idx ? "SELECTED" : "CLICK TO VIEW"}
                    </b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </Appear>;
});

export default Systems;
