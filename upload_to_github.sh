#!/bin/bash

# Script para subir el proyecto completo a GitHub usando Git LFS
# Este script configurará Git LFS para archivos grandes y subirá todo el proyecto

echo "🚀 Comenzando la preparación para subir a GitHub con Git LFS..."

# 1. Configurar Git LFS
echo "⚙️ Configurando Git LFS..."
git lfs install

# 2. Configurar los tipos de archivos que serán manejados por Git LFS
echo "📂 Configurando tipos de archivos para Git LFS..."
git lfs track "*.mp4"
git lfs track "*.mov"
git lfs track "*.gif"
git lfs track "*.png" 
git lfs track "*.jpg"
git lfs track "*.jpeg"

# 3. Crear o actualizar el archivo .gitattributes
echo "📄 Creando archivo .gitattributes..."
cat > .gitattributes << EOL
# Configuración de Git LFS para archivos grandes
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
EOL

# 4. Crear un archivo .gitignore adecuado
echo "📄 Creando archivo .gitignore..."
cat > .gitignore << EOL
# Entorno virtual y caché de Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
ENV/

# Archivos de ambiente local
.env
.env.local

# Archivos del sistema
.DS_Store
Thumbs.db

# Archivos de Replit
.replit
.nix/
.upm/
.local/
.config/
EOL

# 5. Crear archivo requirements.txt para facilitar la instalación
echo "📄 Creando archivo requirements.txt..."
cat > requirements.txt << EOL
email-validator==2.1.0.post1
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
gunicorn==21.2.0
psycopg2-binary==2.9.9
requests==2.31.0
sendgrid==6.10.0
SQLAlchemy==2.0.23
Werkzeug==3.0.1
EOL

# 6. Eliminar cualquier referencia previa a git
echo "🗑️ Limpiando cualquier configuración git previa..."
rm -rf .git

# 7. Inicializar un nuevo repositorio git
echo "🏁 Inicializando repositorio git..."
git init

# 8. Configurar el repositorio remoto
echo "🔗 Configurando repositorio remoto..."
git remote add origin https://github.com/420btc/freirefpv.git

# 9. Añadir todos los archivos
echo "➕ Añadiendo archivos al repositorio..."
git add .gitattributes
git add .gitignore
git add requirements.txt
git add .

# 10. Realizar el primer commit
echo "💾 Realizando commit inicial..."
git commit -m "Commit inicial del proyecto completo con Git LFS para archivos grandes"

# 11. Configurar el nombre de la rama principal
echo "🔄 Configurando rama principal..."
git branch -M main

echo "✅ Preparación completa. Ahora sigue estos pasos:"
echo "1. Para subir todo el repositorio ejecuta:"
echo "   git push -u origin main"
echo "   (Te pedirá tus credenciales de GitHub)"
echo ""
echo "2. Si es muy grande y falla, puedes subir primero los archivos pequeños y luego los grandes:"
echo "   git push -u origin main --no-verify"
echo ""
echo "3. Si sigues teniendo problemas, puedes clonar este repositorio en tu computadora:"
echo "   git clone https://github.com/420btc/freirefpv.git"
echo "   cd freirefpv"
echo "   # Copiar manualmente todos los archivos multimedia"
echo "   git add ."
echo "   git commit -m \"Añadir archivos multimedia\""
echo "   git push"
echo ""
echo "⚠️ Importante: La primera vez que subes archivos con Git LFS puede tardar bastante."
echo "   Ten paciencia mientras se suben tus archivos multimedia."