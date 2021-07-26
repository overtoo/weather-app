async function getWeatherData(location) {
  const api = "93ab259b7e65a888016a97094300a94a";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${api}`;
  const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    const responseForecast = await fetch(urlForecast, { mode: "cors" });
    const forecast = await responseForecast.json();
    const data = processWeather(json, forecast);
    return data;
  } catch (error) {
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    displayError(json.message);
  }
}

function displayError(msg) {
  info = document.querySelector("#info");
  info.classList = "error";
  info.textContent = "BEEP BOOP BAP ERROR: " + msg;
}

function clearError() {
  info = document.querySelector("#info");
  info.innerHTML = "";
  info.classList = "";
}

function processTomorrow(forecast) {
  forecastObj = {};
  // console.log(forecast.list);
  temperatures = [];

  for (let i = 0; i < 16; i++) {
    let pulledTime = forecast.list[i].dt_txt + " UTC";
    let conv = new Date(pulledTime);
    let today = new Date();
    tomorrowDate = today.getDate() + 1;
    if (conv.getDate() == tomorrowDate) {
      temperatures.push(forecast.list[i].main.temp);
      forecastObj[conv.getDate() + ":" + conv.getHours()] = convertKC(
        forecast.list[i].main.temp
      );
    }
  }
  return temperatures;
}

function processWeather(owmData, forecast) {
  const data = {};
  data.current_temp_C = convertKC(owmData.main.temp);
  data.feels_like_C = convertKC(owmData.main.feels_like);
  data.temp_max_C = Math.round(convertKC(owmData.main.temp_max));
  data.temp_min_C = Math.round(convertKC(owmData.main.temp_min));
  data.tomorrowMin = Math.round(
    convertKC(Math.min(...processTomorrow(forecast)))
  );
  data.tomorrowMax = Math.round(
    convertKC(Math.max(...processTomorrow(forecast)))
  );
  data.humidity = owmData.main.humidity;
  data.description = owmData.weather[0].description;

  return data;
}

function convertKC(kelvins) {
  const celsius = Math.round((kelvins - 273.15) * 10) / 10;
  return celsius;
}

function populateCityDropdown() {
  const cities = ["Taipei", "Taichung", "Kaohsiung", "Tainan", "Other"];
  select = document.querySelector("#form > #city");
  select.setAttribute("onchange", "loadPage()");
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

loadPage();

function manualCity() {
  hideData();
  hideHeader();
  input = document.getElementById("inputCity");
  input.classList.remove("inactive");
  activeCity = input.value;
  input.addEventListener("change", () => {
    activeCity = input.value;
    loadCity();
  });
}

function loadPage() {
  if (select.value == "Other") {
    manualCity();
  } else {
    activeCity = select.value;
    loadCity();
  }
}

function loadCity() {
  console.log("active city is " + activeCity);
  displayHeader(activeCity);
  displayWeather(activeCity);
}

function displayHeader(city) {
  citySpan = document.querySelector("#dynamic-city");
  citySpan.textContent = city;
}

function hideHeader() {
  citySpan = document.querySelector("#dynamic-city");
  citySpan.textContent = "";
}

async function displayWeather(city) {
  try {
    //clear error
    clearError();
    showData();
    const data = await getWeatherData(city);
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
    tomorrowMin = document.querySelector("#tomorrow-min");
    tomorrowMin.textContent = data.tomorrowMin;
    tomorrowMax = document.querySelector("#tomorrow-max");
    tomorrowMax.textContent = data.tomorrowMax;
  } catch (error) {
    console.log("is this?");
    //add error
    hideData();
  }
}

function hideData() {
  let displays = document.querySelectorAll(".live-data");
  displays.forEach((div) => {
    div.style.display = "none";
  });
}

function showData() {
  let displays = document.querySelectorAll(".live-data");
  displays.forEach((div) => {
    div.style.display = "block";
  });
}
