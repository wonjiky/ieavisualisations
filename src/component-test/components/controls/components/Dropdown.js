import React from "react";
import { Icon } from "../../icons";
import { useTheme } from "../../../context";
import classes from "./css/Dropdown.module.css";

const Dropdown = ({
  label,
  options,
  click,
  selected,
  bottom,
  group,
  active,
  open,
}) => {
  const { theme, style } = useTheme();

  const optionStyle =
    active.open && active.target === label
      ? [classes.DropdownOptions, classes.active].join(" ")
      : classes.DropdownOptions;

  const dropdownStyle =
    theme === "dark"
      ? [classes.DropdownWrapper, classes.dark].join(" ")
      : classes.DropdownWrapper;

  const iconStyle =
    theme === "dark" ? [classes.Icon, classes.dark].join(" ") : classes.Icon;

  const groupedList = options.reduce((acc, curr) => {
    acc[curr.group] = [...(acc[curr.group] || []), curr];
    return acc;
  }, {});

  const buttonMeta = {
    iconStyle,
    theme: theme,
    style: style,
    selected: selected,
    open: open,
    label: label,
  };

  const optionsMeta = {
    bottom: bottom,
    options: options,
    group: group,
    click: click,
    optionStyle,
    groupedList,
  };

  return (
    <div className={dropdownStyle}>
      <label className={classes.DropdownLabel}> {label} </label>
      <Button {...buttonMeta} />
      <Options {...optionsMeta} />
    </div>
  );
};

export default Dropdown;

const Button = ({ label, open, style, theme, selected, iconStyle }) => (
  <button value={label} onClick={(e) => open(e)}>
    <span style={{ color: style.color }}>{selected}</span>
    <div className={iconStyle}>
      <Icon type="downArrow" dark={theme === "dark" ? true : false} />
    </div>
  </button>
);

const Options = ({
  bottom,
  optionStyle,
  options,
  groupedList,
  group,
  click,
}) => (
  <div
    id="dropdown"
    style={bottom ? { top: "unset", bottom: "0px" } : null}
    className={optionStyle}
  >
    <div>
      <ul>
        {group ? (
          Object.entries(groupedList).map((option, idx) => (
            <Group
              key={`group-${idx}`}
              option={option[1]}
              group={group}
              click={click}
            />
          ))
        ) : (
          <Single option={options} group={group} click={click} />
        )}
      </ul>
    </div>
  </div>
);

const Group = ({ option, click, group }) => (
  <li>
    <div className={classes.NestedGroupTitle}>{option[0].group}</div>
    <ul className={classes.NestedList}>
      <Single click={click} group={group} option={option} />
    </ul>
  </li>
);

const Single = ({ option, click, group }) =>
  option.map((d, idx) => (
    <li key={idx} onClick={(_) => click(d)} className={classes.NestedOptions}>
      <div className={classes.OptionItem}>{!group ? d : d.option}</div>
    </li>
  ));
