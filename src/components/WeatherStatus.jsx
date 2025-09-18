import React, { useState } from 'react';
import { fetchWeatherData } from '../services/weatherServices';

const WeatherStatus = () => {
  const [latitude, setLatitude] = useState(14.9525);
  const [longitude, setLongitude] = useState(120.7669);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData({ latitude, longitude });
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Weather Data</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Latitude:
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            step="0.0001"
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
          Longitude:
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            step="0.0001"
          />
        </label>
        <button onClick={getWeather} disabled={loading} style={{ marginLeft: '1rem' }}>
          {loading ? 'Loading...' : 'Fetch Weather'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weatherData && (
        <div>
          <h2>Full Weather Data (JSON)</h2>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WeatherStatus;
