import React from 'react'
import classes from './css/Legends.module.css'
import { find } from 'lodash';
import { solidBorder } from '../../customHooks/components/util/useMapStyle';

export default ({
  colors,
  header,
  labels,
  round,
  selected,
  click,
  type
}) => {

  let legend = null;
  let markers = round ? [classes.Markers, classes.Round].join(' ') : classes.Markers;
  let continuousBg = colors && type === 'continuous' ? gradientBg(colors) : null;

  function gradientBg(colors) {
    let colorArr = ['#fff 0%'];
    for ( let color in colors ) {
      let idx = parseInt(color) + 1;
      colorArr.push(`${colors[color]} ${(100/colors.length) * idx}%`)
    }
    return colorArr.join(',');
  }

  switch(type) {
    case 'category':
      legend = labels.map((d, i) => (
          <div key={i} className={!selected.includes(d) 
            ? [classes.LegendItem__Category, classes.active].join (' ')
            : classes.LegendItem__Category} 
            onClick={() => click(d)}>
            <div 
              className={markers} 
              style={{
                background: `${colors[i] === 'stripe' ? 'repeating-linear-gradient(45deg, #ffe3a3, #ffe3a3 2px, transparent 2px, transparent 5px)' 
                  : colors[i] === 'symbol' ? 'black' 
                  : colors[i]}`,
              }}
            >
              {colors[i] === 'symbol' && <div className={classes.SymbolRound}/>}
            </div>
            <p className={classes.Label_Category}>{d}</p>
          </div>
        ));
      break;
    case 'continuous':
      legend = (
        <div className={classes.LegendItem__Continuous}>
          <div className={classes.Marker__Continuous} style={{
            background: `linear-gradient(90deg, ${continuousBg})`
          }}/>
          <div className={classes.Label__Continuous}>
            {labels.map((d,i) => <p key={i}>{d}</p>)}
          </div>
        </div>
      )
      break;
    default:
    legend = null;
  }
  
  const findSubpowerFromText = (text, sub = '2') => {
		let tempLowestIndex = Number.MAX_SAFE_INTEGER;
		let tempLowestWord;
		let found = false;
    let tempIndex = text.search(sub);
    if (tempIndex < tempLowestIndex && tempIndex !== -1) {
      tempLowestIndex = tempIndex;
      tempLowestWord = sub;
      found = true;
    }

		if (found) {
			return [
				text.substring(0, tempLowestIndex),
				text.substring(
					tempLowestIndex,
					tempLowestIndex + tempLowestWord.length
				),
				text.substring(tempLowestIndex + tempLowestWord.length)
			];
		} else {
			return false;
		}
  };
  let t = findSubpowerFromText(header);

  return (
    <div className={classes.LegendWrapper}>
      {header ? <h5 className={classes.Header}>{t[0]}<sub>{t[1]}</sub>{t[2]}</h5> : null}
      {legend}
    </div>
  )
}