const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // Coordenadas de Málaga
    const lat = 36.72;
    const lon = -4.42;
    const apiKey = "5ae0c9a3137234e18e032e3d6024629e"; // API key de OpenWeather
    
    // Obtener pronóstico usando la API OneCall 3.0
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric&lang=es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || 'Error desconocido' })
      };
    }
    
    // Procesar datos del tiempo
    const current = data.current;
    const currentWeather = current.weather[0];
    
    const result = {
      current: {
        temp: current.temp,
        description: currentWeather.description,
        icon: currentWeather.icon,
        wind_speed: current.wind_speed,
        humidity: current.humidity,
        feels_like: current.feels_like,
        uvi: current.uvi,
        pressure: current.pressure,
        visibility: current.visibility / 1000, // Convertir a km
        dt: current.dt
      },
      daily: data.daily.map(day => ({
        dt: day.dt,
        temp: {
          min: day.temp.min,
          max: day.temp.max
        },
        weather: {
          description: day.weather[0].description,
          icon: day.weather[0].icon
        },
        wind_speed: day.wind_speed,
        humidity: day.humidity,
        uvi: day.uvi
      }))
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
