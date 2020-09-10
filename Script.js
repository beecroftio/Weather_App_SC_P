//Current Time and Date
let currentDate = new Date();

let h2 = document.querySelector("h2");

let date = currentDate.getDate();
let time = currentDate.toLocaleTimeString([], {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
});
let year = currentDate.getFullYear();

let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
let day = days[currentDate.getDay()];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[currentDate.getMonth()];

h2.innerHTML = `<small>${day}, ${month} ${date} | ${year} | ${time} </small>`;

//Setting page parameters for API use
let city = "Cardiff";

let apiKey = "3e1b3b8411774a6a5d3ce0ee0f1a08dc";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
axios.get(apiURL).then(displayForecast);
let temperatureUnit = "celsius";

axios.get(apiUrl).then(getCityTemperature);
axios.get(apiURL).then(displayForecast);

//Setting time intervals for 6-day forecast
function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${hour}:${minute}`;
}

//Setting icons and max/min temperatures
function displayForecast(response) {
  let forecastElement = document.querySelector("#upcoming");
  forecastElement.innerHTML = null;
  let forecast = null;
  console.log(forecast);

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += ` <div class="col-2">
      ${formatHours(forecast.dt * 1000)}
      <br />
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png" />
      <br />
      <strong>${Math.round(forecast.main.temp_max)}°C</strong> | ${Math.round(
      forecast.main.temp_min
    )}°C
    </div>`;
  }
}

//Setting city name and current temperature
function searchedCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;

  let searchedCityPrint = document.querySelector("#city-name");
  searchedCityPrint.innerHTML = city;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(getCityTemperature);

  apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(displayForecast);
}

function getCityTemperature(response) {
  let temperaturePlace = document.querySelector("#temperature-place");
  let temperaturePrint = Math.round(response.data.main.temp);

  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let iconElement = document.querySelector("#current-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  temperaturePlace.innerHTML = `${temperaturePrint}`;
  temperatureUnit = "celsius";
}

let search = document.querySelector("#search-box");
search.addEventListener("submit", searchedCity);

//Celcius button
let c_temperature = document.querySelector("#c-button");
c_temperature.addEventListener("click", function () {
  if (temperatureUnit === "fahrenheit") {
    let temperaturePlace = document.querySelector("#temperature-place");
    //console.log(temperaturePlace.innerHTML);
    let temperaturePrint = Math.round(
      (5 / 9) * (temperaturePlace.innerHTML - 32)
    );
    temperaturePlace.innerHTML = `${temperaturePrint}`;
    temperatureUnit = "celsius";
  }
});

//Fahrenheit button
let f_temperature = document.querySelector("#f-button");
f_temperature.addEventListener("click", function () {
  if (temperatureUnit === "celsius") {
    let temperaturePlace = document.querySelector("#temperature-place");
    //console.log(temperaturePlace.innerHTML);
    let temperaturePrint = Math.round(
      (temperaturePlace.innerHTML * 9) / 5 + 32
    );
    temperaturePlace.innerHTML = `${temperaturePrint}`;
    temperatureUnit = "fahrenheit";
  }
});

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(useGPS);
}

//Current Location
function useGPS(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(getTemperature_usingPosition);
}

function getTemperature_usingPosition(response) {
  let temperaturePlace = document.querySelector("#temperature-place");
  let temperaturePrint = Math.round(response.data.main.temp);
  temperaturePlace.innerHTML = `${temperaturePrint}`;

  let searchedCityPrint = document.querySelector("#city-name");
  searchedCityPrint.innerHTML = response.data.name;
  temperatureUnit = "celsius";
}

let currentLocation_button = document.querySelector("#currentLocation");
currentLocation_button.addEventListener("click", getCurrentPosition);
