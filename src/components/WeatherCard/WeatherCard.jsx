import styles from './WeatherCard.module.css';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  const getWindDirection = (degrees) => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>
          {weather.name}
        </h2>
        <p className={styles.date}>
          {new Date(weather.dt * 1000).toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
      <div className={styles.mainInfo}>
        <div className={styles.temperature}>
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className={styles.weatherIcon}
          />
          <span>{Math.round(weather.main.temp)}°C</span>
        </div>
        <div className={styles.description}>
          {weather.weather[0].description}
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Ощущается как:</span>
          <span>{Math.round(weather.main.feels_like)}°C</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Влажность:</span>
          <span>{weather.main.humidity}%</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Давление:</span>
          <span>{Math.round(weather.main.pressure * 0.750062)} мм рт. ст.</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Ветер:</span>
          <span>
            {weather.wind.speed} м/с, {getWindDirection(weather.wind.deg)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Видимость:</span>
          <span>{weather.visibility / 1000} км</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;