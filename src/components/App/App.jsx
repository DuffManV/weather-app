import { useState, useEffect } from "react";
import styles from "./App.module.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import SavedLocations from "../SavedLocations/SavedLocations";
import Map from "../Map/Map";
import {
  fetchWeatherData,
  fetchCitySuggestions,
} from "../../services/weatherService";
import { getCurrentLocation } from "../../services/locationService";
import {
  getSavedLocations,
  saveLocation,
  removeLocation,
} from "../../utils/storage";
import { FaLocationDot } from "react-icons/fa6";

const App = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedLocations, setSavedLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [suggestionSelected, setSuggestionSelected] = useState(false);
  useEffect(() => {
    setSavedLocations(getSavedLocations());
  }, []);
  useEffect(() => {
    if (suggestionSelected || city.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (city.length > 2) {
      const timer = setTimeout(async () => {
        const cities = await fetchCitySuggestions(city);
        setSuggestions(cities);
        setShowSuggestions(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [city, suggestionSelected]);
  const createLocationObject = (weatherData, sourceType, sourceData = {}) => ({
    id: weatherData.id,
    value: `${weatherData.name}`,
    data: {
      city: weatherData.name,
      country: weatherData.sys?.country,
      geo_lat: weatherData.coord?.lat,
      geo_lon: weatherData.coord?.lon,
    },
    sourceType,
    ...sourceData,
  });
  const handleSearch = async (location) => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const weatherData = await fetchWeatherData(location);
      setWeather(weatherData);
      const locationObj = createLocationObject(weatherData, "search");
      setCurrentLocation(locationObj);
      setSuggestionSelected(true);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setCity("");
      setLoading(false);
    }
  };
  const handleGeolocation = async () => {
    setLoading(true);
    setError("");
    setWeather(null);
    setCity("");
    setShowSuggestions(false);
    setSuggestionSelected(false);
    try {
      const position = await getCurrentLocation();
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}&lang=ru`
      );
      if (!response.ok) {
        throw new Error("Не удалось получить данные о погоде");
      }
      const data = await response.json();
      const locationObj = createLocationObject(data, "geolocation", {
        source: position.source || "browser",
      });
      setWeather(data);
      setCurrentLocation(locationObj);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setCity("");
      setLoading(false);
    }
  };
  const handleSaveLocation = () => {
    if (!currentLocation) return;
    const updated = saveLocation(currentLocation);
    setSavedLocations(updated);
  };
  const handleRemoveLocation = (id) => {
    const updated = removeLocation(id);
    setSavedLocations(updated);
  };
  const handleLocationSelect = (location) => {
    if (location.sourceType === "search") {
      handleSearch(location);
    } else {
      setLoading(true);
      setError("");
      setWeather(null);
      fetchWeatherData(location)
        .then((data) => {
          console.log("DATA", data);
          setWeather(data);
          setCurrentLocation(location);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  };
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Погода</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (suggestionSelected) setSuggestionSelected(false);
              }}
              placeholder="Введите город..."
              className={styles.searchInput}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCity(suggestion.value);
                      handleSearch(suggestion);
                    }}
                    className={styles.suggestionItem}
                  >
                    {suggestion.value}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => handleSearch({ data: { value: city } })}
              className={styles.searchButton}
              disabled={loading || !city}
            >
              {loading ? "Загрузка..." : "Поиск"}
            </button>
            <button
              onClick={handleGeolocation}
              className={styles.geoButton}
              title="Определить мое местоположение"
            >
              <FaLocationDot />
            </button>
          </div>
          {weather &&
            currentLocation &&
            !savedLocations.some((loc) => loc.id === currentLocation.id) && (
              <button
                onClick={handleSaveLocation}
                className={styles.saveButton}
              >
                Сохранить местоположение
              </button>
            )}
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.content}>
          {weather && (
            <>
              <WeatherCard weather={weather} />
              <Map coord={weather.coord} cityName={weather.name} />
            </>
          )}
        </div>
        <SavedLocations
          locations={savedLocations}
          onSelect={handleLocationSelect}
          onRemove={handleRemoveLocation}
        />
      </main>
    </div>
  );
};

export default App;
