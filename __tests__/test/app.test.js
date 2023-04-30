import axios from "axios";
import {
  geolocation,
  showPosition,
  getWeatherData,
  displayCurrentWeather,
  displayForecastWeather,
  showSnackbar,
  hideSnackbar,
} from "./index";

jest.mock("axios");

describe("geolocation function works properly", () => {
  beforeEach(() => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn(),
    };
  });

  test("returns correct position data", async () => {
    const fakePosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };
    global.navigator.geolocation.getCurrentPosition.mockImplementationOnce(
      (success) => success(fakePosition)
    );
    const result = await geolocation();
    expect(result).toEqual(fakePosition.coords);
  });

  test("returns error message when getCurrentPosition fails", async () => {
    global.navigator.geolocation.getCurrentPosition.mockImplementationOnce(
      (_, error) => error("Error")
    );
    const result = await geolocation();
    expect(result).toEqual("Error");
  });
});

describe("showPosition extracts latitude and longitude correctly", () => {
  test("returns correct string", () => {
    const fakePosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };
    const result = showPosition(fakePosition);
    expect(result).toEqual(
      `Latitude: ${fakePosition.coords.latitude}, Longitude: ${fakePosition.coords.longitude}`
    );
  });
});

describe("getWeatherData calls OpenWeatherMap API and returns data", () => {
  test("returns correct data", async () => {
    const fakeData = {
      weather: [{ main: "Clear" }],
      main: { temp: 60 },
      name: "San Francisco",
    };
    axios.get.mockResolvedValue({ data: fakeData });
    const result = await getWeatherData(37.7749, -122.4194);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?lat=37.7749&lon=-122.4194&units=imperial&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`
    );
    expect(result).toEqual(fakeData);
  });
});

describe("displayCurrentWeather displays weather data on page", () => {
  test("displays correct data", () => {
    const fakeData = {
      weather: [{ main: "Clear" }],
      main: { temp: 60 },
      name: "San Francisco",
    };
    document.body.innerHTML = '<div id="current-weather"></div>';
    displayCurrentWeather(fakeData);
    const result = document.getElementById("current-weather").innerHTML;
    expect(result).toEqual(
      `<p>Location: ${fakeData.name}</p><p>Current Weather: ${fakeData.weather[0].main}</p><p>Current Temperature: ${fakeData.main.temp} &#8457;</p>`
    );
  });
});

describe("displayForecastWeather displays weather data on page", () => {
  test("displays correct data", () => {
    const fakeData = {
      list: [
        {
          dt_txt: "2023-05-01 03:00:00",
          weather: [{ main: "Clear" }],
          main: { temp: 60 },
          name: "San Francisco",
        },
        {
          dt_txt: "2023-05-01 06:00:00",
          weather: [{ main: "Clear" }],
          main: { temp: 62 },
          name: "San Francisco",
        },
      ],
    };
    document.body.innerHTML = '<div id="forecast-weather"></div>';
    displayForecastWeather(fakeData);
    const result = document.getElementById("forecast-weather").innerHTML;
    expect(result).toEqual(
      `<h2>5 Day Forecast</h2><div><p>Date: ${fakeData.list[0].dt_txt}</p><p>Weather: ${fakeData.list[0].weather[0].main}</p><p>Temperature: ${fakeData.list[0].main.temp} &#8457;</p></div><div><p>Date: ${fakeData.list[1].dt_txt}</p><p>Weather: ${fakeData.list[1].weather[0].main}</p><p>Temperature: ${fakeData.list[1].main.temp} &#8457;</p></div>`
    );
  });
});

describe("showSnackbar displays snackbar message", () => {
  test("displays correct message", () => {
    document.body.innerHTML = '<div id="snackbar"></div>';
    const message = "Snackbar message";
    showSnackbar(message);
    const snackbar = document.getElementById("snackbar");
    expect(snackbar.textContent).toEqual(message);
    expect(snackbar.classList.contains("show")).toBeTruthy();
  });
});

describe("hideSnackbar hides snackbar message", () => {
  test("hides snackbar", () => {
    document.body.innerHTML = '<div id="snackbar" class="show"></div>';
    hideSnackbar();
    const snackbar = document.getElementById("snackbar");
    expect(snackbar.classList.contains("show")).toBeFalsy();
  });
});
