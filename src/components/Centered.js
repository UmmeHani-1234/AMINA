import { withStyles } from "arwes";

const styles = () => ({
  root: {
    width: "100%",
    maxWidth: "none",
    margin: 0,
  },
  "@media (max-width: 800px)": {
    root: {
      margin: 0,
    }
  }
});

const Centered = props => {
  const {
    classes,
    className,
    children,
    ...rest
  } = props;
  return (
    <div className={`${classes.root} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default withStyles(styles)(Centered);
