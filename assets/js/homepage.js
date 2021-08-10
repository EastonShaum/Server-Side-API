var formEl = document.querySelector('#user-form')
var cityInputEl = document.querySelector('#city')
var weatherContainerEl = document.querySelector('#weather-container')
var weatherSearchTerm = document.querySelector("#weather-search-term");
var cityButtonsEl = document.querySelector("#city-buttons")
var cities = []

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
    console.log('1')

    var city = cityInputEl.value.trim();;

    if (city) {
        getCityWeather(city);
        forecastData(city);
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities))
        // clear old content
        weatherContainerEl.textContent = "";
        cityInputEl.value = "";
        renderButtons();
    } else {
        alert("Please enter a city");
    }
};

var getCityWeather = function(city) {

    
    var key = 'd07d58a766cde810f4ca21fec98adf99'


    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key;
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          console.log(data);
          displayWeatherNow(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Weather api");
    });
};

var displayWeatherNow = function(weather, searchTerm) {
    // check if api returned any repos
    if (weather.length === 0) {
      repoContainerEl.textContent = "No weather data found for that city.";
      return;
    }
    console.log(searchTerm, "2")
    weatherSearchTerm.textContent = searchTerm;

    var weatherInfo = document.createElement("div")
    weatherInfo.classList = "card"

    var view = ("Outside it looks like " + weather.weather[0].description)
    var temp = ("Temp: " + Math.round((weather.main.temp - 273.15) * 9/5 + 32) + '°F')
    var wind = ("Wind: " + weather.wind.speed + " MPH")
    var humidity = ("Humidity: " + weather.main.humidity + "%")
    //var uvIndex = ("UV Index: " + weather.main.uvi)
    console.log(view, temp, wind, humidity)
    
    var viewEl = document.createElement("p")
    viewEl.textContent = view;
    var tempEl = document.createElement("p")
    tempEl.textContent = temp;
    var windEl = document.createElement("p")
    windEl.textContent = wind;
    var humidityEl = document.createElement("p")
    humidityEl.textContent = humidity;
    // var uvIndexEl = document.createElement("p")
    // uvIndexEl.textContent = uvIndex;

    weatherInfo.appendChild(viewEl)
    weatherInfo.appendChild(tempEl)
    weatherInfo.appendChild(windEl)
    weatherInfo.appendChild(humidityEl)
    // weatherInfo.appendChild(uvIndexEl)
    
    weatherContainerEl.appendChild(weatherInfo)

    
    
};

var displayWeatherForecast = function(forecast, searchTerm) {
    
        console.log(forecast, "3")
        var forecastInfo = document.createElement("div")
        for(let i = 4;i < 42 ;i+= 8){
            var forecastCard = document.createElement("div")
            forecastCard.classList = "card card-forecast"

            var date = forecast.list[i].dt_txt
            var view = (forecast.list[i].weather[0].main)
            var temp = ("Temp: " + Math.round((forecast.list[i].main.temp - 273.15) * 9/5 + 32) + '°F')
            var wind = ("Wind: " + forecast.list[i].wind.speed + " MPH")
            var humidity = ("Humidity: " + forecast.list[i].main.humidity + "%")
            
            console.log(view, temp, wind, humidity)
            
            var dateEl = document.createElement("p")
            dateEl.textContent = date;
            var viewEl = document.createElement("p")
            viewEl.textContent = view;
            var tempEl = document.createElement("p")
            tempEl.textContent = temp;
            var windEl = document.createElement("p")
            windEl.textContent = wind;
            var humidityEl = document.createElement("p")
            humidityEl.textContent = humidity;
            
            forecastCard.appendChild(dateEl)
            forecastCard.appendChild(viewEl)
            forecastCard.appendChild(tempEl)
            forecastCard.appendChild(windEl)
            forecastCard.appendChild(humidityEl)

            forecastInfo.appendChild(forecastCard)
            
        };
        weatherContainerEl.appendChild(forecastInfo)

}

var forecastData = function(searchTerm) {
    
    var key = 'd07d58a766cde810f4ca21fec98adf99'


    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchTerm + '&appid=' + key;
    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          console.log(data, "4");
          displayWeatherForecast(data, searchTerm);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to Weather api");
    });
}

  var renderButtons = function() {
      var retrievedData = localStorage.getItem("cities")

      console.log(retrievedData)
    if(retrievedData) {
        var localCities = JSON.parse(retrievedData)
        console.log(localCities)
        for (let i = 0; i < localCities.length;i++) {
            var cityValue = localCities[i]
            console.log(cityValue)
            var cityButtonEl = document.createElement("button")
            cityButtonEl.classList = "btn " + localCities[i]
            cityButtonEl.setAttribute("city", localCities[i])
            cityButtonEl.textContent = cityValue

            cityButtonsEl.appendChild(cityButtonEl)
        }
    }
  };

  var renderCity = function() {
    var city = event.target.getAttribute("city");

    if (city) {
        getCityWeather(city);
        forecastData(city);
        weatherContainerEl.textContent = "";
    }
  }

renderButtons();

formEl.addEventListener("submit", formSubmitHandler);
cityButtonsEl.addEventListener("click", renderCity)