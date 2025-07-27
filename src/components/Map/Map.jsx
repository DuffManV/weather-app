import { useEffect, useRef } from "react";
import styles from "./Map.module.css";

const YANDEX_MAPS_API_KEY = process.env.REACT_APP_YANDEX_MAPS_API_KEY;

const Map = ({ coord, cityName }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const placemarkRef = useRef(null);
  useEffect(() => {
    if (!coord) return;
    const initMap = () => {
      const { lat, lon } = coord;
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: [lat, lon],
        zoom: 10,
        controls: ["zoomControl"],
      });
      placemarkRef.current = new window.ymaps.Placemark(
        [lat, lon],
        {
          hintContent: cityName,
          balloonContent: cityName,
        },
        {
          preset: "islands#blueDotIcon",
        }
      );
      mapInstance.current.geoObjects.add(placemarkRef.current);
    };
    if (window.ymaps) {
      initMap();
    } else {
      const existingScript = document.querySelector(
        'script[src*="api-maps.yandex.ru"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
          window.ymaps.ready(initMap);
        };
        document.body.appendChild(script);
      } else {
        if (!window.ymaps) {
          const checkYMaps = setInterval(() => {
            if (window.ymaps) {
              clearInterval(checkYMaps);
              window.ymaps.ready(initMap);
            }
          }, 100);
        }
      }
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [coord, cityName]);
  return <div ref={mapRef} className={styles.mapContainer} />;
};

export default Map;
