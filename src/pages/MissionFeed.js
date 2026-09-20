import { memo } from "react";
import "./MissionFeed.css";

const MissionFeed = memo(({ current }) => <div className="mission-feed" aria-label="AMINA rover camera and mission telemetry">
  <video className="rover-video" controls autoPlay muted loop playsInline preload="metadata" aria-label="Rover camera playback">
    <source src="/img/videoplayback%20(1).mp4" type="video/mp4" />
    <source src="/img/videoplayback%20(2).mp4" type="video/mp4" />
    <source src="/img/videoplayback%20(3).mp4" type="video/mp4" />
    Your browser does not support rover video playback.
  </video>
  <div className="feed-hud"><strong>ROVER TELEMETRY FEED</strong><br />ROVER: AMINA-01<br />STATUS: {current.status === "NOMINAL" ? "EXPLORING" : "CAUTION"}<br />MODE: AUTONOMOUS<br />TARGET: #07<br />SPEED: 0.18 m/s<br />HEADING: NE<br />BATTERY: {current.battery}%</div>
  <div className="feed-status">LIVE CAM &bull; SOL 042</div>
</div>);

export default MissionFeed;
