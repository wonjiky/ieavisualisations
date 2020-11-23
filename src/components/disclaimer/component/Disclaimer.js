import React from 'react'
import c from './css/Disclaimer.module.css'

const Disclaimer = ({ disclaimer }) => {

  const [click, setClick] = React.useState(false);
  let style = !click ? c.DisclaimerWrapper : [c.DisclaimerWrapper, c.Closed].join(' ')

  if (click) localStorage.setItem('hide', 'true');
  
  let content = (
    <div className={style}>
      <div className={c.DisclaimerContent}>
        <h4> Weather for energy tracker </h4>
        <p> {disclaimer} </p>
        <button onClick={() => setClick(!click)}>I understand</button>
      </div>
    </div>
  );
  
  if (localStorage.getItem('hide')) content = <div></div>;  

  window.onbeforeunload = () => localStorage.removeItem('hide');
  
  return <div></div>;
}

export default Disclaimer
