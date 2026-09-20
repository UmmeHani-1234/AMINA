import {
  useState,
  useCallback,
  useRef,
  useEffect,
  memo,
} from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import {
  Frame,
  withSounds,
  withStyles,
} from "arwes";

import usePlanets from "../hooks/usePlanets";
import useLaunches from "../hooks/useLaunches";

import Centered from "../components/Centered";
import Header from "../components/Header";
import { MissionProvider } from "../context/MissionContext";
import { useMission } from "../context/MissionContext";
import "../Environment.css";

import Launch from "./Launch";
import Dashboard from "./Dashboard";
import Systems from "./Systems";
import Tracking from "./Tracking";
import History from "./History";
import Upcoming from "./Upcoming";
import "./SatelliteLayout.css";
import "./DataSpread.css";
import "../OperationsOnly.css";

const styles = () => ({
  content: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    margin: 0,
    boxSizing: "border-box",
  },
  centered: {
    flex: 1,
    width: "100%",
    maxWidth: "100%",
    paddingTop: "16px",
    paddingBottom: "24px",
    paddingLeft: "clamp(10px, 2vw, 24px)",
    paddingRight: "clamp(10px, 2vw, 24px)",
    boxSizing: "border-box",
  },
});

const AppLayout = props => {
  const { sounds, classes } = props;
  const location = useLocation();

  const [frameVisible, setFrameVisible] = useState(true);
  const frameTimerRef = useRef(null);

  const animateFrame = useCallback(() => {
    setFrameVisible(false);
    if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    frameTimerRef.current = setTimeout(() => {
      setFrameVisible(true);
    }, 600);
  }, []);

  useEffect(() => {
    return () => {
      if (frameTimerRef.current) clearTimeout(frameTimerRef.current);
    };
  }, []);

  const soundsRef = useRef(sounds);
  useEffect(() => {
    soundsRef.current = sounds;
  }, [sounds]);

  const onSuccessSound = useCallback(() => {
    soundsRef.current?.success?.play();
  }, []);

  const onAbortSound = useCallback(() => {
    soundsRef.current?.abort?.play();
  }, []);

  const onFailureSound = useCallback(() => {
    soundsRef.current?.warning?.play();
  }, []);

  const {
    launches,
    isPendingLaunch,
    submitLaunch,
    abortLaunch,
  } = useLaunches(onSuccessSound, onAbortSound, onFailureSound);

  const planets = usePlanets();

  return (
    <MissionProvider>
      <EnvironmentShell
        classes={classes}
        location={location}
        frameVisible={frameVisible}
        animateFrame={animateFrame}
        planets={planets}
        launches={launches}
        submitLaunch={submitLaunch}
        isPendingLaunch={isPendingLaunch}
        abortLaunch={abortLaunch}
      />
    </MissionProvider>
  );
};

const EnvironmentShell = memo(({ classes, location, frameVisible, animateFrame, planets, launches, submitLaunch, isPendingLaunch, abortLaunch }) => {
  const { environment } = useMission();
  const isSatelliteView = location.pathname === "/satellite";

  return <div className={`${classes.content} environment-${environment}`}>
    <Header onNav={animateFrame} />
    <Centered className={`${classes.centered} wide-layout ${isSatelliteView ? "satellite-layout" : ""}`}>
      <Frame animate
        show={frameVisible}
        corners={4}
        style={{ visibility: frameVisible ? "visible" : "hidden", width: "100%", boxSizing: "border-box" }}>
        {anim => (
          <div style={{ padding: isSatelliteView ? "16px 12px" : "clamp(16px, 2vw, 28px)", width: "100%", minHeight: "100%", boxSizing: "border-box" }}>
            <Switch>
              <Route exact path="/">
                <Dashboard entered={anim.entered} />
              </Route>
              <Route exact path="/launch">
                <Launch
                  entered={anim.entered}
                  planets={planets}
                  submitLaunch={submitLaunch}
                  isPendingLaunch={isPendingLaunch} />
              </Route>
              <Route exact path="/rover"><Systems entered={anim.entered} type="rover" /></Route>
              <Route exact path="/tracking"><Tracking entered={anim.entered} mode="rover" /></Route>
              <Route exact path="/navigation"><Systems entered={anim.entered} type="navigation" /></Route>
              <Route exact path="/science"><Systems entered={anim.entered} type="science" /></Route>
              <Route exact path="/ai"><Systems entered={anim.entered} type="ai" /></Route>
              <Route exact path="/fdir"><Systems entered={anim.entered} type="fdir" /></Route>
              <Route exact path="/energy"><Systems entered={anim.entered} type="energy" /></Route>
              <Route exact path="/telemetry"><Systems entered={anim.entered} type="telemetry" /></Route>
              <Route exact path="/cubesat"><Systems entered={anim.entered} type="cubesat" /></Route>
              <Route exact path="/satellite"><Tracking entered={anim.entered} mode="satellite" /></Route>
              <Route exact path="/upcoming">
                <Upcoming
                  entered={anim.entered}
                  launches={launches}
                  abortLaunch={abortLaunch} />
              </Route>
              <Route exact path="/history">
                <History entered={anim.entered} launches={launches} />
              </Route>
            </Switch>
          </div>
        )}
      </Frame>
    </Centered>
  </div>;
});

export default withSounds()(withStyles(styles)(AppLayout));
