import { useMemo, memo } from "react";
import { 
  Appear, 
  Button, 
  Loading, 
  Paragraph, 
  Words, 
  withStyles 
} from "arwes";
import Clickable from "../components/Clickable";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
    padding: "clamp(12px, 3vw, 28px)",
    boxSizing: "border-box",
  },
  card: {
    border: "1px solid rgba(161,236,251,.28)",
    background: "linear-gradient(135deg, rgba(5,26,34,.9), rgba(3,15,21,.78))",
    boxShadow: "inset 0 0 30px rgba(95,240,255,.03), 0 8px 32px rgba(0,0,0,.5)",
    padding: "clamp(16px, 3vw, 32px)",
    boxSizing: "border-box",
  },
  header: {
    borderBottom: "1px solid rgba(161,236,251,.2)",
    paddingBottom: 16,
    marginBottom: 24,
  },
  title: {
    margin: 0,
    color: "#e4fcff",
    fontFamily: '"Titillium Web", sans-serif',
    fontSize: "clamp(22px, 3vw, 30px)",
    fontWeight: 300,
    letterSpacing: 2,
  },
  eyebrow: {
    color: "#b5ff74",
    fontSize: 10,
    letterSpacing: 2,
    margin: "0 0 6px 0",
    display: "block",
  },
  desc: {
    margin: "8px 0 0 0",
    color: "rgba(228,252,255,.7)",
    fontSize: 12,
    lineHeight: 1.5,
  },
  form: {
    display: "grid",
    gap: 20,
    width: "100%",
  },
  formGroup: {
    display: "grid",
    gap: 8,
    width: "100%",
  },
  label: {
    color: "#5ff0ff",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelSub: {
    color: "rgba(161,236,251,.5)",
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "none",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    background: "rgba(3,18,25,.85)",
    border: "1px solid rgba(161,236,251,.35)",
    color: "#e4fcff",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 13,
    letterSpacing: 1,
    borderRadius: 2,
    outline: "none",
    transition: "all 0.2s ease",
    "&:focus": {
      borderColor: "#5ff0ff",
      boxShadow: "0 0 12px rgba(95,240,255,.3)",
      background: "rgba(5,28,38,.95)",
    },
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    background: "#020d14",
    border: "1px solid rgba(161,236,251,.35)",
    color: "#b5ff74",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 13,
    letterSpacing: 1,
    borderRadius: 2,
    outline: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:focus": {
      borderColor: "#5ff0ff",
      boxShadow: "0 0 12px rgba(95,240,255,.3)",
    },
    "& option": {
      background: "#020d14",
      color: "#e4fcff",
      padding: "8px",
    },
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 18,
    borderTop: "1px solid rgba(161,236,251,.15)",
    flexWrap: "wrap",
    gap: 16,
  },
  submitBtn: {
    minWidth: 180,
  },
  notice: {
    color: "rgba(161,236,251,.6)",
    fontSize: 10,
    fontFamily: '"Source Code Pro", monospace',
  },
  "@media (max-width: 600px)": {
    actionRow: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    submitBtn: {
      width: "100%",
    },
  },
});

const Launch = memo(props => {
  const { classes, planets, submitLaunch, isPendingLaunch, entered } = props;

  const selectorBody = useMemo(() => {
    return planets?.map(planet => 
      <option value={planet.kepler_name} key={planet.kepler_name}>
        {planet.kepler_name} {planet.koi_prad ? `(${planet.koi_prad} R⊕, insol: ${planet.koi_insol})` : ""}
      </option>
    );
  }, [planets]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <Appear id="launch" animate show={entered}>
      <div className={classes.root}>
        <div className={classes.card}>
          <header className={classes.header}>
            <span className={classes.eyebrow}>TRANS-LUNAR & DEEP-SPACE INJECTION</span>
            <h1 className={classes.title}>SCHEDULE MISSION LAUNCH</h1>
            <Paragraph className={classes.desc}>
              Configure orbital parameters and flight manifest. Targets are curated from NASA Kepler confirmed habitable exoplanet candidates.
            </Paragraph>
          </header>

          <form onSubmit={submitLaunch} className={classes.form}>
            <div className={classes.formGroup}>
              <label htmlFor="launch-day" className={classes.label}>
                <span>Launch Date</span>
                <span className={classes.labelSub}>UTC Timestamp</span>
              </label>
              <input 
                className={classes.input} 
                type="date" 
                id="launch-day" 
                name="launch-day" 
                min={today} 
                max="2040-12-31" 
                defaultValue={today} 
                required 
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="mission-name" className={classes.label}>
                <span>Mission Designation</span>
                <span className={classes.labelSub}>Flight Identifier</span>
              </label>
              <input 
                className={classes.input} 
                type="text" 
                id="mission-name" 
                name="mission-name" 
                placeholder="e.g. AMINA Kepler Pathfinder VII" 
                required 
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="rocket-name" className={classes.label}>
                <span>Launch Vehicle Type</span>
                <span className={classes.labelSub}>Booster Class</span>
              </label>
              <input 
                className={classes.input} 
                type="text" 
                id="rocket-name" 
                name="rocket-name" 
                defaultValue="Explorer IS1" 
                required 
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="planets-selector" className={classes.label}>
                <span>Destination Exoplanet</span>
                <span className={classes.labelSub}>Confirmed Habitable</span>
              </label>
              <select id="planets-selector" name="planets-selector" className={classes.select}>
                {selectorBody}
              </select>
            </div>

            <div className={classes.actionRow}>
              <span className={classes.notice}>
                <Words animate>All trajectory solutions validated against NASA Kepler telemetry.</Words>
              </span>

              <Clickable>
                <Button 
                  animate 
                  show={entered} 
                  type="submit" 
                  layer="success" 
                  className={classes.submitBtn}
                  disabled={isPendingLaunch}
                >
                  Schedule Mission Launch ✔
                </Button>
              </Clickable>
            </div>

            {isPendingLaunch && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 10 }}>
                <Loading animate small />
                <span style={{ color: "#5ff0ff", fontSize: 11 }}>Computing orbital injection solution...</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </Appear>
  );
});

export default withStyles(styles)(Launch);