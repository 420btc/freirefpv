# Guía de Despliegue en Netlify para FreireFPV

Este documento proporciona instrucciones para desplegar correctamente la aplicación FreireFPV en Netlify.

## Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables de entorno en Netlify:

1. **MAPBOX_TOKEN**: Tu token de Mapbox para la visualización de mapas
   ```
   pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw
   ```

2. **OPENWEATHER_API_KEY**: Tu clave API de OpenWeather para datos meteorológicos
   ```
   5ae0c9a3137234e18e032e3d6024629e
   ```

3. **EMAILJS_USER_ID**: El ID de usuario de EmailJS
   ```
   DfZMgSG2TzFEZUmYA
   ```

4. **EMAILJS_SERVICE_ID**: El ID del servicio de EmailJS (normalmente "service_freire_fpv")

5. **EMAILJS_TEMPLATE_ID**: El ID de la plantilla de EmailJS para el formulario de contacto

## Pasos para Configurar Variables de Entorno en Netlify

1. Inicia sesión en tu cuenta de Netlify
2. Selecciona tu sitio de FreireFPV
3. Ve a **Site settings** > **Build & deploy** > **Environment**
4. Haz clic en **Edit variables**
5. Añade cada una de las variables mencionadas anteriormente con sus respectivos valores
6. Guarda los cambios

## Despliegue Inicial

Para el despliegue inicial, sigue estos pasos:

1. Inicia sesión en Netlify
2. Haz clic en "New site from Git"
3. Selecciona GitHub como proveedor de Git
4. Autoriza a Netlify para acceder a tus repositorios
5. Selecciona el repositorio "freirefpv"
6. Configura las opciones de construcción:
   - **Build command**: Déjalo en blanco (se usa el comando del archivo netlify.toml)
   - **Publish directory**: Déjalo en blanco (se usa el directorio del archivo netlify.toml)
7. Haz clic en "Deploy site"

## Verificación del Despliegue

Una vez que el sitio esté desplegado, verifica que:

1. La página principal se carga correctamente
2. El mapa de Mapbox se visualiza correctamente
3. Los datos meteorológicos se cargan correctamente
4. El formulario de contacto funciona y envía correos electrónicos

## Solución de Problemas

Si encuentras problemas con el despliegue:

1. Verifica los logs de construcción en Netlify para identificar errores
2. Asegúrate de que todas las variables de entorno estén configuradas correctamente
3. Verifica que las funciones de Netlify estén funcionando correctamente en la sección "Functions" del panel de control

## Actualizaciones Futuras

Para futuras actualizaciones, simplemente haz push de tus cambios al repositorio de GitHub. Netlify detectará automáticamente los cambios y desplegará la nueva versión.
