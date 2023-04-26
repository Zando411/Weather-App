let data;

function getCity() {
  let input = document.getElementById('city');
  let city = input.value;
  let cityName = city;
  updateAPI(cityName);
  input.value = '';
}

function updateUI(data) {
  const cityNameEl = document.getElementById('city-name');
  const tempCEl = document.getElementById('temp-c');
  const conditionIconEl = document.getElementById('condition-icon');
  const conditionTextEl = document.getElementById('condition-text');
  const humidityEl = document.getElementById('humidity');
  const windSpeedEl = document.getElementById('wind-speed');

  cityNameEl.textContent = data.location.name;
  tempCEl.textContent = data.current.temp_c;
  conditionTextEl.textContent = data.current.condition.text;
  humidityEl.textContent = data.current.humidity;
  windSpeedEl.textContent = data.current.wind_kph;
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
    updateUI(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

updateAPI('London');
