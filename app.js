let data;

function getCity() {
  let input = document.getElementById('city');
  let city = input.value;
  let cityName = city;
  updateAPI(cityName);
  input.value = '';
}

let imperial = true;

function unitDisplay() {
  const impSpan = document.getElementById('degreesF');
  const metSpan = document.getElementById('degreesC');
  if (imperial === true) {
    metSpan.style.opacity = '50%';
    impSpan.style.opacity = '100%';
  } else {
    impSpan.style.opacity = '50%';
    metSpan.style.opacity = '100%';
  }
}

const cityNameEl = document.getElementById('city-name');
const cityStateEl = document.getElementById('city-state');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const dateEl = document.getElementById('current-date');
const feelsLikeEl = document.getElementById('feels-like');
const chanceOfRainEl = document.getElementById('chance-of-rain');

function checkIfUnitedStates(data) {
  let country = data.location.country;
  let state = data.location.region;

  if (country === 'United States of America') {
    cityStateEl.textContent = state;
  } else {
    cityStateEl.textContent = country;
  }
}

function updateUIImperial(data) {
  windSpeedEl.textContent = data.current.wind_mph + 'mph';
  feelsLikeEl.textContent = data.current.feelslike_f + 'F°';
}

function updateUIMetric(data) {
  windSpeedEl.textContent = data.current.wind_kph + 'km/h';
  feelsLikeEl.textContent = data.current.feelslike_c + 'C°';
}

function updateUI(data) {
  cityNameEl.textContent = data.location.name;
  humidityEl.textContent = data.current.humidity;
  chanceOfRainEl.textContent =
    data.forecast.forecastday[0].day.daily_chance_of_rain;

  checkIfUnitedStates(data);
  if (imperial === true) {
    updateUIImperial(data);
  } else {
    updateUIMetric(data);
  }
}

function changeUnits() {
  if (imperial === true) {
    imperial = false;
    unitDisplay();
    updateUI(data);
  } else {
    imperial = true;
    unitDisplay();
    updateUI(data);
  }
}

async function updateAPI(cityName) {
  try {
    const res = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=2536bf33c77742c1a5430859232604&q=${cityName}&days=7&aqi=no&alerts=no`
    );
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const APIData = await res.json();

    data = APIData;

    console.log(data);
    newTime(data);
    updateUI(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

let localTime = null;

function newTime() {
  const currentTimeElement = document.getElementById('current-time');
  const localTimeString = data.location.localtime;
  localTime = new Date(localTimeString);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const formattedTime = localTime.toLocaleString('en-US', options);
  currentTimeElement.textContent = formattedTime;
}

function updateTime() {
  const currentTimeElement = document.getElementById('current-time');
  localTime.setMinutes(localTime.getMinutes() + 1);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const formattedTime = localTime.toLocaleString('en-US', options);
  currentTimeElement.textContent = formattedTime;
}

let intervalId = setInterval(() => {
  const now = new Date();
  if (now.getSeconds() === 0) {
    updateTime();
  }
}, 1000);

function initalizeApp() {
  unitDisplay();
  updateAPI('London');
}

initalizeApp();
