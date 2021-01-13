import React from "react";
import classes from "./css/Legends.module.css";

export default ({
  type,
  header,
  labels,
  colors,
  selected,
  unitLabel,
  round,
  click,
}) => {

  const isClickable = click ? true : false;
  const continuousBg =
    colors && type === "continuous" ? gradientBg(colors) : null;

  const markerStyle = round
    ? [classes.Markers, classes.Round].join(" ")
    : classes.Markers;

  function gradientBg(colors) {
    let colorArr = [];
    for (let color in colors) {
      let idx = parseInt(color);
      colorArr.push(`${colors[color]} ${(100 / (colors.length - 1)) * idx}%`);
    }
    return colorArr.join(",");
  }

  function categoryLabelStyle(label) {
    return !selected.includes(label)
      ? [classes.LegendItem__Category, classes.active].join(" ")
      : classes.LegendItem__Category;
  }

  function handleClick(label) {
    if (!isClickable) return;
    click(label);
  }

  function markerFill(i) {
    let color = colors[i];
    let stripeColor = color.colors
      ? { stroke: color.colors[0], bg: color.colors[1] }
      : { stroke: "#000", bg: "#fff" };
    let lineColor = color.colors
      ? { stroke: color.colors[0], bg: color.colors[1] }
      : { stroke: "#000", bg: "#fff" };
    let dotColor = color.color ? color.color : "#000";

    if (typeof color === "string") {
      return color;
    } else {
      if (color.type === "stripe") {
        return `repeating-linear-gradient(135deg, ${stripeColor.stroke}, ${stripeColor.stroke} 2px, ${stripeColor.bg} 3px, ${stripeColor.bg} 5px)`;
      } else if (color.type === "line") {
        return `linear-gradient(0deg, ${lineColor.bg} 43%, ${lineColor.stroke} 43% 57%, ${lineColor.bg} 57%)`;
      } else if (color.type === "dot") {
        return dotColor;
      }
    }
  }

  let legend = null;

  switch (type) {
    case "category":
      legend = labels.map((label, i) => (
        <div
          key={i}
          className={categoryLabelStyle(label)}
          onClick={() => handleClick(label)}
        >
          <div className={markerStyle} style={{ background: markerFill(i) }}>
            {colors[i].type === "dot" && (
              <div className={classes.SymbolRound} />
            )}
          </div>
          <p className={classes.Label_Category}>{label}</p>
        </div>
      ));
      break;
    case "continuous":
      legend = (
        <div className={classes.LegendItem__Continuous}>
          {unitLabel && <div className={classes.UnitTop}>{unitLabel}</div>}
          <div
            className={classes.Marker__Continuous}
            style={{ background: `linear-gradient(90deg, ${continuousBg})` }}
          />
          <div className={classes.Label__Continuous}>
            {labels.map((label, i) => (
              <p key={i}>{label}</p>
            ))}
          </div>
        </div>
      );
      break;
    default:
      legend = null;
  }

  return (
    <div className={classes.LegendWrapper}>
      {header && displayText(header)}
      {legend}
    </div>
  );
};

function displayText(text) {
  let sub = "2";
  let tempLowestIndex = Number.MAX_SAFE_INTEGER;
  let tempLowestWord;
  let found = false;
  let tempIndex = text.search(sub);
  let hasCO2 = text ? text.search("CO2") !== -1 : false;

  if (tempIndex < tempLowestIndex && tempIndex !== -1) {
    tempLowestIndex = tempIndex;
    tempLowestWord = sub;
    found = true;
  }

  if (hasCO2 && found) {
    let t = [
      text.substring(0, tempLowestIndex),
      text.substring(tempLowestIndex, tempLowestIndex + tempLowestWord.length),
      text.substring(tempLowestIndex + tempLowestWord.length),
    ];
    return (
      <h5 className={classes.Header}>
        {t[0]}
        <sub>{t[1]}</sub>
        {t[2]}
      </h5>
    );
  } else {
    return <h5 className={classes.Header}> {text} </h5>;
  }
}
