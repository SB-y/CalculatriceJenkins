FROM node:18

USER root
RUN apt-get update && apt-get install -y chromium chromium-driver curl gnupg \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Définir le repertoire de travail
WORKDIR /calculatrice_app

# Copier les fichiers vers le repertoire de travail
COPY index.html .
COPY script.js .
COPY style.css .
COPY test_calculatrice.js .

# Installer selenium-webdriver + http-server
RUN npm install selenium-webdriver http-server 

# Exposer le port 
EXPOSE 8080 4444

# Démarrer le serveur statique + attendre + lancer les tests
CMD ["sh", "-c", "npx http-server -p 8080 -a 0.0.0.0 & sleep 10 && node test_calculatrice.js"]
