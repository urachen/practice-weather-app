import React, { useState, useEffect, useMemo } from "react";
import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting"
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import { getMoment, findLocation } from "./utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  solid,
  regular,
  brands,
  light,
} from "@fortawesome/fontawesome-svg-core/import.macro";

const AUTHORIZATION_KEY = "CWB-35F43367-4C37-4C79-86F7-1A4F18FDD452";
const LOCATION_NAME = "新竹";
const LOCATION_NAME_FORECAST = "新竹縣";
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadein 1s linear forwards;
`;

function App() {
  const storageCity = localStorage.getItem('city') || "新竹縣";
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("WeatherCard")
  const [currentCity, setCurrentCity] = useState(storageCity)
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY
  })

  const handleModeChange = (e) => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  const handleChangeCurrentPage = (currentPage) => {
    setCurrentPage(currentPage);
  }

  const handleChangeCurrentCity = (currentCity) => {
    setCurrentCity(currentCity);
  }

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <div className="switch-button">
          <input
            type="checkbox"
            id="tooglenight"
            className="cbx hidden"
            onChange={handleModeChange}
            checked={currentTheme === "light" ? false : true}
          />
          <FontAwesomeIcon icon={regular("sun")} />
          <label htmlFor="tooglenight" className="switch"></label>
          <FontAwesomeIcon icon={regular("moon")} />
        </div>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleChangeCurrentPage={handleChangeCurrentPage}
            cityName={cityName}
          />)}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            handleChangeCurrentPage={handleChangeCurrentPage}
            handleChangeCurrentCity={handleChangeCurrentCity}
            cityName={cityName} />)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
