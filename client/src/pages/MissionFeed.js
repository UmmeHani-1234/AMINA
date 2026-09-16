import "./MissionFeed.css";

const MissionFeed = ({ current }) => <div className="mission-feed" aria-label="AMINA rover camera and mission telemetry">
  <video className="rover-video" controls autoPlay muted loop playsInline aria-label="Rover camera playback">
    <source src="/img/videoplayback%20(1).mp4" type="video/mp4" />
    <source src="/img/videoplayback%20(2).mp4" type="video/mp4" />
    <source src="/img/videoplayback%20(3).mp4" type="video/mp4" />
    Your browser does not support rover video playback.
  </video>
  <div className="feed-hud"><strong>SIMULATION FEED</strong><br />ROVER: AMINA-01<br />STATUS: {current.status === "NOMINAL" ? "EXPLORING" : "CAUTION"}<br />MODE: AUTONOMOUS<br />TARGET: #07<br />SPEED: 0.18 m/s<br />HEADING: NE<br />BATTERY: {current.battery}%</div>
  {/* The simulated rover and CubeSat overlay is intentionally hidden during video playback. */}
    {/* <defs><path id="rover-feed-path" d="M80 340 C170 308 220 320 300 286 S440 270 540 305" /><path id="satellite-feed-path" d="M475 112 C570 22 710 70 650 145 S520 188 475 112" /></defs>
    <rect className="feed-surface" x="0" y="250" width="760" height="160" /><path className="feed-mountain" d="M0 255 L120 170 190 240 295 138 390 245 500 155 610 238 705 175 760 225 760 280 0 280Z" /><path className="feed-horizon" d="M0 250 L760 250" /><path className="feed-grid" d="M0 300H760 M0 350H760 M100 250L170 410 M250 250L280 410 M430 250L410 410 M610 250L550 410" /><path className="feed-route" d="M80 340 C170 308 220 320 300 286 S440 270 540 305" /><circle className="feed-target" cx="540" cy="305" r="8" /><path className="feed-crosshair" d="M525 305h30 M540 290v30" /><text className="feed-label target-label" x="555" y="302">TARGET #07</text>
    <circle className="feed-planet" cx="590" cy="105" r="47" /><path className="feed-orbit" d="M475 112 C570 22 710 70 650 145 S520 188 475 112" /><g className="mission-satellite"><animateMotion dur="8s" repeatCount="indefinite" rotate="auto"><mpath href="#satellite-feed-path" /></animateMotion><rect x="-9" y="-7" width="18" height="14" /><line x1="-22" y1="0" x2="-9" y2="0" /><line x1="9" y1="0" x2="22" y2="0" /></g><text className="feed-label" x="590" y="105">CUBESAT</text>
    <g className="mission-rover"><animateMotion dur="8s" repeatCount="indefinite" rotate="auto"><mpath href="#rover-feed-path" /></animateMotion><rect className="mission-rover-body" x="-27" y="-15" width="54" height="24" rx="3" /><rect className="mission-rover-body" x="-10" y="-31" width="20" height="16" /><circle className="mission-rover-sensor" cx="0" cy="-35" r="4" /><circle className="mission-rover-wheel" cx="-20" cy="12" r="8" /><circle className="mission-rover-wheel" cx="0" cy="12" r="8" /><circle className="mission-rover-wheel" cx="20" cy="12" r="8" /></g><text className="feed-label" x="58" y="375">AMINA-01 / AUTONOMOUS DRIVE</text>
  </svg> */}
  <div className="feed-status">LIVE VIEW • SIMULATED</div>
</div>;

export default MissionFeed;
