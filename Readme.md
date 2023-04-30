
# Weather App

Welcome to my weather app! This is a web application that displays current and forecast weather data for the user's current location. The app uses the OpenWeatherMap API to get weather data. The app has been created as part of the frontend test for Spring Wood Labs.

## Folder Structure
 ```
    |-- Readme.md
    |-- index.html
    |-- package.json
    |-- assets
    |   |-- ...
    |-- index.js
    |-- styles.css

 ```

 ## Installation
 To install and run the app, please follow the steps below:

    1. Clone the repository.

    2. Run npm install to install the dependencies.

    3. Run npm start to start the development server.

    4. Open http://127.0.0.1:8080 in your web browser.

## Features
The app has the following features:

    1. Displays the user's current location and the current weather conditions.
    2. Displays the weather forecast for the next 5 days.
    3. Allows the user to search for weather data for any city in the world.
    4. Allows the user to toggle between Celsius and Fahrenheit.

## Usage
When the app loads, it checks if the user's browser supports geolocation. If it does, it uses the navigator.geolocation.getCurrentPosition() method to get the user's current position, and then calls the getWeatherData() function to fetch the weather data from the OpenWeatherMap API. If geolocation is not supported, the app displays an error message.

Once the weather data has been fetched, the app displays the current weather conditions for the user's location, as well as the weather forecast for the next 5 days. The user can search for weather data for any city in the world by entering the city name in the search box and pressing enter.

The app allows the user to toggle between Celsius and Fahrenheit by clicking on the "C/F" button.

## Dependencies
The app uses the following dependencies:

    http-server - for running the development server.

## Credits

The app uses the [OpenWeatherMap API](https://openweathermap.org/api) to get weather data. 

The font used in the app is [Poppins](https://fonts.google.com/specimen/Poppins), which is available on Google Fonts.