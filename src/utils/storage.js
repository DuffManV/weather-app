export const getSavedLocations = () => {
  const saved = localStorage.getItem('savedLocations');
  return saved ? JSON.parse(saved) : [];
};

export const saveLocation = (location) => {
  const saved = getSavedLocations();
  const exists = saved.some(loc => 
    loc.id === location.id
  );
  if (!exists) {
    const updated = [...saved, location];
    localStorage.setItem('savedLocations', JSON.stringify(updated));
    return updated;
  }
  return saved;
};

export const removeLocation = (id) => {
  const saved = getSavedLocations();
  const updated = saved.filter(loc => loc.id !== id);
  localStorage.setItem('savedLocations', JSON.stringify(updated));
  return updated;
};