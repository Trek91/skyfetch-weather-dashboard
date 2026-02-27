function WeatherApp() {

    this.apiKey = "ca2bcfe3d34499aa707cd75927f1a758";

    this.cityElement = document.getElementById("city");
    this.tempElement = document.getElementById("temp");
    this.descriptionElement = document.getElementById("description");
    this.iconElement = document.getElementById("icon");
    this.messageElement = document.getElementById("message");
    this.searchBtn = document.getElementById("searchBtn");
    this.cityInput = document.getElementById("cityInput");

    this.forecastContainer = document.createElement("div");
    this.forecastContainer.className = "forecast-container";
    document.querySelector(".container").appendChild(this.forecastContainer);

    // 🔥 PART 4 — Local Storage Setup
    this.recentSearches = JSON.parse(localStorage.getItem("recentCities")) || [];

    this.recentContainer = document.getElementById("recentContainer");
    this.recentContainer.className = "recent-container";
    document.querySelector(".container").appendChild(this.recentContainer);
}

WeatherApp.prototype.init = function () {
    this.showWelcome();
    this.loadRecentSearches();

    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });
};

WeatherApp.prototype.showWelcome = function () {
    this.messageElement.textContent = "Search for a city to see weather forecast.";
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    this.getWeather(city);
};

WeatherApp.prototype.getWeather = async function (city) {

    this.showLoading();

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    try {

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(weatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherRes.data);

        const processedForecast = this.processForecastData(forecastRes.data.list);
        this.displayForecast(processedForecast);

        this.saveToLocalStorage(city);
        this.loadRecentSearches();

        this.messageElement.textContent = "";

    } catch (error) {
        this.showError("City not found.");
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.cityElement.textContent = data.name;
    this.tempElement.textContent = data.main.temp + "°C";
    this.descriptionElement.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    this.iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

WeatherApp.prototype.processForecastData = function (forecastList) {

    const dailyForecasts = forecastList.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyForecasts.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastData) {

    this.forecastContainer.innerHTML = "";

    forecastData.forEach(item => {

        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${dayName}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
            <p>${item.main.temp}°C</p>
            <p>${item.weather[0].description}</p>
        `;

        this.forecastContainer.appendChild(card);
    });
};

WeatherApp.prototype.saveToLocalStorage = function (city) {

    city = city.toLowerCase();

    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(c => c !== city);

    // Add to beginning
    this.recentSearches.unshift(city);

    // Limit to 5 cities
    if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(this.recentSearches));
};

WeatherApp.prototype.loadRecentSearches = function () {

    this.recentContainer.innerHTML = "<h3>Recent Searches</h3>";

    this.recentSearches.forEach(city => {

        const btn = document.createElement("button");
        btn.className = "recent-btn";
        btn.textContent = city;

        btn.addEventListener("click", () => {
            this.getWeather(city);
        });

        this.recentContainer.appendChild(btn);
    });
};

WeatherApp.prototype.showLoading = function () {
    this.messageElement.textContent = "Loading...";
};

WeatherApp.prototype.showError = function (msg) {
    this.messageElement.textContent = msg;
    this.forecastContainer.innerHTML = "";
};

const app = new WeatherApp();
app.init();