// CheesyMoeez

const weather = document.getElementsByClassName("weather")[0];
const weatherCityForm = document.querySelector(".weather-city-form");
const cityInput = document.querySelector(".city-input");
const card = document.querySelector(".weather-details-card");
const hideCard = document.querySelector("#hideCard");

const themePicker = document.querySelector("#themePicker");

// Insert your Openweathermap API key here
const apiKey = "";

// Press the enter key to search
cityInput.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("submitButton").click();
    hideCard.style.display = "none";
  }
});

const loader = document.querySelector("#loading");

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
      console.log(weatherData);
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

  cityInput.value = "";

  const hideCard = document.getElementById("hideCard");
  hideCard.style.display = "inline";

  const {
    name: city,
    sys: {country},
    main: { temp: temperature, humidity },
    weather: [{ id, description }],
  } = data;

  console.log(country);

  const flagEmoji = getFlagEmoji(country);

  console.log(flagEmoji);

  temperatureInCelsius = Math.round(temperature - 273.15);

  document.getElementsByClassName("name")[0].innerHTML = city + " " + flagEmoji;
  document.getElementsByClassName("name")[0].setAttribute("title", country);

  document.getElementsByClassName("temperature")[0].innerHTML =
    `${temperatureInCelsius}°C`;
  document.getElementsByClassName("humidity")[0].innerHTML =
    `Humidity: ${humidity}%`;
  document.getElementsByClassName("description")[0].innerHTML =
    description.charAt(0).toUpperCase() + description.slice(1);
  document.getElementsByClassName("emoji")[0].innerHTML = getWeatherEmoji(id);
}

// Get the flag of the country using the country code provided by the weather API
// Code from: https://dev.to/jorik/country-code-to-flag-emoji-a21
function getFlagEmoji(countryCode) {
  const codePoints = countryCode
  .toUpperCase()
  .split("")
  .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
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
