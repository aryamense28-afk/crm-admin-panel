import React from "react";

export default function DealPrediction({ probability }) {

  let prediction = "Low Chance";

  if (probability > 70) prediction = "High Chance";
  else if (probability > 40) prediction = "Medium Chance";

  return (
    <div className="prediction">
      <h4>AI Prediction</h4>
      <p>{prediction}</p>
    </div>
  );
}