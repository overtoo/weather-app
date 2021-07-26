async function getWeatherData(location) {
  const api = "93ab259b7e65a888016a97094300a94a";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${api}`;
  const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    // console.log(json);
    const responseForecast = await fetch(urlForecast, { mode: "cors" });
    const forecast = await responseForecast.json();
    const data = processWeather(json, forecast);
    return data;
  } catch (error) {
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    // console.log(json);
    displayError(json.message);
  }
}

function displayError(msg) {
  info = document.querySelector("#info");
  para = document.createElement("p");
  info.classList = "error";
  info.textContent = "BEEP BOOP BAP ERROR: " + msg;
}

function clearError() {
  info = document.querySelector("#info");
  info.innerHTML = "";
  info.classList = "";
}

function processWeather(owmData, forecast) {
  const data = {};
  data.current_temp_C = convertKC(owmData.main.temp);
  data.feels_like_C = convertKC(owmData.main.feels_like);
  data.temp_max_C = convertKC(owmData.main.temp_max);
  data.temp_min_C = convertKC(owmData.main.temp_min);
  data.humidity = owmData.main.humidity;
  data.description = owmData.weather[0].description;
  data.mainIgnore = owmData.weather[0].main; //ignore this

  forecastObj = {};
  console.log(forecast.list);

  for (let i = 0; i < 20; i++) {
    console.log(convertKC(forecast.list[i].main.temp));
    let pulledTime = forecast.list[i].dt_txt + " UTC";
    // console.log(pulledTime);
    let conv = new Date(pulledTime);
    // console.log(conv.toString());
    // console.log(conv.getHours());
    forecastObj[conv.getDay() + " + " + conv.getHours()] = convertKC(
      forecast.list[i].main.temp
    );
    let today = new Date();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // console.log(today);
    // break;
  }
  console.table(forecastObj);

  return data;
}

function convertKC(kelvins) {
  const celsius = Math.round((kelvins - 273.15) * 10) / 10;
  return celsius;
}

function populateCityDropdown() {
  const cities = [
    "Taipei",
    "Shanghai",
    "Beijing",
    "Taichung",
    "Hsinchu",
    "Hualian",
    "Other",
  ];
  select = document.querySelector("#form > #city");
  select.setAttribute("onchange", "loadCity()");
  for (let i = 0; i < cities.length; i++) {
    let city = cities[i];
    let option = document.createElement("option");
    option.setAttribute("value", city);
    option.textContent = city;
    select.appendChild(option);
  }

  //   activeCity = select.value;
}

populateCityDropdown();

loadCity();

function loadCity() {
  const activeCity = select.value;
  displayCity(activeCity);
  displayWeather(activeCity);
}

function displayCity(city) {
  citySpan = document.querySelector("#dynamic-city");
  citySpan.textContent = city;
}

async function displayWeather(city) {
  try {
    //clear error
    clearError();
    const data = await getWeatherData(city);
    console.log(data);
    currentTemp = document.querySelector("#dynamic-temperature");
    currentTemp.textContent = data.current_temp_C;
    currentFeelsLike = document.querySelector("#dynamic-feels-like");
    currentFeelsLike.textContent = data.feels_like_C;
    currentHumidity = document.querySelector("#dynamic-humidity");
    currentHumidity.textContent = data.humidity;
    tempMin = document.querySelector("#today-min");
    tempMin.textContent = data.temp_min_C;
    tempMax = document.querySelector("#today-max");
    tempMax.textContent = data.temp_max_C;
    description = document.querySelector("#today-description");
    description.textContent = data.description;
  } catch (error) {
    //add error
    clearData();
  }
}

function clearData() {
  displays = document.querySelectorAll(".current-visible");
  displays.forEach((div) => {
    div.style.display = "none";
  });
}
