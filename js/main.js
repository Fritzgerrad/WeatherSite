const citySelect = document.getElementById("city-select");
root = document.getElementById('total-box');
const WeatherDesc = {
  'clear': "CLEAR",
  'cloudy': "CLOUDY",
  'fog': "FOGGY",
  'humid': "HUMID",
  'ishower': "ISOLATED SHOWERS",
  'lightrain': "LIGHT RAIN",
  'lightsnow': "LIGHT SNOW",
 'mcloudy': "CLOUDY",
  'oshower': "OCASSIONAL SHOWER",
  'pcloudy': "PARTLY CLOUDY",
  'rain': "RAIN",
  'rainsnow': "MIXED",
  'snow': "SNOW",
  'tsrain': "RAINSTORM",
  'tstorm': "THUNDERSTORM",
  'windy': "WINDY",
};

function populateCities(cityData) {
  cityData.forEach((city) => {
    if (city.name !== 'city'){
      const option = document.createElement("option");
      option.value = JSON.stringify({ long: city.lat, lat: city.long });
      option.textContent = `${city.name},${city.country}`;
      citySelect.appendChild(option);
    }
    
  });
}

fetch("./city_coordinates.csv")
  .then((response) => response.text())
  .then((csvData) => {
    const cityData = [];
    //console.log(cityData);
    const rows = csvData.split("\n");

    for (const row of rows) {
      const [lat, long, name, country] = row.split(",");
      cityData.push({ lat, long, name, country });
    }
    populateCities(cityData);
  });

citySelect.addEventListener("change", async () => {
  root.innerHTML = '';
  const weatherBox = document.createElement('div');
  weatherBox.setAttribute('id','weather-box');
  //weatherBox.innerHTML = "";

  const load = document.createElement("img");
  load.src = "/APIs Website/images/load.gif";
  load.setAttribute("id","load");

  weatherBox.appendChild(load);
  root.appendChild(weatherBox);

  console.log(JSON.parse(citySelect.value));
  const { long, lat } = JSON.parse(citySelect.value);
  let url = `https://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civillight&output=json`;
  console.log(1);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${reponse.status}`);
    }
    const data = await response.json();

    const dataseries = data.dataseries;
    console.log(dataseries);
    weatherBox.innerHTML = "";
    weatherBox.style.display = 'flex';
    weatherBox.style.flexWrap = 'wrap';
    dataseries.forEach((day) => {
      //console.log(datify(day.date));
      const currDate = datify(day.date);
      let weather = day.weather;
      const max = day.temp2m.max;
      const min = day.temp2m.min;

      if (weather === 'ts'){
        weather = 'tstorm';
      }

      const thisDay = document.createElement("div");
      const thisDayUpper = document.createElement("div");
      const thisDayLower = document.createElement("div");
      thisDayUpper.className = "upper-div";
      thisDayLower.className = "lower-div";
      thisDay.className = "this-days";
      const dateDisp = document.createElement("h2");
      dateDisp.textContent = currDate;
      const weatherImg = document.createElement("img");
      weatherImg.src = `./images/${weather}.png`;

      thisDayUpper.appendChild(dateDisp);
      thisDayUpper.appendChild(weatherImg);

      const weatherName = document.createElement("h3");
      const bounds = document.createElement("div");
      bounds.className = 'bounds';
      const maxName = document.createElement("h3");
      const minName = document.createElement("h3");
      weatherName.textContent = WeatherDesc[weather];
      maxName.textContent = `H :  ${max} °C`;
      minName.textContent = `L :  ${min} °C`;

      bounds.appendChild(maxName);
      bounds.appendChild(minName);

      thisDayLower.appendChild(weatherName);
      thisDayLower.appendChild(bounds);
      thisDayUpper.appendChild(thisDayLower);
      thisDay.appendChild(thisDayUpper);
      
      weatherBox.appendChild(thisDay);
      root.appendChild(weatherBox);
    });
  } catch (error) {
    console.error(error);
  }
});

const datify = (date) => {
  date = String(date);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = date.slice(0, 4);
  const month = parseInt(date.slice(4, 6)) - 1;
  const day = date.slice(6, 8);

  const dateObject = new Date(year, month, day);

  const dayOfWeekName = daysOfWeek[dateObject.getDay()];
  const monthName = months[dateObject.getMonth()];

  let thedate = "";

  if (parseInt(day) > 3) {
    thedate = parseInt(day) + "th";
  } else {
    switch (day) {
      case "01":
        thedate = "1st";

      case "02":
        thedate = "2nd";

      case "03":
        thedate = "3rd";
    }
  }

  return dayOfWeekName + " " + thedate + " " + monthName;
};
