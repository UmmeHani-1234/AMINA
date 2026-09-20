import { 
  Header as ArwesHeader,
  Highlight,
  withStyles,
} from "arwes";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import Clickable from "./Clickable";
import Centered from "./Centered";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    lineHeight: "normal",
    minHeight: "72px",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
    maxWidth: "none",
    padding: [0, 24],
    boxSizing: "border-box",
    borderBottom: "1px solid rgba(161,236,251,.2)",
    position: "relative",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 auto",
    gap: 12,
    textDecoration: "none",
  },
  brandImg: {
    margin: 0,
    height: "42px",
    width: "auto",
    filter: "drop-shadow(0 0 8px rgba(95,240,255,0.6))",
  },
  banner: {
    display: "grid",
    gap: 2,
    fontWeight: "bold",
    color: "#e4fcff",
    fontSize: 18,
    lineHeight: 1,
    whiteSpace: "nowrap",
    letterSpacing: 1.5,
  },
  subtitle: {
    color: "rgba(161,236,251,.65)",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 9,
    fontWeight: "normal",
    letterSpacing: 2,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "auto",
    gap: 4,
    flexWrap: "wrap",
  },
  clickable: {
    fontSize: 12,
    lineHeight: "normal",
    whiteSpace: "nowrap",
    "& i": {
      marginRight: 4,
      fontSize: 15,
      verticalAlign: "-2px",
    },
  },
  link: {
    color: theme.color.content,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  linkActive: {
    color: "#5ff0ff !important",
    fontWeight: "600",
  },
  button: {
    padding: [4, 6],
    borderRadius: 2,
    transition: "all 0.2s ease",
  },
  menuButton: {
    display: "none",
    padding: "7px 14px",
    border: "1px solid rgba(161,236,251,.45)",
    background: "rgba(3,18,25,.85)",
    color: "#5ff0ff",
    cursor: "pointer",
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginLeft: "auto",
    borderRadius: 2,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#5ff0ff",
      boxShadow: "0 0 10px rgba(95,240,255,.4)",
      background: "rgba(95,240,255,.12)",
    },
  },
  backdrop: {
    display: "none",
  },
  "@media (max-width: 1350px)": {
    menuButton: {
      display: "block",
    },
    backdrop: {
      display: "block",
      position: "fixed",
      inset: 0,
      zIndex: 998,
      background: "rgba(0,0,0,0.5)",
    },
    nav: {
      display: "none",
      position: "absolute",
      top: "calc(100% + 4px)",
      right: 16,
      zIndex: 999,
      background: "linear-gradient(135deg, rgba(3,18,25,.98), rgba(2,12,18,.98))",
      border: "1px solid rgba(161,236,251,.4)",
      boxShadow: "0 12px 36px rgba(0,0,0,.85), 0 0 20px rgba(95,240,255,.15)",
      padding: 12,
      flexDirection: "column",
      alignItems: "stretch",
      gap: 4,
      minWidth: 200,
      maxHeight: "80vh",
      overflowY: "auto",
    },
    navOpen: {
      display: "flex",
    },
    clickable: {
      fontSize: 13,
      padding: [4, 0],
    },
    button: {
      padding: [6, 10],
      width: "100%",
      boxSizing: "border-box",
    },
  },
  "@media (max-width: 600px)": {
    root: {
      padding: [0, 14],
      minHeight: 64,
    },
    brandImg: {
      height: "36px",
    },
    banner: {
      fontSize: 15,
    },
  },
});

const NAV_LINKS = [
  { to: "/", label: "Mission", icon: "dashboard" },
  { to: "/rover", label: "Rover", icon: "smart_toy" },
  { to: "/tracking", label: "Tracking", icon: "location_on" },
  { to: "/navigation", label: "Nav", icon: "map" },
  { to: "/science", label: "Science", icon: "biotech" },
  { to: "/ai", label: "AI", icon: "psychology" },
  { to: "/fdir", label: "FDIR", icon: "health_and_safety" },
  { to: "/energy", label: "Energy", icon: "battery_full" },
  { to: "/telemetry", label: "Telemetry", icon: "sensors" },
  { to: "/cubesat", label: "CubeSat", icon: "satellite_alt" },
  { to: "/satellite", label: "Orbit", icon: "public" },
  { to: "/launch", label: "Launch", icon: "flight_takeoff" },
  { to: "/upcoming", label: "Upcoming", icon: "schedule" },
  { to: "/history", label: "History", icon: "history" },
];

const Header = memo(props => {
  const { classes, onNav, ...rest } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

  // Close mobile dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
    if (onNav) onNav();
  }, [onNav]);

  return <ArwesHeader animate>
    <Centered className={classes.root} {...rest} ref={headerRef}>
      <Link to="/" className={classes.brand} onClick={handleNavClick}>
        <img src="/favicon.png" alt="AMINA Logo" className={classes.brandImg} />
        <div className={classes.banner}>
          AMINA-LUNAR
          <span className={classes.subtitle}>MISSION CONTROL</span>
        </div>
      </Link>

      <button 
        className={classes.menuButton} 
        type="button" 
        onClick={() => setMenuOpen(prev => !prev)} 
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "CLOSE ✕" : "MENU ☰"}
      </button>

      {menuOpen && (
        <div 
          className={classes.backdrop} 
          onClick={() => setMenuOpen(false)} 
          aria-hidden="true" 
        />
      )}

      <nav className={`${classes.nav} ${menuOpen ? classes.navOpen : ""}`}>
        {NAV_LINKS.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Clickable key={item.to} className={classes.clickable} onClick={handleNavClick}>
              <Highlight className={classes.button} animate layer="header">
                <Link className={`${classes.link} ${isActive ? classes.linkActive : ""}`} to={item.to}>
                  <i className="material-icons">{item.icon}</i>
                  {item.label}
                </Link>
              </Highlight>
            </Clickable>
          );
        })}
      </nav>
    </Centered>
  </ArwesHeader>;
});

export default withStyles(styles)(Header);