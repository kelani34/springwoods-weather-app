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
function displayForecastWeather(data) {
  const forecastSection = document.querySelector(".forecast-section");
  forecastSection.innerHTML = "";

  const toggleElement = document.querySelector(".toggle input");

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleString("en-US", { weekday: "long" });
    const temperature = Math.round(forecast.main.temp);
    const highTemp = Math.round(forecast.main.temp_max);
    const lowTemp = Math.round(forecast.main.temp_min);

    // Convert temperature to Fahrenheit if toggle is on
    let temperatureString;
    let highTempString;
    let lowTempString;

    if (toggleElement.checked) {
      const fahrenheit = Math.round((temperature * 9) / 5 + 32);
      const highFahrenheit = Math.round((highTemp * 9) / 5 + 32);
      const lowFahrenheit = Math.round((lowTemp * 9) / 5 + 32);

      temperatureString = `${fahrenheit} °F`;
      highTempString = `${highFahrenheit}°F`;
      lowTempString = `${lowFahrenheit}°F`;
    } else {
      temperatureString = `${temperature} °C`;
      highTempString = `${highTemp}°C`;
      lowTempString = `${lowTemp}°C`;
    }

    const forecastCard = `
      <div class="card">
        <div class="forecast-degrees">
          <p>${temperatureString}</p>
          <span class="hi-lo">
            <p>H:${highTempString}</p>
            <p>L:${lowTempString}</p>
          </span>
        </div>
        <div>
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" width="150" height="100" />
        </div>
        <p class="forecast-day">${day}</p>
      </div>
    `;

    forecastSection.innerHTML += forecastCard;
  }
}
const toggleElement = document.querySelector(".toggle input");
toggleElement.addEventListener("change", () => {
  const currentWeatherData = JSON.parse(
    localStorage.getItem("currentWeatherData")
  );
  const forecastWeatherData = JSON.parse(
    localStorage.getItem("forecastWeatherData")
  );

  displayCurrentWeather(currentWeatherData);
  displayForecastWeather(forecastWeatherData);
});

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
