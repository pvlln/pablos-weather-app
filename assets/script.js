$(function(){
    var searchBtn = $('.search-btn');
    // Get latitude and longitude
    var apiKey = 'a368eaa8ec07339e5dacc6add307ebaa';
    function getCoordinates(){
        console.log("coordinates function called");
        var searchBar = $('.search-bar');
        var cityName = searchBar.val();
        coordReqUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
        // Fetch coordinates
        fetch(coordReqUrl).then(function(response){return response.json();}).then(function(data){
            var lat = data[0].lat;
            var lon = data[0].lon;
            var coordinates = [lat,lon];
            console.log(lat,lon);
            getWeather(coordinates);
        })
    }
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
            var date = dayjs().format('MM/DD/YYYY');
            var cityName = data.name;
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var hdity = data.main.humidity;
            var cityNameEl = $('.city-name');
            var tempEl = $('.temp');
            var windEl = $('.wind');
            var hdityEl = $('.humidity');
            // Print onto document
            cityNameEl.text(`${cityName} (${date})`);
            tempEl.text(`Temp: ${temp} °C`);
            function emoji(){ 
                return data.weather[0].main == 'Clear' ? tempEl.attr('class', 'fas fa-sun')
                : tempEl.attr('class', 'fas fa-cloud-sun')
            } // dayForecast.weather[0].main == 'Clouds' ?
            windEl.text(`Wind: ${wind} Km/h`);
            hdityEl.text(`Humidity: ${hdity}%`);
            localStorage.setItem(cityName, coordinates);
            var recentSearch = $('.recent-search');
            recentSearch.append(`<div class="row">
                                    <button class="btn btn-primary my-2 recent">${cityName}</button>
                                </div>`);
            // Create function that makes api call from button
            $('.recent').on('click', function(event){
                var searchbar = $('.search-bar');
                searchbar = $(this).val();
            })
        }).then(
        fetch(forecastReqUrl).then(function(response){return response.json();}).then(function(data){
            for(let i=1; i<6; i++){
                // console.log(data); let i=0; i<40; i+=8
                var dayForecast = data.list[i];
                var time = dayForecast.dt;
                console.log(dayForecast, time);
                var forecastTemp = dayForecast.main.temp;
                var forecastWind = dayForecast.wind.speed;
                var forecastHdity = dayForecast. main.humidity;
                var forecastTime = dayjs.unix(time).format('MM/DD/YYYY');
                var currentEl = $(`.day${i}`);
                console.log(currentEl.children('p').eq(1).text(`Temp: ${forecastTemp} °C`));
                currentEl.children('h4').text(forecastTime);
                // ADD EMOJI/ICON
                currentEl.children('p').eq(1).text(`Temp: ${forecastTemp} °C`);
                function emoji(){ 
                    return dayForecast.weather[0].main == 'Clear' ? currentEl.children('p').eq(1).attr('class', 'fas fa-sun')
                    : currentEl.children('p').eq(1).attr('class', 'fas fa-cloud-sun');
                } //dayForecast.weather[0].main == 'Clouds' ?
                currentEl.children('p').eq(2).text(`Wind: ${forecastWind} Km/h`);
                currentEl.children('p').eq(3).text(`Humidity: ${forecastHdity}%`);
            }
        })
        )
    }
    searchBtn.on('click', getCoordinates);
})