const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const DADATA_API_KEY = process.env.REACT_APP_DADATA_API_KEY;

export const fetchWeatherData = async (city) => {
  const data = (query) =>
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${WEATHER_API_KEY}&lang=ru`
    );
  try {
    let query = `lat=${city?.data?.geo_lat}&lon=${city?.data?.geo_lon}`;
    let response = await data(query);
    if (!response.ok) {
      throw new Error("Город не найден");
    }
    return { ...(await response.json()), name: city.value };
  } catch (error) {
    console.error("Ошибка при получении данных о погоде:", error);
    throw error;
  }
};
export const fetchCitySuggestions = async (query) => {
  try {
    const response = await fetch(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${DADATA_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          count: 5,
          locations: [{ country: "*" }],
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Ошибка при получении подсказок");
    }
    const data = await response.json();
    return data.suggestions.map((suggestion) => suggestion);
  } catch (error) {
    console.error("Ошибка при получении подсказок городов:", error);
    return [];
  }
};
