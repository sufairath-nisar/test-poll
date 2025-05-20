import React from "react";
import { PollTabs } from "./PollComponent";

export const PollRow: React.FC = () => {
  const pollIds = ["poll1", "poll2", "poll3"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around", 
        alignItems: "flex-start",
        maxWidth: "1000px", 
        margin: "auto",
        padding: 20,
        gap: "20px", 
      }}
    >
      {pollIds.map((id) => (
        <PollTabs key={id}  />
      ))}
    </div>
  );
};
