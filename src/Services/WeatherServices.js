import { DateTime } from "luxon";
const API_KEY = `e721352dd5948d58404eddbe26f3b868`;
const BASE_URL = `https://api.openweathermap.org/data/2.5/`;

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  return fetch(url).then((res) => res.json());
};
const iconUrlFromCode = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;
const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd, LLL yyyy ' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;
  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime;
  return {
    temp,
    feels_like,
    temp_max,
    temp_min,
    name,
    country,
    humidity,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    formattedLocalTime,
    dt,
    timezone,
    lat,
    lon,
  };
};
const formatForecastWeather = (secs, offset, data) => {
  //hourly
  const hourly = data
    .filter((f) => f.dt > secs)

    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: iconUrlFromCode(f.weather[0].icon),
      data: f.dt_txt,
    }))
    .slice(0, 5);
  //daily
  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: iconUrlFromCode(f.weather[0].icon),
      data: f.dt_txt,
    }));
  return { hourly, daily };
};
const getFormattedWeatherData = async (searchParams) => {
  const FormattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);
  const { dt, lat, lon, timezone } = FormattedCurrentWeather;

  const formattedForecastWether = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then((data) => formatForecastWeather(dt, timezone, data.list));
  return { ...FormattedCurrentWeather, ...formattedForecastWether };
};

export default getFormattedWeatherData;
