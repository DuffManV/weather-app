export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      getLocationByIP()
        .then(resolve)
        .catch(reject);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        async (error) => {
          try {
            const location = await getLocationByIP();
            resolve(location);
          } catch (ipError) {
            reject(new Error('Не удалось определить местоположение'));
          }
        }
      );
    }
  });
};

export const getLocationByIP = async () => {
  try {
    const response = await fetch('http://ip-api.com/json/?lang=ru&fields=lat,lon');
    if (!response.ok) {
      throw new Error('Ошибка определения местоположения по IP');
    }
    const data = await response.json();
    if (data.lat && data.lon) {
      return {
        lat: data.lat,
        lon: data.lon
      };
    } else {
      throw new Error('Не удалось получить координаты по IP');
    }
  } catch (error) {
    console.error('Ошибка при определении местоположения по IP:', error);
    throw error;
  }
};