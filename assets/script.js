$(function(){
    var searchBtn = $('.search-btn');
    // Get latitude and longitude
    var apiKey = 'a368eaa8ec07339e5dacc6add307ebaa';
    function getCoordinates(){
        console.log("coordinates function called");
        var searchBar = $('.search-bar');
        var cityName = searchBar.val();
        coordReqUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
        // Fetch coordinates
        fetch(coordReqUrl).then(function(response){return response.json();}).then(function(data){
            var lat = data[0].lat;
            var lon = data[0].lon;
            var coordinates = [lat,lon];
            console.log(lat,lon);
            getWeather(coordinates);
        })
    };
    // Function to apply the emoji
    function setEmoji(weather, element) {
        if (weather == 'Clear') {
            return element.attr('class', 'emoji fas fa-sun');
        } else if (weather == 'Clouds') {
            return element.attr('class', 'emoji fas fa-cloud');
        } else if (weather == 'Rain') {
            return element.attr('class', 'emoji fas fa-cloud-rain');
        } else if (weather == 'Snow') {
            return element.attr('class', 'emoji fas fa-snowflake');
        } else {
            return element.attr('class', 'emoji fas fa-smog');
        }
    };
    // function that gets the weather based on the latitude and longitude from the previous function
    function getWeather(coordinates){
        console.log("weather function called");
        // set request urls
        weatherReqUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${apiKey}`;
        forecastReqUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${apiKey}`;
        // fetch api results using this url
        fetch(weatherReqUrl).then(function(response){return response.json();}).then(function(data){
            console.log(data);
            //store elements and data points in variables
            var date = dayjs().format('MM/DD/YY');
            var cityName = data.name;
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var hdity = data.main.humidity;
            var cityNameEl = $('.city-name');
            var tempEl = $('.temp');
            var windEl = $('.wind');
            var hdityEl = $('.humidity');
            var emojiEl = $('.emoji');
            // Print onto document
            cityNameEl.text(`${cityName} (${date})`);
            tempEl.text(`Temp: ${temp} °C`);
            setEmoji(data.weather[0].main, emojiEl);
            windEl.text(`Wind: ${wind} Km/h`);
            hdityEl.text(`Humidity: ${hdity}%`);
            // CHECK LOCALSTORAGE FUNCTIONALITY
            localStorage.setItem(cityName, coordinates);
            var cities = JSON.parse(localStorage.getItem('cities')) || [];
            if (!cities.includes(cityName)) {
            cities.push(cityName);
            localStorage.setItem('cities', JSON.stringify(cities));
            };
            var recentSearch = $('.recent-search');
            recentSearch.empty();
            cities.forEach(function(city) {
                recentSearch.append(`<div class="row">
                            <button class="btn btn-primary my-2 recent">${city}</button>
                            </div>`);
            });
            $('.recent').on('click', function() {
                const name = $(this).text();
                const coordinates = localStorage.getItem(name);
                getWeather(coordinates);
            });            
            var currentEl = $(`.day1`);
            // Fill out first of 5 day forecast
            currentEl.children('h4').text("Today");
            currentEl.children('p').eq(1).text(`Temp: ${temp} °C`);
            currentEl.children('p').eq(2).text(`Wind: ${wind} Km/h`);
            currentEl.children('p').eq(3).text(`Humidity: ${hdity}%`);
            // Create function that makes api call from button
            $('.recent').on('click', function(event){
                var searchbar = $('.search-bar');
                searchbar = $(this).val();
            });
        }).then(
        fetch(forecastReqUrl).then(function(response){return response.json();}).then(function(data){
            for(let i=1; i<5; i++){
                // console.log(data); let i=0; i<40; i+=8; i *8
                var dayForecast = data.list[i*8];
                var time = dayForecast.dt;
                console.log(dayForecast, time);
                var forecastTemp = dayForecast.main.temp;
                var forecastWind = dayForecast.wind.speed;
                var forecastHdity = dayForecast. main.humidity;
                var forecastTime = dayjs.unix(time).format('MM/DD/YY');
                var currentEl = $(`.day${i+1}`);
                console.log(currentEl.children('p').eq(1).text(`Temp: ${forecastTemp} °C`));
                setEmoji(dayForecast.weather[0].main, currentEl.children('p').eq(1));
                currentEl.children('h4').text(forecastTime);
                currentEl.children('p').eq(1).text(`Temp: ${forecastTemp} °C`);
                currentEl.children('p').eq(2).text(`Wind: ${forecastWind} Km/h`);
                currentEl.children('p').eq(3).text(`Humidity: ${forecastHdity}%`);
            }
        })
        )
    }
    searchBtn.on('click', getCoordinates);
})