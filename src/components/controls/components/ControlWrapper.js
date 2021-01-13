import React from "react";
import { Icon } from "../../icons";
// import { useTheme } from '../../../context'
import { useTheme } from "@iea/react-components";
import classes from "./css/ControlWrapper.module.css";

export default ({ children, ...props }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const style = !open
    ? classes.ControlsWrapper
    : [classes.ControlsWrapper, classes.open].join(" ");

  return (
    <section style={theme.style} className={style}>
      <ToggleWrapper {...props} setOpen={setOpen} open={open} />
      <div className={classes.ControlsContainer}>
        <div className={classes.Controls}>
          {React.Children.map(children, (child, idx) =>
            React.cloneElement(child, { key: idx })
          )}
        </div>
      </div>
    </section>
  );
};

const ToggleWrapper = ({ help, download, setOpen, open }) => {
  const closeIcon = (
    <Icon type="close" button={true} click={(_) => setOpen(!open)} stroke />
  );
  const openIcon = (
    <Icon type="menu" button={true} click={(_) => setOpen(!open)} fill />
  );

  return (
    <div className={classes.ControlToggleWrapper}>
      <div className={classes.ControlToggleContainer}>
        {open ? closeIcon : openIcon}
        {help && (
          <Icon
            fill
            button
            type="help"
            float={true}
            title={help.title}
            click={help.click}
            styles={classes.Help}
          />
        )}
        {download && (
          <div className={classes.DownloadWrapper}>
            <a href={download.link} className={classes.DownloadButton}>
              <Icon
                stroke
                type="download"
                float={true}
                strokeWidth={1}
                viewBox="-13 -11 50 50"
              />
            </a>
            <div className={classes.DownloadContainer}>{download.label}</div>
          </div>
        )}
      </div>
    </div>
  );
};
