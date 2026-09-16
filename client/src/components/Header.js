import { 
  Header as ArwesHeader,
  withStyles,
} from "arwes";
import { useMission } from "../context/MissionContext";
import Centered from "./Centered";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    lineHeight: "80px",
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: "none",
    padding: [0, 26],
    boxSizing: "border-box",
    borderBottom: "1px solid rgba(161,236,251,.16)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 auto",
    gap: 8,
    lineHeight: "normal",
  },
  banner: {
    display: "grid",
    gap: 2,
    fontWeight: "bold",
    color: "#e4fcff",
    fontSize: 17,
    lineHeight: 1,
    whiteSpace: "nowrap",
  },
  subtitle: {
    color: "rgba(161,236,251,.62)",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 8,
    fontWeight: "normal",
    letterSpacing: 1.5,
  },
  environmentControl: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flex: "0 0 auto",
    marginLeft: "auto",
    lineHeight: "normal",
    whiteSpace: "nowrap",
  },
  environmentLabel: {
    display: "block",
    marginRight: 4,
    color: theme.color.content,
    fontSize: 9,
    letterSpacing: 1,
  },
  environmentButton: {
    padding: "5px 7px",
    border: "1px solid rgba(161,236,251,.35)",
    background: "transparent",
    color: theme.color.content,
    cursor: "pointer",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 10,
  },
  environmentButtonActive: {
    borderColor: "#b5ff74",
    color: "#b5ff74",
    background: "rgba(181,255,116,.08)",
  },
  "@media (max-width: 900px)": {
    root: {
      minHeight: 60,
      lineHeight: "normal",
      padding: [8, 12],
    },
    environmentControl: {
      marginLeft: "auto",
      marginRight: 0,
    },
    img: {
      height: "36px !important",
    },
  },
});

const Header = props => {
  const { classes, ...rest } = props;
  const { environment, setEnvironment } = useMission();
  return <ArwesHeader animate>
    <Centered className={classes.root} {...rest}>
      <img src="/favicon.png" alt="" className={classes.img} style={{
        margin: 0,
        height: "38px",
        width: "auto",
      }} />
      <div className={classes.brand}>
        <div className={classes.banner}>AMINA-LUNAR<span className={classes.subtitle}>MISSION CONTROL</span></div>
      </div>
      <div className={classes.environmentControl} aria-label="Mission environment">
        <span className={classes.environmentLabel}>MISSION ENVIRONMENT</span>
        <button className={`${classes.environmentButton} ${environment === "day" ? classes.environmentButtonActive : ""}`} onClick={() => setEnvironment("day")} type="button">DAY</button>
        <button className={`${classes.environmentButton} ${environment === "night" ? classes.environmentButtonActive : ""}`} onClick={() => setEnvironment("night")} type="button">NIGHT</button>
      </div>
    </Centered>
  </ArwesHeader>;
};

export default withStyles(styles)(Header);