// get user current location

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherData(lat, lon);
}

getLocation();

async function getWeatherData(lat, lon) {
  const API_KEY = "8ff2d6e561e8c713a4eddb92e542e175";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastWeatherResponse = await fetch(forecastWeatherUrl);
    const forecastWeatherData = await forecastWeatherResponse.json();

    localStorage.setItem(
      "currentWeatherData",
      JSON.stringify(currentWeatherData)
    );
    localStorage.setItem(
      "forecastWeatherData",
      JSON.stringify(forecastWeatherData)
    );

    displayCurrentWeather(currentWeatherData);
    displayForecastWeather(forecastWeatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
