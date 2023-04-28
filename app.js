let data;

let gradients = {
  morningGradient:
    'linear-gradient(to bottom, rgba(200,200,180,1) -100%, rgba(20,210,255,1) 100%)',
  dayGradient:
    'linear-gradient(to bottom, rgba(0,180,190,1) 0%, rgba(60,120,225,1) 100%)',
  eveningGradient:
    'linear-gradient(to bottom, rgba(0,92,170,1) 0%, rgba(0,34,126,1) 100%)',
  nightGradient:
    'linear-gradient(to bottom, rgba(5,0,40,1) 0%, rgba(0,9,40,1) 100%)',
};
let gradientsArr = Object.values(gradients);

let state = 0;
function transitionBodyBackground(gradient) {
  let body = document.querySelector('body');
  let overlay = document.querySelector('.bodyOverlayGradient');

  if (state === 0) {
    state = 1;
    overlay.style.backgroundImage = gradient;
    overlay.classList.add('transitioning');
  } else if (state === 1) {
    state = 0;
    body.style.backgroundImage = gradient;
    overlay.classList.remove('transitioning');
  }
}

let gradientInt;
function getGradientInt(data) {
  const localTimeString = data.location.localtime;
  const date = data.forecast.forecastday[0].date;
  const sunAndMoonTimes = [
    data.forecast.forecastday[0].astro.moonrise,
    data.forecast.forecastday[0].astro.moonset,
    data.forecast.forecastday[0].astro.sunrise,
    data.forecast.forecastday[0].astro.sunset,
  ];
  let [moonrise, moonset, sunrise, sunset] = sunAndMoonTimes;
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  };

  let endMorning = new Date(`${date} 10:00`);
  let startEvening = new Date(`${date} 16:00`);
  moonrise = new Date(`${date} ${moonrise}`);
  moonset = new Date(`${date} ${moonset}`);
  sunrise = new Date(`${date} ${sunrise}`);
  sunset = new Date(`${date} ${sunset}`);
  let localTime = new Date(localTimeString);

  if (localTime < sunrise && localTime >= moonset) {
    gradientInt = 1;
  } else if (localTime > sunrise && localTime < endMorning) {
    gradientInt = 2;
  } else if (localTime > endMorning && localTime < startEvening) {
    gradientInt = 3;
  } else if (localTime > startEvening && localTime < sunset) {
    gradientInt = 1;
  } else if (localTime > sunset && localTime < sunrise) {
    gradientInt = 0;
  } else if (localTime > startEvening || localTime < sunrise) {
    gradientInt = 4;
  } else {
    transitionBodyBackground(gradients.eveningGradient);
  }
}

function updateBackground(data) {
  getGradientInt(data);
  if (gradientInt === 1) {
    transitionBodyBackground(gradients.eveningGradient);
  } else if (gradientInt === 2) {
    transitionBodyBackground(gradients.morningGradient);
  } else if (gradientInt === 3) {
    transitionBodyBackground(gradients.dayGradient);
  } else if (gradientInt === 4) {
    transitionBodyBackground(gradients.nightGradient);
  }
}

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

const body = document.querySelector('body');
setInterval(function () {
  if (body.classList.contains('gradient1')) {
    body.classList.remove('gradient1');
    body.classList.add('gradient2');
  } else {
    body.classList.remove('gradient2');
    body.classList.add('gradient1');
  }
}, 5000);

const cityNameEl = document.getElementById('city-name');
const cityStateEl = document.getElementById('city-state');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const chanceOfRainEl = document.getElementById('chance-of-rain');
const currentWeekdayEl = document.getElementById('current-weekday');
const dateEl = document.getElementById('current-date');
const conditionEl = document.getElementById('condition-img');
const currentTempEl = document.getElementById('current-temp');

function checkIfUnitedStates(data) {
  let country = data.location.country;
  let state = data.location.region;

  if (country === 'United States of America') {
    cityStateEl.textContent = state;
  } else {
    cityStateEl.textContent = country;
  }
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getDaysOfWeek(data) {
  let daysData = data.forecast.forecastday;
  let weekdays = [];
  daysData.forEach((day) => {
    apiDate = day.date;
    let date = new Date(apiDate);
    let weekdayIndex = date.getDay();
    let weekday = days[weekdayIndex];
    weekdays.push(weekday);
  });
  return weekdays;
}

function assignDays(data) {
  let weekdays = getDaysOfWeek(data);
  const day0 = document.getElementById('day-0-name');
  const day1 = document.getElementById('day-1-name');
  const day2 = document.getElementById('day-2-name');
  const day3 = document.getElementById('day-3-name');
  const day4 = document.getElementById('day-4-name');
  const day5 = document.getElementById('day-5-name');
  const day6 = document.getElementById('day-6-name');

  day0.textContent = 'Today';
  day1.textContent = weekdays[1];
  day2.textContent = weekdays[2];
  day3.textContent = weekdays[3];
  day4.textContent = weekdays[4];
  day5.textContent = weekdays[5];
  day6.textContent = weekdays[6];
}

function formatDate(data) {
  let date = data.forecast.forecastday[0].date;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let d = new Date(date);
  let dayName = days[d.getDay() + 1];
  let monthName = months[d.getMonth()];
  let fullYear = d.getFullYear();
  let day = d.getDate() + 1;

  currentWeekdayEl.textContent = dayName;
  dateEl.textContent = ` ${day} ${monthName} ${fullYear}`;
}

function updateUIImperial(data) {
  windSpeedEl.textContent = data.current.wind_mph + 'mph';
  feelsLikeEl.textContent = data.current.feelslike_f + 'F°';
  currentTempEl.textContent = data.current.temp_f + 'F°';
}

function updateUIMetric(data) {
  windSpeedEl.textContent = data.current.wind_kph + 'km/h';
  feelsLikeEl.textContent = data.current.feelslike_c + 'C°';
  currentTempEl.textContent = data.current.temp_c + 'C°';
}

function updateUI(data) {
  cityNameEl.textContent = data.location.name;
  humidityEl.textContent = data.current.humidity;
  chanceOfRainEl.textContent =
    data.forecast.forecastday[0].day.daily_chance_of_rain;
  conditionEl.src = data.current.condition.icon;

  checkIfUnitedStates(data);
  if (imperial === true) {
    updateUIImperial(data);
  } else {
    updateUIMetric(data);
  }

  assignDays(data);
  updateBackground(data);
  formatDate(data);
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

const inboxField = document.getElementById('city');

inboxField.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getCity();
  }
});

initalizeApp();
