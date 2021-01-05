import React from 'react'
import { Icon } from '../../icons'
import { useTheme } from '../../../context'
import classes from './css/ControlWrapper.module.css'

export default props => {

  const { children,dark, bg } = props;
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();

  // const style = !open && !dark
  //   ? classes.ControlsWrapper 
  //   : open && !dark
  //   ? [classes.ControlsWrapper, classes.open].join(' ') 
  //   : !open && dark
  //   ? [classes.ControlsWrapper, classes.dark].join(' ')
  //   : [classes.ControlsWrapper, classes.open, classes.dark].join(' ');
  
  const style = !open ? classes.ControlsWrapper : [classes.ControlsWrapper, classes.open].join(' ') 

  return (
    <section style={theme.style} className={style}>
      <ToggleWrapper {...props} setOpen={setOpen} open={open}/>
      <div className={classes.ControlsContainer}>
        <div className={classes.Controls}>
          {React.Children.map(children, (child,idx) => 
            React.cloneElement(child, { dark: dark, bg: bg, key: idx}) )}
        </div>
      </div>
    </section>
  )
};


const ToggleWrapper = props => {
  
  const {
    help,
    helpTitle,
    helpClick,
    download,
    dark,
    setOpen,
    open,
  } = props;

  const closeIcon =  <Icon type='close' button={true} dark={dark} click={_ => setOpen(!open)} stroke />;
  const openIcon = <Icon type='menu' button={true} dark={dark} click={_ => setOpen(!open)} fill />;

  return (
    <div className={classes.ControlToggleWrapper}>
      <div className={classes.ControlToggleContainer}> 
        {open ? closeIcon : openIcon}
        {
          help &&
            <Icon 
              fill 
              button 
              type='help' 
              dark='float' 
              title={helpTitle} 
              click={helpClick} 
              styles={classes.Help} 
            />
        }
        {
          download &&
            <div className={classes.DownloadWrapper}>
              <a href={download.link} className={classes.DownloadButton}>
                <Icon type='download' strokeWidth={1} stroke viewBox='-13 -11 50 50' dark='float' />
              </a>
              <div className={classes.DownloadContainer}>
                {download.label}
              </div>
            </div>
        }
      </div>
    </div>
  )
}

