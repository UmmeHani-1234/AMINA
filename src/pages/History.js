import { useMemo, memo } from "react";
import { 
  withStyles,
  Appear, 
  Paragraph 
} from "arwes";

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
    border: "1px solid rgba(95,240,255,.4)",
    color: "#5ff0ff",
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
  statusIndicator: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  statusSuccess: {
    background: "#b5ff74",
    boxShadow: "0 0 8px #b5ff74",
  },
  statusAborted: {
    background: "#ff7373",
    boxShadow: "0 0 8px #ff7373",
  },
  flightCell: {
    color: "#5ff0ff",
  },
  customerPill: {
    display: "inline-block",
    padding: "2px 6px",
    marginRight: 4,
    marginBottom: 2,
    border: "1px solid rgba(161,236,251,.25)",
    background: "rgba(95,240,255,.08)",
    fontSize: 10,
    borderRadius: 2,
  },
  emptyCard: {
    padding: "32px 16px",
    textAlign: "center",
    color: "rgba(161,236,251,.7)",
    fontFamily: '"Source Code Pro", monospace',
  },
});

const History = memo(props => {
  const { classes, launches, entered } = props;

  const historicalLaunches = useMemo(() => {
    return launches?.filter((launch) => !launch.upcoming) || [];
  }, [launches]);

  const tableBody = useMemo(() => {
    if (!historicalLaunches.length) return null;

    return historicalLaunches.map((launch) => {
      return (
        <tr key={String(launch.flightNumber)}>
          <td style={{ width: "50px", textAlign: "center" }}>
            <span 
              className={`${classes.statusIndicator} ${launch.success ? classes.statusSuccess : classes.statusAborted}`}
              title={launch.success ? "Mission Success" : "Aborted / Failed"}
            />
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
          <td>
            {launch.customers?.map((customer, idx) => (
              <span key={idx} className={classes.customerPill}>{customer}</span>
            )) || "SpaceX, NASA"}
          </td>
        </tr>
      );
    });
  }, [historicalLaunches, classes]);

  return (
    <Appear id="history" animate show={entered}>
      <article className={classes.root}>
        <div className={classes.card}>
          <header className={classes.header}>
            <div>
              <span className={classes.eyebrow}>HISTORICAL FLIGHT ARCHIVE</span>
              <h1 className={classes.title}>MISSION HISTORY</h1>
            </div>
            <span className={classes.countBadge}>
              {historicalLaunches.length} RECORDED
            </span>
          </header>

          <Paragraph style={{ margin: "0 0 16px 0" }}>
            Telemetry logs and flight outcomes for past orbital deployments and deep-space missions.
          </Paragraph>

          <div className={classes.tableWrapper}>
            {historicalLaunches.length > 0 ? (
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>STATUS</th>
                    <th style={{ width: "65px" }}>NO.</th>
                    <th style={{ width: "135px" }}>DATE</th>
                    <th style={{ width: "190px" }}>MISSION</th>
                    <th style={{ width: "150px" }}>ROCKET</th>
                    <th>CUSTOMERS</th>
                  </tr>
                </thead>
                <tbody>
                  {tableBody}
                </tbody>
              </table>
            ) : (
              <div className={classes.emptyCard}>
                No historical mission records found yet.
              </div>
            )}
          </div>
        </div>
      </article>
    </Appear>
  );
});

export default withStyles(styles)(History);