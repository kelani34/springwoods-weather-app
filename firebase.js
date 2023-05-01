// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmyJAEeWlMi0yQpjPMbyIrKP7x2zE1HM4",
  authDomain: "springwoods-labs.firebaseapp.com",
  projectId: "springwoods-labs",
  storageBucket: "springwoods-labs.appspot.com",
  messagingSenderId: "670187044632",
  appId: "1:670187044632:web:2094a51a58e33c54f6286d",
  measurementId: "G-EZYFRWXT7P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const searchInput = document.querySelector(".search");

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const searchQuery = searchInput.value;
    console.log(`User searched for: ${searchQuery}`);

    logEvent(analytics, "search", {
      search_term: searchQuery,
    });
  }
});

const tempUnitToggle = document.querySelector("#temp-unit-toggle");

tempUnitToggle.addEventListener("change", (event) => {
  const tempUnit = event.target.checked ? "fahrenheit" : "celsius";
  console.log(`User toggled temperature unit to ${tempUnit}`);

  logEvent(analytics, "temperature_unit_toggled", {
    unit: tempUnit,
  });
});



export function weatherDataAnalytics(data) {
  logEvent(analytics, "weather_data", {
    temperature: data.temperature,
    description: data.description,
    humidity: data.humidity,
    wind_speed: data.windSpeed,
  });
}
