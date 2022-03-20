var cityFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var citySearchTerm = document.querySelector("#repo-search-term");
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
            console.log(lat);
            console.log(lon);

            citySearchTerm.textContent = city;
            getWeather(lat, lon);
            
            console.log(data);
            //Temp, wind, humidity, uv index
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid=34d23521a96f3e289197e68214b41647";
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
            var temp = data.list[1].main.temp;
            //convert temperature from Kelvin to Fahrenheit
            temp = Math.round(((temp - 273.15) * 1.8 + 32));
            //display temperature on screen
            repoContainerEl.textContent = 'Temperature: ' + temp + '°F';
            console.log(temp);

            // for (var i = 0; i < response.list.length; i++) {
            //     var data = response.list[i];
            //     repoContainerEl.textContent = data.main.temp;
            // }
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

    var cityname = cityInputEl.value.trim();

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
    repoContainerEl.textContent = searchTerm;
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
        repoContainerEl.appendChild(repoEl);
};

// var displayRepos = function(cities, searchTerm) {
//     // clear old content
//     repoContainerEl.textContent = "";
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
//         repoContainerEl.appendChild(repoEl);
//     }
// };

cityFormEl.addEventListener("submit", formSubmitHandler);