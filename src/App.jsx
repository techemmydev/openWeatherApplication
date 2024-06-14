import React, { useEffect, useState } from "react";
import TobButttons from "./components/TobButttons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import ForeCast from "./components/ForeCast";

import getFormattedWeatherData from "./Services/WeatherServices";

const App = () => {
  const [query, setQuery] = useState({ q: "Nigeria" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getWeather = async () => {
    try {
      const message = query.q ? query.q : "current location";
      toast.info(`Fetching weather data for ${capitalize(message)}`);
      const data = await getFormattedWeatherData({ ...query, units });
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`);
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error(`Error fetching weather data: ${error.message}`);
    }
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-600 to-blue-700";
    return "from-yellow-600 to-orange-700";
  };

  return (
    <div
      className={`min-h-screen w-full py-5 px-4 bg-gradient-to-br shadow-xl ${formatBackground()}`}
    >
      <div className="mx-auto max-w-screen-lg">
        <TobButttons setQuery={setQuery} />
        <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
        {weather && (
          <>
            <TimeAndLocation weather={weather} />
            <TempAndDetails weather={weather} units={units} />
            <ForeCast title="hourly forecast" data={weather.hourly} />
            <ForeCast title="daily forecast" data={weather.daily} />
          </>
        )}
        <ToastContainer
          autoClose={2500}
          hideProgressBar={true}
          theme="colored"
        />
      </div>
    </div>
  );
};

export default App;
