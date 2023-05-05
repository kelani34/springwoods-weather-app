// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getAnalytics,
  logEvent,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import WebSocket from "ws";
import { MongoClient } from "mongodb";

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

const mongoDBUrl =
  "mongodb+srv://admin:admin@cluster0.wgagg89.mongodb.net/test";

const searchInput = document.querySelector(".search");
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const searchQuery = searchInput.value;
    logEvent(analytics, "search", {
      search_term: searchQuery,
    });
  }
});

const tempUnitToggle = document.querySelector("#temp-unit-toggle");

tempUnitToggle.addEventListener("change", (event) => {
  const tempUnit = event.target.checked ? "fahrenheit" : "celsius";

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

MongoClient.connect(mongoDBUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }

  console.log("Connected to MongoDB");
  const db = client.db("test");
  const eventsCollection = db.collection("events");

  // Connect to the WebSocket server
  const socket = new WebSocket("ws://sample.com/logMessages");

  // Listen for events on WebSocket connection
  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "weatherData") {
      // Store the event in MongoDB
      eventsCollection.insertOne(
        {
          temperature: data.temperature,
          description: data.description,
          humidity: data.humidity,
          wind_speed: data.windSpeed,
        },
        (err, result) => {
          if (err) {
            console.error("Error inserting event into MongoDB:", err);
          } else {
            console.log("Event inserted into MongoDB:", result.ops[0]);
          }
        }
      );

      // Log the event to Firebase
      logEvent(analytics, "weather_data", {
        temperature: data.temperature,
        description: data.description,
        humidity: data.humidity,
        wind_speed: data.windSpeed,
      });
    }
  });
});
