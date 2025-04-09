// Funciones para interactuar con las Netlify Functions
const API_BASE_URL = '/.netlify/functions';

// Función para obtener datos del tiempo
async function getWeatherData() {
    try {
        const response = await fetch(`${API_BASE_URL}/weather`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del clima');
        }
        const data = await response.json();
        updateWeatherUI(data);
        return data;
    } catch (error) {
        console.error('Error al obtener datos del clima:', error);
        showWeatherError();
        return null;
    }
}

// Función para actualizar la UI con los datos del tiempo
function updateWeatherUI(data) {
    if (!data) return;

    // Actualizar datos actuales
    const current = data.current;
    document.getElementById('current-temp').textContent = `${Math.round(current.temp)}°C`;
    document.getElementById('current-description').textContent = current.description;
    document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;
    document.getElementById('current-wind').textContent = `${current.wind_speed} m/s`;
    document.getElementById('current-humidity').textContent = `${current.humidity}%`;
    document.getElementById('current-feels-like').textContent = `${Math.round(current.feels_like)}°C`;
    
    // Actualizar pronóstico diario si existe
    const forecastContainer = document.getElementById('weather-forecast');
    if (forecastContainer && data.daily) {
        forecastContainer.innerHTML = '';
        
        // Mostrar solo los próximos 5 días
        const daysToShow = Math.min(5, data.daily.length);
        
        for (let i = 0; i < daysToShow; i++) {
            const day = data.daily[i];
            const date = new Date(day.dt * 1000);
            const dayName = getDayName(date.getDay());
            
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <div class="day-name">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather.icon}.png" alt="${day.weather.description}">
                <div class="temp-range">
                    <span class="max">${Math.round(day.temp.max)}°</span>
                    <span class="min">${Math.round(day.temp.min)}°</span>
                </div>
            `;
            
            forecastContainer.appendChild(dayElement);
        }
    }
    
    // Actualizar timestamp
    const timestampElement = document.getElementById('weather-timestamp');
    if (timestampElement) {
        const updateTime = new Date(current.dt * 1000);
        timestampElement.textContent = `Actualizado: ${updateTime.toLocaleTimeString()}`;
    }
    
    // Mostrar contenedor del tiempo
    const weatherContainer = document.getElementById('weather-container');
    if (weatherContainer) {
        weatherContainer.style.display = 'block';
    }
}

// Función para mostrar error en caso de fallo
function showWeatherError() {
    const weatherContainer = document.getElementById('weather-container');
    if (weatherContainer) {
        weatherContainer.innerHTML = `
            <div class="weather-error">
                <p>No se pudieron cargar los datos del clima.</p>
                <button onclick="getWeatherData()" class="btn-refresh">Reintentar</button>
            </div>
        `;
        weatherContainer.style.display = 'block';
    }
}

// Función para obtener el nombre del día en español
function getDayName(weekday) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[weekday];
}

// Función para enviar formulario de contacto
async function sendContactForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al enviar el mensaje');
        }
        
        return { success: true, message: data.message || 'Mensaje enviado correctamente' };
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        return { success: false, message: error.message || 'Error al enviar el mensaje' };
    }
}

// Inicializar datos del tiempo al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en una página que muestra el clima, cargarlo
    if (document.getElementById('weather-container')) {
        getWeatherData();
    }
    
    // Configurar formulario de contacto si existe
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const service = document.getElementById('service').value;
            
            const formData = { name, email, phone, message, service };
            
            // Mostrar indicador de carga
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            const result = await sendContactForm(formData);
            
            // Restaurar botón
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Mostrar mensaje de resultado
            const resultElement = document.getElementById('form-result');
            if (resultElement) {
                resultElement.textContent = result.message;
                resultElement.className = result.success ? 'success-message' : 'error-message';
                resultElement.style.display = 'block';
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    resultElement.style.display = 'none';
                }, 5000);
                
                // Limpiar formulario si fue exitoso
                if (result.success) {
                    contactForm.reset();
                }
            }
        });
    }
});
