import { useMemo, memo } from "react";
import { 
  withStyles,
  Appear,
  Paragraph,
  Words,
} from "arwes";
import { Link } from "react-router-dom";
import Clickable from "../components/Clickable";

const styles = () => ({
  root: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "clamp(10px, 2vw, 24px)",
    boxSizing: "border-box",
  },
  card: {
    border: "1px solid rgba(161,236,251,.28)",
    background: "linear-gradient(135deg, rgba(5,26,34,.9), rgba(3,15,21,.78))",
    boxShadow: "inset 0 0 30px rgba(95,240,255,.03), 0 8px 32px rgba(0,0,0,.5)",
    padding: "clamp(14px, 2.5vw, 28px)",
    boxSizing: "border-box",
  },
  header: {
    borderBottom: "1px solid rgba(161,236,251,.2)",
    paddingBottom: 14,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 12,
  },
  eyebrow: {
    color: "#b5ff74",
    fontSize: 10,
    letterSpacing: 2,
    margin: "0 0 6px 0",
    display: "block",
  },
  title: {
    margin: 0,
    color: "#e4fcff",
    fontFamily: '"Titillium Web", sans-serif',
    fontSize: "clamp(20px, 2.8vw, 28px)",
    fontWeight: 300,
    letterSpacing: 2,
  },
  countBadge: {
    padding: "4px 10px",
    border: "1px solid rgba(181,255,116,.45)",
    color: "#b5ff74",
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: '"Source Code Pro", monospace',
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    border: "1px solid rgba(161,236,251,.15)",
    background: "rgba(2,12,18,.6)",
    margin: "16px 0",
  },
  table: {
    width: "100%",
    minWidth: "680px",
    borderCollapse: "collapse",
    "& th": {
      color: "#5ff0ff",
      fontFamily: '"Source Code Pro", monospace',
      fontSize: 11,
      letterSpacing: 1.2,
      padding: "12px 14px",
      textAlign: "left",
      borderBottom: "1px solid rgba(161,236,251,.2)",
      background: "rgba(3,18,25,.8)",
    },
    "& td": {
      padding: "12px 14px",
      fontSize: 12,
      borderBottom: "1px solid rgba(161,236,251,.08)",
      color: "#e4fcff",
      fontFamily: '"Source Code Pro", monospace',
    },
    "& tr:hover td": {
      background: "rgba(95,240,255,.05)",
    },
  },
  abortBtn: {
    color: "#ff7373 !important",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: 14,
    padding: "3px 8px",
    border: "1px solid rgba(255,115,115,.4)",
    borderRadius: 2,
    display: "inline-block",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255,115,115,.2)",
      borderColor: "#ff7373",
      boxShadow: "0 0 8px rgba(255,115,115,.4)",
    },
  },
  targetCell: {
    color: "#b5ff74",
    fontWeight: "bold",
  },
  flightCell: {
    color: "#5ff0ff",
  },
  emptyCard: {
    padding: "32px 16px",
    textAlign: "center",
    color: "rgba(161,236,251,.7)",
    fontFamily: '"Source Code Pro", monospace',
  },
  scheduleLink: {
    color: "#5ff0ff",
    textDecoration: "underline",
    marginLeft: 6,
    fontWeight: "bold",
  },
  warning: {
    color: "#ffc857",
    fontSize: 11,
    fontFamily: '"Source Code Pro", monospace',
    margin: "10px 0 0 0",
    display: "block",
  },
});

const Upcoming = memo(props => {
  const { 
    entered,
    launches,
    classes,
    abortLaunch,
  } = props;

  const upcomingLaunches = useMemo(() => {
    return launches?.filter((launch) => launch.upcoming) || [];
  }, [launches]);

  const tableBody = useMemo(() => {
    if (!upcomingLaunches.length) return null;

    return upcomingLaunches.map((launch) => {
      return (
        <tr key={String(launch.flightNumber)}>
          <td style={{ width: "50px", textAlign: "center" }}>
            <Clickable>
              <button 
                type="button" 
                className={classes.abortBtn} 
                onClick={() => abortLaunch(launch.flightNumber)}
                title="Abort scheduled mission"
                aria-label={`Abort mission ${launch.mission}`}
              >
                ✖
              </button>
            </Clickable>
          </td>
          <td className={classes.flightCell} style={{ width: "65px" }}>
            #{launch.flightNumber}
          </td>
          <td style={{ width: "135px" }}>
            {new Date(launch.launchDate).toLocaleDateString()}
          </td>
          <td style={{ width: "190px" }}>
            <strong>{launch.mission}</strong>
          </td>
          <td style={{ width: "150px" }}>
            {launch.rocket}
          </td>
          <td className={classes.targetCell}>
            {launch.target}
          </td>
        </tr>
      );
    });
  }, [upcomingLaunches, abortLaunch, classes]);

  return (
    <Appear id="upcoming" animate show={entered}>
      <div className={classes.root}>
        <div className={classes.card}>
          <header className={classes.header}>
            <div>
              <span className={classes.eyebrow}>FLIGHT MANIFEST & LAUNCH QUEUE</span>
              <h1 className={classes.title}>UPCOMING MISSIONS</h1>
            </div>
            <span className={classes.countBadge}>
              {upcomingLaunches.length} ACTIVE {upcomingLaunches.length === 1 ? "MISSION" : "MISSIONS"}
            </span>
          </header>

          <Paragraph style={{ margin: "0 0 8px 0" }}>
            Upcoming orbital injections and planetary transfer missions.
          </Paragraph>
          <span className={classes.warning}>
            <Words animate>Warning: Triggering ✖ aborts the flight plan and shifts the record to historical telemetry.</Words>
          </span>

          <div className={classes.tableWrapper}>
            {upcomingLaunches.length > 0 ? (
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>ABORT</th>
                    <th style={{ width: "65px" }}>NO.</th>
                    <th style={{ width: "135px" }}>DATE</th>
                    <th style={{ width: "190px" }}>MISSION</th>
                    <th style={{ width: "150px" }}>ROCKET</th>
                    <th>DESTINATION</th>
                  </tr>
                </thead>
                <tbody>
                  {tableBody}
                </tbody>
              </table>
            ) : (
              <div className={classes.emptyCard}>
                No upcoming launches currently scheduled. 
                <Link to="/launch" className={classes.scheduleLink}>Schedule a new mission now →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Appear>
  );
});

export default withStyles(styles)(Upcoming);