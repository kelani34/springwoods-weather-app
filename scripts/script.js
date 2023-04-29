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

function displayCurrentWeather(data) {
  const cityName = data.name;
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  document.querySelector("h1").textContent = `Weather in ${cityName}`;
  document.querySelector(".weather-description p").textContent = description;
  document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
  document.querySelector(
    ".windspeed"
  ).textContent = `Wind Speed: ${windSpeed} km/hr`;

  const degreesElement = document.querySelector(".degrees p");
  const toggleElement = document.querySelector(".toggle input");

  // Convert temperature to Fahrenheit if toggle is on
  if (toggleElement.checked) {
    const fahrenheit = Math.round((temperature * 9) / 5 + 32);
    degreesElement.textContent = `${fahrenheit} °F`;
  } else {
    degreesElement.textContent = `${temperature} °C`;
  }

  // Update search input value with current city name
  document.querySelector(".search").value = cityName;
}
const searchInput = document.querySelector(".search");
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchWeather(searchInput.value);
  }
});

async function searchWeather(city) {
  const API_KEY = "8ff2d6e561e8c713a4eddb92e542e175";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastWeatherResponse = await fetch(forecastWeatherUrl);
    const forecastWeatherData = await forecastWeatherResponse.json();

    displayCurrentWeather(currentWeatherData);
    displayForecastWeather(forecastWeatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
