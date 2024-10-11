# Étape 1: Construire l'application
npm install
npm run build

# Étape 2: Copier les fichiers construits vers le répertoire de production
sudo cp -r dist/* /var/www/html/attribute-validation-tool-front/

# Optionnel: Redémarrer Nginx
sudo systemctl restart nginx
