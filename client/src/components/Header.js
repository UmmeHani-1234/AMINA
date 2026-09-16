import { 
  Header as ArwesHeader,
  Highlight,
  withStyles,
} from "arwes";
import { useState } from "react";
import { Link } from "react-router-dom";
import Clickable from "./Clickable";
import Centered from "./Centered";
import { useMission } from "../context/MissionContext";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    lineHeight: "96px",
    minHeight: "96px",
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: "none",
    padding: [0, 32],
    boxSizing: "border-box",
    borderBottom: "1px solid rgba(161,236,251,.2)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 auto",
    gap: 10,
    lineHeight: "normal",
  },
  nav: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: 0,
  },
  banner: {
    display: "grid",
    gap: 3,
    fontWeight: "bold",
    color: "#e4fcff",
    fontSize: 21,
    lineHeight: 1,
    whiteSpace: "nowrap",
  },
  subtitle: {
    color: "rgba(161,236,251,.65)",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 9.5,
    fontWeight: "normal",
    letterSpacing: 2,
  },
  environmentControl: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    flex: "0 0 auto",
    marginLeft: 10,
    lineHeight: "normal",
    whiteSpace: "nowrap",
  },
  environmentLabel: {
    display: "block",
    marginRight: 6,
    color: theme.color.content,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  environmentButton: {
    padding: "6px 11px",
    border: "1px solid rgba(161,236,251,.35)",
    background: "transparent",
    color: theme.color.content,
    cursor: "pointer",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 11,
  },
  environmentButtonActive: {
    borderColor: "#b5ff74",
    color: "#b5ff74",
    background: "rgba(181,255,116,.12)",
  },
  clickable: {
    fontSize: 13,
    lineHeight: "normal",
    whiteSpace: "nowrap",
    "& i": {
      marginRight: 4,
      fontSize: 17,
      verticalAlign: "-3px",
    },
  },
  link: {
    color: theme.color.content,
    textDecoration: "none",
  },
  button: {
    padding: [4, 7],
  },
  menuButton: {
    display: "none",
    padding: "8px 12px",
    border: "1px solid rgba(161,236,251,.35)",
    background: "transparent",
    color: theme.color.content,
    cursor: "pointer",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 11,
  },
  "@media (max-width: 1250px)": {
    root: {
      gap: 10,
      padding: [0, 18],
    },
    clickable: {
      fontSize: 11.5,
      "& i": {
        fontSize: 15,
      },
    },
    button: {
      padding: [2, 4],
    },
    banner: {
      fontSize: 18,
    },
  },
  "@media (max-width: 900px)": {
    root: {
      flexWrap: "wrap",
      minHeight: 84,
      lineHeight: "normal",
      padding: [10, 16],
    },
    menuButton: {
      display: "block",
      marginLeft: "auto",
    },
    nav: {
      display: "none",
      flex: "1 0 100%",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      paddingBottom: 10,
      gap: 6,
    },
    navOpen: {
      display: "flex",
    },
    environmentControl: {
      marginLeft: "auto",
      marginRight: 0,
    },
    img: {
      height: "44px !important",
    },
    button: {
      padding: [4, 10],
    },
    clickable: { fontSize: 13 },
  },
});

const Header = props => {
  const { classes, onNav, ...rest } = props;
  const { environment, setEnvironment } = useMission();
  const [menuOpen, setMenuOpen] = useState(false);
  return <ArwesHeader animate>
    <Centered className={classes.root} {...rest}>
      <img src="/favicon.png" alt="" className={classes.img} style={{
        margin: 0,
        height: "48px",
        width: "auto",
      }} />
      <div className={classes.brand}>
        <div className={classes.banner}>AMINA-LUNAR<span className={classes.subtitle}>MISSION CONTROL</span></div>
      </div>
      <button className={classes.menuButton} type="button" onClick={() => setMenuOpen(value => !value)} aria-expanded={menuOpen}>MENU</button>
      <div className={classes.environmentControl} aria-label="Mission environment">
        <span className={classes.environmentLabel}>MISSION ENVIRONMENT</span>
        <button className={`${classes.environmentButton} ${environment === "day" ? classes.environmentButtonActive : ""}`} onClick={() => setEnvironment("day")} type="button">DAY</button>
        <button className={`${classes.environmentButton} ${environment === "night" ? classes.environmentButtonActive : ""}`} onClick={() => setEnvironment("night")} type="button">NIGHT</button>
      </div>
      <nav className={`${classes.nav} ${menuOpen ? classes.navOpen : ""}`}>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/">
              <i className="material-icons">dashboard</i>Mission
            </Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/rover">
              <i className="material-icons">smart_toy</i>Rover
            </Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/tracking"><i className="material-icons">location_on</i>Tracking</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/navigation">
            <i className="material-icons">map</i>Navigation</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/science">
            <i className="material-icons">biotech</i>Science</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/ai"><i className="material-icons">psychology</i>AI Engine</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/fdir"><i className="material-icons">health_and_safety</i>FDIR</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/energy"><i className="material-icons">battery_full</i>Energy</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/telemetry"><i className="material-icons">sensors</i>Telemetry</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/cubesat"><i className="material-icons">satellite_alt</i>CubeSat</Link>
          </Highlight>
        </Clickable>
        <Clickable className={classes.clickable} onClick={onNav}>
          <Highlight className={classes.button} animate layer="header">
            <Link className={classes.link} to="/satellite"><i className="material-icons">public</i>Orbit</Link>
          </Highlight>
        </Clickable>
      </nav>
    </Centered>
  </ArwesHeader>
};

export default withStyles(styles)(Header);