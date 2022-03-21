var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var currentWeatherEl = document.querySelector("#currentWeather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var recentCitiesEl = document.querySelector("#recentCities");
var fiveDayForecastEl = document.getElementById("fiveDayForecast");
var box1El = document.getElementById("box1");
var lat = "";
var lon = "";

//function to call API for city coordinates
var getCityCoords = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=34d23521a96f3e289197e68214b41647";

    // // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var icon = data.weather[0].icon;
            currentWeatherEl.textContent = "";
            box1El.classList.remove("hide");
            fiveDayForecastEl.classList.remove("hide");
            getWeather(lat, lon, icon);
            currentIcon = `<img src = http://openweathermap.org/img/wn/${icon}.png>`
            citySearchTerm.innerHTML = city + ': ' + '(' + moment().format('l') + ')' + currentIcon;
        });
        } else {
        alert('Error: City Not Found');
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect, please try again later");
    });
};

//function to call API for city weather using coordinates passed in from getCityCoords
var getWeather = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid=34d23521a96f3e289197e68214b41647";

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            //get current temperature
            var temp = data.current.temp;
            //console.log(temp);
            //convert temperature from Kelvin to Fahrenheit
            temp = Math.round(((temp - 273.15) * 1.8 + 32));

            //get wind speed
            var wind = data.current.wind_speed;

            //get humidity %
            var humid = data.current.humidity;

            //get UV index
            var uv = data.current.uvi;

            //display data on screen
            //temperature
            var tempEl = document.createElement('p');
            tempEl.textContent = "Temp: " + temp + " °F";

            //wind speed
            var windEl = document.createElement('p');
            windEl.textContent = "Wind: " + wind + " MPH";

            //humidity
            var humidEl = document.createElement('p');
            humidEl.textContent = "Humidity: " + humid + " %";

            //uv index
            var uvEl = document.createElement('p');
            uvEl.textContent = "UV Index: ";

            var uvEl2 = document.createElement('span');
            uvEl2.textContent = uv;
            
            if (uv<=2){
                uvEl2.classList.add("uv-favorable");
            }
            else if(uv<=7){
                uvEl2.classList.add("uv-moderate");
            }
            else{
                uvEl2.classList.add("uv-severe");
            }
            currentWeatherEl.appendChild(tempEl);
            currentWeatherEl.appendChild(windEl);
            currentWeatherEl.appendChild(humidEl);
            currentWeatherEl.appendChild(uvEl);
            uvEl.appendChild(uvEl2);

            forecastData(data);
        });
        } else {
        alert('Error: City Not Found');
        }
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect, please try again later");
    });
};

var forecastData = function (data) {
        var allForecastData = $('.allForecastData');
        allForecastData.html("");
        var fiveDaysForecast = document.createElement('div');
        fiveDaysForecast.setAttribute('class', 'dayForecast');
    //loop through 5 days of forecast
    for (var i = 0; i < 5; i++) {
        var eachForecast = document.createElement('div');
        eachForecast.setAttribute('id', '#day' + i);
        eachForecast.setAttribute('class','dayForecast');
        //create variable add p tag for each data point
        var addDate = document.createElement('P');
        var addIcon = document.createElement('p');
        var addTemp = document.createElement('p');
        var addWind = document.createElement('p');
        var addHumid = document.createElement('p');
        addDate.textContent = moment().add(i + 1, 'days').format('l');
        eachIcon = data.daily[i].weather[0].icon;
        var temperature = data.daily[i].temp.day;
        var wind2 = data.daily[i].wind_speed;
        addTemp.textContent = "Temp: " + Math.round(((temperature - 273.15) * 1.8 + 32)) + " °F";
        addWind.textContent = "Wind: " + wind2 + " MPH";
        addHumid.textContent = "Humidity: " + data.daily[i].humidity + " %";
        addIcon.innerHTML = `<img src = http://openweathermap.org/img/wn/${eachIcon}.png>`
        eachForecast.appendChild(addDate);
        eachForecast.appendChild(addIcon);
        eachForecast.appendChild(addTemp);
        eachForecast.appendChild(addWind);
        eachForecast.appendChild(addHumid);
        allForecastData.append(eachForecast);
    } 
    loadCities();
}

var buttonClickHandler = function(event) {
    var recentCity = event.target.getAttribute("id");
    getCityCoords (recentCity);
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityname = cityInputEl.value.trim().toUpperCase();

    if (cityname) {
    getCityCoords(cityname);
    localStorage.setItem('city', JSON.stringify(cityname));
    cityInputEl.value = "";
    //add city to search history
    var cityEl = document.createElement('button');
    cityEl.setAttribute("id", cityname);
    cityEl.classList.add("btn");
    cityEl.textContent = cityname;
    recentCitiesEl.appendChild(cityEl);
    } else {
    alert("Please enter a city name");
    }
    console.log(event);
};

var loadCities = function () {
    cityname = JSON.parse(localStorage.getItem('city'));
};

cityFormEl.addEventListener("submit", formSubmitHandler);
recentCitiesEl.addEventListener("click", buttonClickHandler);