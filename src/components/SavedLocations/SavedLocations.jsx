import styles from "./SavedLocations.module.css";

const SavedLocations = ({ locations, onSelect, onRemove }) => {
  if (locations.length === 0) return null;
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Сохраненные местоположения</h3>
      <ul className={styles.list}>
        {locations.map((location) => (
          <li key={location.id} className={styles.item}>
            <span
              onClick={() => onSelect(location)}
              className={styles.locationName}
            >
              {location.data.city}
              {location.sourceType === "geolocation" && " (Геолокация)"}
            </span>
            <button
              onClick={() => onRemove(location.id)}
              className={styles.removeButton}
              title="Удалить"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedLocations;
