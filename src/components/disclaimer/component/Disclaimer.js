import React from 'react'
import c from './css/Disclaimer.module.css'

const Disclaimer = ({ disclaimer }) => {

  const [click, setClick] = React.useState(false);
  const style = !click ? c.DisclaimerWrapper : [c.DisclaimerWrapper, c.Closed].join(' ')
  const { title, text, button } = disclaimer;
  if (click) localStorage.setItem('hide', 'true');
  let content = (
    <div className={style}>
      <div className={c.DisclaimerContent}>
        {title && <h4> {title} </h4>}
        {text && <p> {text} </p>}
        <button onClick={() => setClick(!click)}>
          {button ? button : 'I understand'}
        </button>
      </div>
    </div>
  );
  
  if (localStorage.getItem('hide')) content = <div></div>;  
  window.onunload = () => localStorage.removeItem('hide');

  return content;
}

export default Disclaimer;
