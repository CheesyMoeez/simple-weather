// CheesyMoeez

const weather = document.getElementsByClassName("weather")[0];
const weatherCityForm = document.querySelector(".weather-city-form");
const cityInput = document.querySelector(".city-input");
const card = document.querySelector(".weather-details-card");

// Insert your Openweathermap API key here
const apiKey = "";

// Press the enter key to search
cityInput.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("submitButton").click();
  }
});

// When clicking anywhere on the card, focus on the form input
function focusOnInput() {
  cityInput.focus();
}

// Get and validate the city
weatherCityForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  const coordinates = await getCoordinates(city);

  const lat = coordinates[0];
  const lon = coordinates[1];

  if (city) {
    try {
      const weatherData = await getWeatherData(lat, lon);
      displayWeatherData(weatherData);
    } catch (error) {
      console.log(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city!");
  }
});

// Get the weather data
async function getWeatherData(lat, lon) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(apiURL);

  if (!response.ok) {
    throw new Error("Could not fetch weather data!");
  }

  return await response.json();
}

// Display the weather data
function displayWeatherData(data) {
  const hideCard = document.getElementById("hideCard");
  hideCard.style.display = "inline";

  const {
    name: city,
    main: { temp: temperature, humidity },
    weather: [{ id, description }],
  } = data;

  temperatureInCelsius = Math.round(temperature - 273.15);

  document.getElementsByClassName("name")[0].innerHTML = city;
  document.getElementsByClassName("temperature")[0].innerHTML =
    `${temperatureInCelsius}°C`;
  document.getElementsByClassName("humidity")[0].innerHTML =
    `Humidity: ${humidity}%`;
  document.getElementsByClassName("description")[0].innerHTML = description;
  document.getElementsByClassName("emoji")[0].innerHTML = getWeatherEmoji(id);
}

// Get the appropriate weather emoji based on the id provided
function getWeatherEmoji(weatherId) {
  let emoji;

  if (weatherId >= 200 && weatherId <= 299) {
    emoji = "⛈️";
  } else if (weatherId >= 300 && weatherId <= 399) {
    emoji = "☔";
  } else if (weatherId >= 500 && weatherId <= 599) {
    emoji = "🌧️";
  } else if (weatherId >= 600 && weatherId <= 699) {
    emoji = "🌨️";
  } else if (weatherId >= 700 && weatherId <= 799) {
    emoji = "🌫️";
  } else if (weatherId === 800) {
    emoji = "☀️";
  } else if (weatherId >= 801 && weatherId <= 899) {
    emoji = "☁️";
  } else {
    emoji = "❌";
  }

  return emoji;
}

// Display error with a message
function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.style.color = "red";
  errorDisplay.textContent = message;

  card.style.display = "flex";
  card.appendChild(errorDisplay);
}

// Get the coordinates of the city (API call)
async function getCoordinates(city) {
  try {
    const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiURL);

    const data = await response.json();

    const [{ lat, lon }] = data;

    const coordinates = [lat, lon];

    return coordinates;
  } catch (error) {
    displayError("Enter a valid city name!");
  }
}
