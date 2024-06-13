import React from "react";

const TimeAndLocation = ({ weather: { formattedLoalTime, name, country } }) => {
  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-xl font-extralight">{formattedLoalTime}</p>
      </div>
      <div className="flex items-center justify-center my-3">
        <p className="text-3xl font-medium"> {`${name}, ${country}`}</p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
