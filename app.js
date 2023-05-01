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

let isDay;
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

  if (gradientInt === 4) {
    isDay = false;
  } else {
    isDay = true;
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

function getDaysOfWeekTemp(data) {
  let tempData = data.forecast.forecastday;
  let maxTemps = [];
  let minTemps = [];
  let tempCodes = [];
  let tempTexts = [];
  tempData.forEach((temp) => {
    let apiMaxTemp;
    let apiMinTemp;
    let apiCodes;
    let tempText;

    if (imperial === true) {
      apiMaxTemp = Math.ceil(temp.day.maxtemp_f) + 'F°';
      apiMinTemp = Math.ceil(temp.day.mintemp_f) + 'F°';
    } else {
      apiMaxTemp = Math.ceil(temp.day.maxtemp_c) + 'C°';
      apiMinTemp = Math.ceil(temp.day.mintemp_c) + 'C°';
    }
    apiCodes = temp.day.condition.code;
    tempText = temp.day.condition.text;

    maxTemps.push(apiMaxTemp);
    minTemps.push(apiMinTemp);
    tempCodes.push(apiCodes);
    tempTexts.push(tempText);
  });
  // console.log(maxTemps, minTemps, tempCodes);
  return { maxTemps, minTemps, tempCodes, tempTexts };
}

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

function assignWeekdays(data) {
  let weekdays = getDaysOfWeek(data);
  const dayElements = document.querySelectorAll('.day-name');

  dayElements.forEach((day, index) => {
    if (index === 0) {
      day.textContent = 'Today';
    } else {
      day.textContent = weekdays[index];
    }
  });
}

function getIcon(code) {
  let iconPath;
  switch (code) {
    case 1000:
      iconPath = isDay ? 'day/sunny.svg' : 'night/clear_night.svg';
      break;
    case 1003:
      iconPath = isDay
        ? 'day/partly_cloudy.svg'
        : 'night/night_partly_cloudy.svg';
      break;
    case 1006:
    case 1009:
      iconPath = 'day/cloudy.svg';
      break;
    case 1030:
      iconPath = 'day/mist.svg';
      break;
    case 1063:
    case 1150:
    case 1153:
    case 1180:
    case 1183:
    case 1186:
    case 1189:
    case 1192:
    case 1195:
    case 1240:
    case 1243:
    case 1246:
      iconPath = 'day/raining.svg';
      break;
    case 1066:
    case 1069:
    case 1072:
    case 1114:
    case 1117:
    case 1168:
    case 1171:
    case 1198:
    case 1201:
    case 1204:
    case 1207:
    case 1210:
    case 1213:
    case 1216:
    case 1219:
    case 1222:
    case 1225:
    case 1237:
    case 1249:
    case 1252:
    case 1255:
    case 1258:
    case 1261:
    case 1264:
      iconPath = 'day/snowing.svg';
      break;
    case 1087:
    case 1273:
    case 1276:
    case 1279:
    case 1282:
      iconPath = 'day/thunder.svg';
      break;
    case 1135:
    case 1147:
      iconPath = 'day/fog.svg';
      break;
    default:
      // Return a default icon path in case the code value is not recognized
      iconPath = 'day/sunny.svg';
      break;
  }

  return iconPath;
}

function clearCards() {
  const cardsContainer = document.getElementById('week-forecast');
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
}

function assignTemps(data) {
  clearCards();
  const { maxTemps, minTemps, tempCodes, tempTexts } = getDaysOfWeekTemp(data);
  const weekdays = getDaysOfWeek(data);

  const cardTemplate = document.getElementById('card-template');

  for (let i = 0; i < weekdays.length; i++) {
    const card = cardTemplate.content.cloneNode(true);
    const dayNameElement = card.querySelector('.day-name');
    const imageElement = card.querySelector('.day-image');
    const maxTempElement = card.querySelector('.day-maxtemp');
    const minTempElement = card.querySelector('.day-mintemp');

    if (i === 0) {
      dayNameElement.textContent = 'Today';
    } else {
      dayNameElement.textContent = weekdays[i];
    }

    imageElement.src = getIcon(tempCodes[i]);
    imageElement.alt = tempTexts[i];

    maxTempElement.textContent = maxTemps[i];
    minTempElement.textContent = minTemps[i];

    document.getElementById('week-forecast').appendChild(card);
  }
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
  feelsLikeEl.textContent = Math.ceil(data.current.feelslike_f) + 'F°';
  currentTempEl.textContent = Math.ceil(data.current.temp_f) + 'F°';
}

function updateUIMetric(data) {
  windSpeedEl.textContent = data.current.wind_kph + 'km/h';
  feelsLikeEl.textContent = Math.ceil(data.current.feelslike_c) + 'C°';
  currentTempEl.textContent = Math.ceil(data.current.temp_c) + 'C°';
}

function updateUI(data) {
  cityNameEl.textContent = data.location.name;
  humidityEl.textContent = data.current.humidity;
  chanceOfRainEl.textContent =
    data.forecast.forecastday[0].day.daily_chance_of_rain;
  // conditionEl.src = data.current.condition.icon;

  checkIfUnitedStates(data);
  if (imperial === true) {
    updateUIImperial(data);
  } else {
    updateUIMetric(data);
  }

  assignTemps(data);
  assignWeekdays(data);
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
