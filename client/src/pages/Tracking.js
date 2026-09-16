import { useState } from "react";
import { Appear } from "arwes";
import { useMission } from "../context/MissionContext";
import "./Tracking.css";
import "./TrackingRover.css";
import "./TrackingOrbit.css";
import "./SatelliteLayout.css";
import "./ScienceCapture.css";
import "./ScienceImageAssets.css";
import "./RealisticMap.css";

const roverEvents = [
  ["14:32:25", "Rover moving", "ACT"], ["14:32:19", "Route updated", "REPLAN"], ["14:32:16", "Target detected", "SENSE"], ["14:32:12", "Terrain scanned", "ANALYSE"], ["14:32:08", "Position updated", "MONITOR"],
];

const satelliteEvents = [
  ["09:18:42", "Priority telemetry transmitted", "TELEMETRY"], ["09:18:31", "Orbit state updated", "MONITOR"], ["09:18:16", "Science observation queued", "DECIDE"], ["09:17:58", "Thermal scan nominal", "SENSE"], ["09:17:40", "Ground link established", "ACT"],
];

const scienceFrames = [
  ["/img/images.jpg", "IMG_001.jpg", "Panoramic View"], ["/img/images%20(1).jpg", "IMG_002.jpg", "Rock Sample (Close-up)"], ["/img/images%20(2).jpg", "IMG_003.jpg", "Surface Texture"],
  ["/img/images%20(3).jpg", "IMG_004.jpg", "Stratification"], ["/img/images%20(4).jpg", "IMG_005.jpg", "Horizon View"], ["/img/images%20(5).jpg", "IMG_006.jpg", "Target Context"],
];

const RoverMarker = ({ x, y }) => <g transform={`translate(${x} ${y}) rotate(-13)`} className="rover-marker"><ellipse className="tracker-rover-shadow" cx="0" cy="15" rx="31" ry="7" /><path className="tracker-suspension" d="M-28 7H28 M-22 7L-18 15 M-8 7L-5 15 M7 7L10 15 M21 7L24 15" /><path className="tracker-chassis" d="M-29-7L-19-16H19L29-7V7H-29Z" /><path className="tracker-deck" d="M-18-16H18L22-7H-22Z" /><rect className="tracker-mast" x="-3" y="-31" width="6" height="15" rx="1" /><rect className="tracker-camera" x="-8" y="-36" width="16" height="8" rx="2" /><circle className="tracker-lens" cx="4" cy="-32" r="2" /><rect className="tracker-panel" x="-14" y="-13" width="16" height="6" rx="1" /><path className="tracker-antenna" d="M13-16L18-30" /><circle className="tracker-lens" cx="18" cy="-31" r="2" /><circle className="tracker-wheel" cx="-21" cy="15" r="7" /><circle className="tracker-wheel" cx="0" cy="15" r="7" /><circle className="tracker-wheel" cx="21" cy="15" r="7" /><path className="tracker-hub" d="M-24 15H-18 M-3 15H3 M18 15H24" /></g>;

const RoverVisual = () => {
  return <div style={{ position: "relative", width: "100%", minHeight: "195px", background: "#000" }}>
    <video autoPlay muted loop playsInline style={{ display: "block", width: "100%", height: "100%", minHeight: "195px", objectFit: "cover" }}>
      <source src="/img/rover-screen-recording.mp4" type="video/mp4" />
    </video>
    <div style={{
      position: "absolute", top: 10, left: 14,
      color: "rgba(95,240,255,0.85)", fontFamily: "'Source Code Pro', monospace",
      fontSize: "10px", letterSpacing: "1.5px", textShadow: "0 0 8px rgba(95,240,255,0.7)",
      pointerEvents: "none"
    }}>
      ROVER · LIVE FEED · SOL 042
    </div>
    <div style={{
      position: "absolute", bottom: 10, right: 14,
      color: "rgba(95,240,255,0.6)", fontFamily: "'Source Code Pro', monospace",
      fontSize: "9px", letterSpacing: "1px",
      pointerEvents: "none"
    }}>
      MOBILITY TELEMETRY · ACTIVE
    </div>
  </div>;
};

const CubeSatMarker = ({ x, y, fault }) => <g transform={`translate(${x} ${y}) rotate(-18)`} className={fault ? "sat-marker fault" : "sat-marker"}><path className="sat-comms-beam" d="M0 13L-64 77" /><rect className="sat-array" x="-55" y="-12" width="28" height="24" rx="1" /><rect className="sat-array" x="27" y="-12" width="28" height="24" rx="1" /><path className="sat-cell-lines" d="M-48-12V12M-41-12V12M-34-12V12M-55 0H-27M34-12V12M41-12V12M48-12V12M27 0H55" /><rect className="sat-bus" x="-27" y="-19" width="54" height="38" rx="3" /><rect className="sat-forward-panel" x="-20" y="-12" width="40" height="19" rx="1" /><circle className="sat-optics" cx="12" cy="-3" r="5" /><path className="sat-antenna" d="M-12-19L-18-34 M-18-34L-23-37 M-18-34L-13-38 M0 19L0 31" /><circle className="sat-status-light" cx="-11" cy="12" r="2" /></g>;

const SatelliteVisual = () => {
  return <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "390px", background: "#000" }}>
    <video autoPlay muted loop playsInline style={{ display: "block", width: "100%", height: "100%", minHeight: "390px", objectFit: "cover" }}>
      <source src="/img/iss-timelapse.mp4" type="video/mp4" />
      <source src="/img/videoplayback (3).mp4" type="video/mp4" />
    </video>
    <div style={{
      position: "absolute", top: 10, left: 14,
      color: "rgba(95,240,255,0.85)", fontFamily: "'Source Code Pro', monospace",
      fontSize: "10px", letterSpacing: "1.5px", textShadow: "0 0 8px rgba(95,240,255,0.7)",
      pointerEvents: "none"
    }}>
      ISS · LIVE FEED · 412 km ALT
    </div>
    <div style={{
      position: "absolute", bottom: 10, right: 14,
      color: "rgba(95,240,255,0.6)", fontFamily: "'Source Code Pro', monospace",
      fontSize: "9px", letterSpacing: "1px",
      pointerEvents: "none"
    }}>
      FULL MOON PASS · EUROPE / MIDDLE EAST
    </div>
  </div>;
};

const Tracking = ({ entered, mode }) => {
  const satellite = mode === "satellite";
  const { scenario, progress, running, setRunning, setScenario } = useMission();
  const [follow, setFollow] = useState(true);
  const fault = satellite && scenario === "cubesat";
  const targetReached = progress > .9;

  return <Appear animate show={entered}><div className="tracking-page">
    <div className="tracking-hero"><div><span className="eyebrow">AMINA-LUNAR / {satellite ? "ORBITAL POSITION" : "MOBILITY TELEMETRY"}</span><h1>{satellite ? "CubeSat · Orbital View" : "Rover · Live Position"}</h1><p>{satellite ? "A software demonstrator for spacecraft autonomy, orbital telemetry, and fault recovery. No deployed satellite is implied." : "Watch the simulated rover move through terrain, update its route, and carry its mission state forward in real time."}</p></div><div className="tracking-state"><span className="live-dot" />{running ? "LIVE SIMULATION" : "SIMULATION PAUSED"}<button onClick={() => setRunning(value => !value)}>{running ? "PAUSE" : "RESUME"}</button></div></div>
    <div className="tracking-layout"><section className="tracking-map panel"><div className="tracking-heading"><span>{satellite ? "SPACECRAFT POSITION / ORBITAL VIEW" : "ROVER POSITION / TERRAIN MAP"}</span><b>{satellite ? "SIMULATED ORBIT" : "SOL 042 · LOCAL FRAME"}</b></div>{satellite ? <SatelliteVisual progress={progress} fault={fault} /> : <RoverVisual progress={progress} />}<div className="tracking-legend"><span><i className="legend-rover" />{satellite ? "CUBESAT" : "ROVER"}</span><span><i className="legend-path" />{satellite ? "ORBIT PATH" : "TRAVELLED PATH"}</span><span><i className="legend-target" />{satellite ? "GROUND LINK" : "CURRENT TARGET"}</span><span><i className="legend-hazard" />{satellite ? "FDIR STATE" : "HAZARD"}</span></div></section>
      <aside className="tracking-side"><section className="panel status-panel"><div className="tracking-heading"><span>{satellite ? "SPACECRAFT STATUS" : "ROVER STATUS"}</span><b className={fault ? "fault-text" : "good-text"}>{fault ? "SAFE MODE" : "NOMINAL"}</b></div>{satellite ? <><div className="tracking-stat"><span>POSITION</span><strong>142.8° E / 18.4° N</strong></div><div className="tracking-stat"><span>ALTITUDE / VELOCITY</span><strong>412 km · 7.66 km/s</strong></div><div className="tracking-stat"><span>POWER / THERMAL</span><strong>{fault ? "87% · ANOMALY" : "87% · NORMAL"}</strong></div><div className="tracking-stat"><span>MISSION MODE</span><strong>{fault ? "SAFE MODE" : "SCIENCE"}</strong></div><button className={fault ? "fault-button active" : "fault-button"} onClick={() => setScenario(fault ? "normal" : "cubesat")}>{fault ? "CLEAR THERMAL FAULT" : "TRIGGER THERMAL ANOMALY"}</button></> : <><div className="tracking-stat"><span>POSITION / HEADING</span><strong>X 14.2 / Y 32.8 · 127°</strong></div><div className="tracking-stat"><span>SPEED / DISTANCE</span><strong>0.18 m/s · 342 m</strong></div><div className="tracking-stat"><span>CURRENT TARGET</span><strong>T-04 · HYDRATED VEIN</strong></div><div className="tracking-stat"><span>MISSION MODE</span><strong>{progress > .9 ? "TARGET REACHED" : "EXPLORING"}</strong></div><button className={follow ? "follow-button active" : "follow-button"} onClick={() => setFollow(value => !value)}>{follow ? "FOLLOWING ROVER" : "FOLLOW ROVER"}</button></>}</section>
        <section className="panel tracking-events"><div className="tracking-heading"><span>LIVE TRACKING TIMELINE</span><b>STREAMING</b></div>{(satellite ? satelliteEvents : roverEvents).map(([time, event, type]) => <div className="tracking-event" key={time}><time>{time}</time><span>{type}</span><b>{event}</b></div>)}</section></aside></div>
      {!satellite && <section className="panel science-capture-panel"><div className="capture-heading"><div><span className="capture-pin">●</span><strong>{targetReached ? "TARGET REACHED" : "TARGET APPROACH"}</strong><small>{targetReached ? "Captured 6 science images at Target #07" : "Science capture queued for Target #07"}</small></div><b>{targetReached ? "SCIENCE CAPTURED" : "CAPTURE QUEUED"}</b></div><div className="capture-content"><div className="capture-grid">{scienceFrames.map(([source, name, label], index) => <div className={`science-frame frame-${index + 1}`} key={source}><span>{index + 1}</span><img src={source} alt={label} /><b>{name}</b><small>{label}</small></div>)}</div><div className="capture-summary"><b>TARGET #07</b><span>SCIENCE VALUE</span><strong>87%</strong><span>PRIORITY</span><strong>HIGH</strong><span>IMAGES {targetReached ? "CAPTURED" : "QUEUED"}</span><strong>{targetReached ? "6/6" : "READY"}</strong></div></div></section>}
  </div></Appear>;
};

export default Tracking;
