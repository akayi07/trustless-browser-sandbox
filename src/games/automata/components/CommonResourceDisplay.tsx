import React from "react";
import background from "../images/backgrounds/top_bar.png";
import "./CommonResourceDisplay.css";

interface Props {
  iconImagePath: string;
  amount: number;
}

const CommonResourceDisplay = ({ iconImagePath, amount }: Props) => {
  return (
    <div className="common-resource-display-container">
      <img src={background} className="common-resource-display-background" />
      <img src={iconImagePath} className="common-resource-display-image" />
      <p className="common-resource-display-text">{amount.toString()}</p>
    </div>
  );
};

export default CommonResourceDisplay;