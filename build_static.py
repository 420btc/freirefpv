import os
import shutil
import logging
from app import app, get_weather_data
from flask_frozen import Freezer

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar Freezer
app.config['FREEZER_DESTINATION'] = '_site'
app.config['FREEZER_RELATIVE_URLS'] = True
app.config['FREEZER_IGNORE_MIMETYPE_WARNINGS'] = True
freezer = Freezer(app)

# Asegurarse de que el directorio de destino esté limpio
if os.path.exists(app.config['FREEZER_DESTINATION']):
    shutil.rmtree(app.config['FREEZER_DESTINATION'])
    logger.info(f"Directorio {app.config['FREEZER_DESTINATION']} eliminado")

# Crear el directorio de destino
os.makedirs(app.config['FREEZER_DESTINATION'], exist_ok=True)
logger.info(f"Directorio {app.config['FREEZER_DESTINATION']} creado")

# Copiar archivos estáticos
static_source = os.path.join(os.path.dirname(__file__), 'static')
static_dest = os.path.join(app.config['FREEZER_DESTINATION'], 'static')

if os.path.exists(static_source):
    if not os.path.exists(static_dest):
        os.makedirs(static_dest, exist_ok=True)
    
    for root, dirs, files in os.walk(static_source):
        for file in files:
            src_path = os.path.join(root, file)
            rel_path = os.path.relpath(src_path, static_source)
            dst_path = os.path.join(static_dest, rel_path)
            
            dst_dir = os.path.dirname(dst_path)
            if not os.path.exists(dst_dir):
                os.makedirs(dst_dir, exist_ok=True)
            
            shutil.copy2(src_path, dst_path)
            logger.info(f"Copiado: {rel_path}")

# Generar archivos HTML estáticos
@freezer.register_generator
def all_routes():
    # Rutas principales
    yield {'endpoint': 'intro'}
    yield {'endpoint': 'index'}
    yield {'endpoint': 'servicios'}
    yield {'endpoint': 'quienes_somos'}
    yield {'endpoint': 'mi_equipo'}
    yield {'endpoint': 'contacto'}
    
    # Rutas de equipamiento
    yield {'endpoint': 'equipamiento_drones'}
    yield {'endpoint': 'equipamiento_camaras'}
    yield {'endpoint': 'equipamiento_baterias'}
    yield {'endpoint': 'equipamiento_software'}

# Ejecutar Freezer
if __name__ == '__main__':
    # Obtener datos del tiempo para incluirlos en las páginas estáticas
    weather_data = get_weather_data()
    app.config['WEATHER_DATA'] = weather_data
    
    # Congelar la aplicación
    logger.info("Iniciando la generación de archivos estáticos...")
    freezer.freeze()
    logger.info("Generación de archivos estáticos completada")
    
    # Crear archivo _redirects para Netlify
    redirects_file = os.path.join(app.config['FREEZER_DESTINATION'], '_redirects')
    with open(redirects_file, 'w') as f:
        f.write("/api/* /.netlify/functions/:splat 200\n")
        f.write("/* /index.html 200\n")
    logger.info("Archivo _redirects creado para Netlify")
    
    # Crear archivo netlify.toml en el directorio de destino
    netlify_toml = os.path.join(app.config['FREEZER_DESTINATION'], 'netlify.toml')
    with open(netlify_toml, 'w') as f:
        f.write("""[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
""")
    logger.info("Archivo netlify.toml creado en el directorio de destino")
