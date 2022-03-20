var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var currentWeatherEl = document.querySelector("#currentWeather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var lat = "";
var lon = "";

//function to call API for city coordinates
var getCityCoords = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=34d23521a96f3e289197e68214b41647";
    // "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=34d23521a96f3e289197e68214b41647"
    // https://api.github.com/users/" + user + "/repos

    // // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var icon = data.weather[0].icon;
            // console.log(lat);
            // console.log(lon);
            // console.log(icon);

            //citySearchTerm.textContent = city;
            currentWeatherEl.textContent = "";
            getWeather(lat, lon, icon);
            currentIcon = `<img src = http://openweathermap.org/img/wn/${icon}.png>`
            citySearchTerm.innerHTML = city + ': ' + '(' + moment().format('l') + ')' + currentIcon;

            console.log(data);
        });
        } else {
        alert('Error: City Not Found');
        }
        console.log(response);
    })
    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect, please try again later");
    });
};

//function to call API for city weather using coordinates passed in from getCityCoords
var getWeather = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid=34d23521a96f3e289197e68214b41647";
    //api.openweathermap.org/data/2.5/forecast?lat=39.4334&lon=-84.1666&appid=34d23521a96f3e289197e68214b41647
    // "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=34d23521a96f3e289197e68214b41647"
    // https://api.github.com/users/" + user + "/repos

    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            //get current temperature
            var temp = data.current.temp;
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

var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityname = cityInputEl.value.trim().toUpperCase();

    if (cityname) {
    getCityCoords(cityname);
    cityInputEl.value = "";
    } else {
    alert("Please enter a city name");
    }
    console.log(event);
};

var displayRepos = function(weathers, searchTerm) {
    // clear old content
    currentWeatherEl.textContent = searchTerm;
    //citySearchTerm.textContent = searchTerm;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = searchTerm;
    
        // append to container
        repoEl.appendChild(titleEl);
    
        // append container to the dom
        currentWeatherEl.appendChild(repoEl);
};

// var displayRepos = function(cities, searchTerm) {
//     // clear old content
//     currentWeatherEl.textContent = "";
//     repoSearchTerm.textContent = searchTerm;

//     // loop over repos
//     for (var i = 0; i < cities.length; i++) {
//         // format repo name
//         var repoName = cities[i].owner.id + "/" + cities[i].name;
//         console.log(repoName);
//         // create a container for each repo
//         var repoEl = document.createElement("div");
//         repoEl.classList = "list-item flex-row justify-space-between align-center";
    
//         // create a span element to hold repository name
//         var titleEl = document.createElement("span");
//         titleEl.textContent = repoName;
    
//         // append to container
//         repoEl.appendChild(titleEl);
    
//         // append container to the dom
//         currentWeatherEl.appendChild(repoEl);
//     }
// };

cityFormEl.addEventListener("submit", formSubmitHandler);