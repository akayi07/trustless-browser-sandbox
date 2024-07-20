import React from "react";
import "./Creature.css";
import creatureBackground from "../images/backgrounds/creature_frame.png";
import bot from "../images/CreatureBots/idle_robot.png";

interface Props {
  isCreating: boolean;
  botId: string;
  onSelect: () => void;
}

const Creature = ({ isCreating, botId, onSelect }: Props) => {
  return (
    <div className="creature-container" onClick={onSelect}>
      <img src={creatureBackground} className="creature-background" />
      <img src={bot} className="creature-image" />
      <p className="creature-text">{isCreating ? "Creating" : botId}</p>
    </div>
  );
};

export default Creature;