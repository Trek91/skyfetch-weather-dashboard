const apiKey = "ca2bcfe3d34499aa707cd75927f1a758";
const city = "London";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)
  .then(function(response) {

      const data = response.data;

      document.getElementById("city").textContent = data.name;
      document.getElementById("temp").textContent = data.main.temp + "°C";
      document.getElementById("description").textContent = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById("icon").src = iconUrl;

  })
  .catch(function(error) {
      console.error("Error fetching weather:", error);
  });