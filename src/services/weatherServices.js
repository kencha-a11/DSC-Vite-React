// services/weatherApi.js

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchWeatherData = async ({ latitude, longitude, hourly = "temperature_2m", timezone = "auto" }) => {
  try {
    const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&hourly=${hourly}&timezone=${timezone}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
