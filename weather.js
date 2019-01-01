window.onload = function() {

	var ipUrl = "https://ipinfo.io/json";				

	var appid = "appid=c21ae18d508d82b4f7ba9e3ec7c10b35";

	var location = document.getElementById("location");	

	var currentDate = new Date();

	var dayNight = "day";	



	var dateElem = document.getElementById("date");

	dateElem.innerHTML = currentDate.toDateString();


	httpReqIpAsync(ipUrl);							

	function httpReqIpAsync(url, callback) {

		var httpReqIp = new XMLHttpRequest();

		httpReqIp.open("GET", url, true)

		httpReqIp.onreadystatechange = function() {

			if(httpReqIp.readyState == 4 && httpReqIp.status == 200) {

				var jsonIp = JSON.parse(httpReqIp.responseText)

				var ip = jsonIp.ip;

				var city = jsonIp.city;

				var country = jsonIp.country;

				location.innerHTML = `${city}, ${country}`;

				var lat = jsonIp.loc.split(",")[0];

				var lon = jsonIp.loc.split(",")[1];

				console.log(lat+" "+lon)

				var weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${appid}`;

				httpReqWeatherAsync(weatherApi);

			}

		}

		httpReqIp.send();				

	}

	function httpReqWeatherAsync(url, callback) {

		var httpReqWeather = new XMLHttpRequest();

		httpReqWeather.open("GET", url, true);

		httpReqWeather.onreadystatechange = function() {

			if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {

				var jsonWeather = JSON.parse(httpReqWeather.responseText);

				console.log(jsonWeather)

				var weatherDesc = jsonWeather.weather[0].description;

				var id = jsonWeather.weather[0].id;

				var icon = `<i class="wi wi-owm-${id}"></i>`

				var temperature = jsonWeather.main.temp;

				var tempFaren = Math.round(1.8 * (temperature - 273) + 32)
				var tempCel= Math.round((tempFaren-32)*(5/9))

				var humidity = jsonWeather.main.humidity;

				var windSpeed = jsonWeather.wind.speed; 

				var visibility = Math.round(jsonWeather.visibility / 1000);

				var sunSet = jsonWeather.sys.sunset;

				var timeNow = Math.round(currentDate / 1000);

				console.log(timeNow + "<" + sunSet +" = "+(timeNow < sunSet))

				dayNight = (timeNow < sunSet) ? "day" : "night";

				var description = document.getElementById("description");

				description.innerHTML = `<i id="icon-desc" class="wi wi-owm-${dayNight}-${id}"></i><p>${weatherDesc}</p>`;

				var tempElement = document.getElementById("temperature");

				tempElement.innerHTML = `${tempCel}<i id="icon-thermometer" class="wi wi-thermometer"></i>`	;

				var humidityElem = document.getElementById("humidity");

				humidityElem.innerHTML = `${humidity}%`;

				var windElem = document.getElementById("wind");

				windElem.innerHTML = `${windSpeed}m/h`;

				var visibilityElem = document.getElementById("visibility");

				visibilityElem.innerHTML = `${visibility} miles`;

			}

		}

		httpReqWeather.send();

	}							

}
