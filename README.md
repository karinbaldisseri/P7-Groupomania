# P7-Groupomania

Projet n°7 du parcours Développeur Web d'OpenClassrooms : "Créez un réseau social d’entreprise."

    Le projet consiste à construire un réseau social interne pour les employés de Groupomania avec une base de donnée SQL - Mysql. Les données utilisateurs doivent respecter le RGPD et l'API doit être sécurisée en respectant les préconisations de l'OWASP. Le site est également optimisé en terme d'accessibilité.


## 📚 Technologies utilisées

    SERVER : NodeJS
             Express
             Mysql
             Sequelize
    CLIENT : vitejs
             React
             CSS : Sass


## 📦 Installation des packages et démarrage des serveurs

Lien github de Groupomania (frontend et backend) : 
https://github.com/karinbaldisseri/P7-Groupomania

BACK-END : 
Lien github de la partie back-end (incluant le fichiers .env.example ) : 
https://github.com/karinbaldisseri/P7-Groupomania/tree/main/backend

Depuis le terminal, positionnez-vous dans le dossier `backend`  et exécutez la commande :
`npm install` 
pour installer les packages requis pour le fonctionnement de l'API et 

ensuite exécutez la commande:
`npm run start` ou `npm run dev` (nodemon)
pour démarrer le serveur du backend.

Le message suivant devrait s'afficher dans le terminal :
`Listening on port 3000`
Si le serveur s'exécute sur un autre port, celui-ci sera affiché dans la console à la place de port 3000. 


FRONT-END :
Lien github de la partie front-end : 
https://github.com/karinbaldisseri/P7-Groupomania/tree/main/frontend
à télécharger afin d'accéder à l'interface de l'API.

Ensuite, positinnez-vous dans le dossier frontend et exécutez la commande :
`npm install`
pour installer les packages requis pour le fonctionnement du frontend et 

ensuite exécutez la commande:
`npm run dev`
pour démarrer le serveur du frontend -- Port 3306


## 🔐 Variables d'environnement 

Dans le dossier backend, créez un fichier ".env" (ou changez ".env.example" en ".env") et déclarez les variables nécessaires selon les instructions du fichier ".env.example" pour connecter votre base de données Mysql à l'API et/ou voir les variables ci-dessous.
Variables d'environnement nécessaires : 

PORT = 3000
DB_CONNECTION_NAME="Enter DB Name"
DB_CONNECTION_USERNAME="Enter DB Username"
DB_CONNECTION_PASSWORD="Enter DB Password"

CRYPTOJS_EMAIL_KEY="insert a key : lowercase & numbers at least 12 characters (preferably UUID V4) "
JWT_TOKEN="insert a token : lowercase & numbers at least 12 characters (preferably UUID V4) "
JWT_TOKEN_EXPIRESIN="insert token expiration / validity time - example : 15m"
JWT_REFRESHTOKEN="insert a token : lowercase & numbers at least 12 characters (preferably UUID V4) "
JWT_REFRESHTOKEN_EXPIRESIN="insert refreshtoken expiration / validity time - example : 1d"


Dans le frontend, créez un fichier ".env" (ou changez ".env.example" en ".env") et déclarez les variables nécessaires selon les instructions du fichier ".env.example".
Variables d'environnement nécessaires : 

VITE_BASE_URL=insert baseURL (ex: localhost:port)


## ⚙️ Connection à Mysql

Suite aux déclarations des variables dans le fichier .env, la connexion à la base de donnée Mysql s'affiche sur la console quand le serveur démarre : Connection to database successful ! et Database synced ! qui confirme la synchronisation de la base de données.



