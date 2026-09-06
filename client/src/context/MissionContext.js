import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { httpAddMissionLog, httpGetMissionLogs } from "../hooks/requests";

const scenarioData = {
  normal: { label: "NORMAL EXPLORATION", battery: 78, stage: 2, status: "NOMINAL", hazard: false, bandwidth: "AVAILABLE", event: "Autonomy cycle nominal; Target #07 remains selected." },
  science: { label: "HIGH-VALUE SCIENCE", battery: 76, stage: 2, status: "NOMINAL", hazard: false, bandwidth: "AVAILABLE", event: "New spectral signature raised Target #07 priority." },
  battery: { label: "LOW BATTERY", battery: 27, stage: 5, status: "WARNING", hazard: false, bandwidth: "AVAILABLE", event: "Energy policy changed: optional exploration suspended." },
  hazard: { label: "TERRAIN HAZARD", battery: 64, stage: 5, status: "WARNING", hazard: true, bandwidth: "AVAILABLE", event: "High-risk terrain detected; route replanned around hazard." },
  fault: { label: "WHEEL / MOTOR FAULT", battery: 58, stage: 4, status: "WARNING", hazard: true, bandwidth: "AVAILABLE", event: "Motor current spike isolated to left wheel; recovery running." },
  opportunity: { label: "OPPORTUNITY SCIENCE", battery: 70, stage: 2, status: "NOMINAL", hazard: false, bandwidth: "AVAILABLE", event: "Unexpected feature detected beside the planned route." },
  comms: { label: "LIMITED BANDWIDTH", battery: 71, stage: 4, status: "NOMINAL", hazard: false, bandwidth: "LIMITED", event: "Telemetry scheduler promoted P1 health and P2 science data." },
  cubesat: { label: "CUBESAT SUBSYSTEM FAULT", battery: 83, stage: 4, status: "WARNING", hazard: false, bandwidth: "LIMITED", event: "Payload computer isolated; spacecraft remains in mission mode." },
};

const initialEvents = [
  ["23:42:14", "New route selected", "REPLAN"], ["23:41:15", "Target #07 selected", "DECISION"],
  ["23:41:08", "Science target detected", "SENSE"],
];

function formatLog(log) {
  return [log.time, log.message, log.type];
}

const MissionContext = createContext(null);

export const MissionProvider = ({ children }) => {
  const [scenario, setScenario] = useState("normal");
  const [stage, setStage] = useState(scenarioData.normal.stage);
  const [events, setEvents] = useState(initialEvents);
  const [progress, setProgress] = useState(.24);
  const [running, setRunning] = useState(true);
  const [environment, setEnvironment] = useState(() => window.localStorage.getItem("amina-environment") || "night");
  const current = scenarioData[scenario];

  const changeEnvironment = (nextEnvironment) => {
    setEnvironment(nextEnvironment);
    window.localStorage.setItem("amina-environment", nextEnvironment);
  };

  useEffect(() => {
    httpGetMissionLogs().then(logs => {
      if (logs.length) setEvents(logs.map(formatLog).slice(0, 6));
    });
  }, []);

  useEffect(() => {
    const log = {
      time: new Date().toLocaleTimeString([], { hour12: false }),
      message: current.event,
      type: current.stage === 4 ? "MONITOR" : "SYSTEM",
      scenario,
      battery: current.battery,
      target: "07",
    };
    setStage(current.stage);
    setEvents(previous => [formatLog(log), ...previous].slice(0, 6));
    httpAddMissionLog(log);
  }, [scenario, current]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setStage(value => value >= 5 ? 0 : value + 1);
      setProgress(value => value >= .98 ? .02 : value + .012);
    }, 4200);
    return () => clearInterval(timer);
  }, [running]);

  const value = useMemo(() => ({ scenario, setScenario, current, stage, events, progress, running, setRunning, environment, setEnvironment: changeEnvironment, scenarioData }), [scenario, current, stage, events, progress, running, environment]);
  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};

export const useMission = () => useContext(MissionContext);
