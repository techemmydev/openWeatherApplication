import React from "react";

const ForeCast = ({ title, data }) => {
  return (
    <div>
      <div className="flexitems-center justify-start mt-6">
        <p className="font-medium uppercase">{title}</p>
      </div>
      <hr className="my-1" />
      <div className="flex items-center justify-between">
        {data.map((d, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <p className="font-light text-sm">{d.title}</p>
              <img src={d.icon} alt="weather icon" className="w-12 my-1" />
              <p className="font-medium">12°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForeCast;
