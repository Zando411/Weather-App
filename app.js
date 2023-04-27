let data;

let imperial = true;

function getCity() {
  let input = document.getElementById('city');
  let city = input.value;
  let cityName = city;
  updateAPI(cityName);
  input.value = '';
}

const cityNameEl = document.getElementById('city-name');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

function updateUIImperial(data) {}

function updateUIMetric(data) {
  cityNameEl.textContent = data.location.name;
  humidityEl.textContent = data.current.humidity;
  windSpeedEl.textContent = data.current.wind_kph;
}

function updateUI(data) {
  if (imperial === true) {
    updateUIImperial(data);
  } else {
    updateUIMetric(data);
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

updateAPI('London');
