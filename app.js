const apiKey = "ca2bcfe3d34499aa707cd75927f1a758";

async function getWeather(city) {

    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "";

    if (!city.trim()) {
        messageDiv.textContent = "Please enter a city name.";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        messageDiv.textContent = "Loading...";

        const response = await axios.get(url);
        const data = response.data;

        document.getElementById("city").textContent = data.name;
        document.getElementById("temp").textContent = data.main.temp + "°C";
        document.getElementById("description").textContent = data.weather[0].description;

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById("icon").src = iconUrl;

        messageDiv.textContent = "";

    } catch (error) {
        messageDiv.textContent = "City not found. Please try again.";
    }
}

document.getElementById("searchBtn").addEventListener("click", function () {

    const city = document.getElementById("cityInput").value;
    getWeather(city);
});

document.getElementById("cityInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather(this.value);
    }
});