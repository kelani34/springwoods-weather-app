// checks if the user's browser supports geolocation, and calls showPosition if it does
function getLocation() {
  if (navigator.geolocation) {
    // checks if geolocation is supported
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser."); // shows an alert message if geolocation is not supported
  }
}

// takes a position parameter, extracts the latitude and longitude, and calls getWeatherData() with these coordinates
function showPosition(position) {
  // gets latitude and latitude from the position object
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherData(lat, lon);
}

// takes a message parameter, gets the snackbar element, sets its innerHTML to the message, adds the "show" class, and removes it after 3 seconds
function showSnackbar(message) {
  let snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = message;
  snackbar.classList.add("show");
  setTimeout(function () {
    snackbar.classList.remove("show");
  }, 3000);
}

// shows the loader by setting the display property of the loader-wrapper element to "block"
function showLoader() {
  document.querySelector(".loader-wrapper").style.display = "block";
}

// hides the loader by removing the loader-wrapper element
function hideLoader() {
  document.querySelector(".loader-wrapper").remove();
}

getLocation();

// get weather data from OpenWeatherMap API using the latitude and longitude coordinates
async function getWeatherData(lat, lon) {
  showLoader(); // display the loader while the API call is in progress

  const API_KEY = "8ff2d6e561e8c713a4eddb92e542e175"; // This is the API key for OpenWeatherMap
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    // Make API calls to get current weather and forecast data
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastWeatherResponse = await fetch(forecastWeatherUrl); // Call the OpenWeatherMap API to get forecast weather data
    const forecastWeatherData = await forecastWeatherResponse.json(); // Parse the response into JSON

    // Store the weather data in local storage
    localStorage.setItem(
      "currentWeatherData",
      JSON.stringify(currentWeatherData)
    );
    localStorage.setItem(
      "forecastWeatherData",
      JSON.stringify(forecastWeatherData)
    );

    // Display the weather data on the page
    displayCurrentWeather(currentWeatherData);
    displayForecastWeather(forecastWeatherData);
  } catch (error) {
    // Show a snackbar with an error message if the API call fails
    showSnackbar(`Error fetching weather data: ${error}`);
  } finally {
    hideLoader(); // Remove the loader
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
  //   document.querySelector(".search").value = cityName;
}

// takes weather forecast data as parameter and displays it on the page
function displayForecastWeather(data) {
  const forecastSection = document.querySelector(".forecast-section");
  forecastSection.innerHTML = ""; // clears the previous forecast section

  const toggleElement = document.querySelector(".toggle input");

  // Loops through the weather forecast data, showing only one forecast per day (every 8th entry)
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleString("en-US", { weekday: "long" });
    const temperature = Math.round(forecast.main.temp);
    const highTemp = Math.round(forecast.main.temp_max);
    const lowTemp = Math.round(forecast.main.temp_min);
    const desc = forecast.weather[0].description;

    // Convert temperature to Fahrenheit if toggle is on, otherwise display in Celsius
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

    // Creates HTML for each forecast card
    const forecastCard = `
      <div class="card">
        <div class="forecast-degrees">
          <p>${temperatureString}</p>
          <span class="forecast-hi-lo">
            <p>H:${highTempString}</p>
            <p>L:${lowTempString}</p>
          </span>
        </div>
        <div class="forecast-icon">
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" width="150" height="100" />
          <p class="forecast-description">${desc}</p>
        </div>
        <p class="forecast-day">${day}</p>
      </div>
    `;

    forecastSection.innerHTML += forecastCard;
  }
}

// checks for changes to the toggle element and displays weather data for the user's current location or a searched city
const toggleElement = document.querySelector(".toggle input");
toggleElement.addEventListener("change", () => {
  // gets the current weather data from local storage
  const currentWeatherData = JSON.parse(
    localStorage.getItem("currentWeatherData")
  );
  const forecastWeatherData = JSON.parse(
    localStorage.getItem("forecastWeatherData")
  );

  displayCurrentWeather(currentWeatherData);
  displayForecastWeather(forecastWeatherData);
});

// listens for a keypress event on the search input and triggers a function if the "Enter" key is pressed
const searchInput = document.querySelector(".search"); // gets the search input
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchWeather(searchInput.value);
  }
});

// searches for weather data for a specified city using the OpenWeatherMap API
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
    // Show a snackbar with an error message if the API call fails
    showSnackbar(`Error fetching weather data: ${error}`);
  }
}
