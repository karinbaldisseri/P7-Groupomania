# P7-Groupomania

Projet n°7 du parcours Développeur Web d'OpenClassrooms : "Créez un réseau social d’entreprise."

    Le projet consiste à construire un réseau social interne pour les employés de Groupomania avec une base de donnée SQL - Mysql. Les données utilisateurs doivent respecter le RGPD et l'API doit être sécurisée en respectant les préconisations de l'OWASP.


## 📚 Technologies utilisées

    SERVER : NodeJS
             Express
             Mysql
             Sequelize
    CLIENT : vitejs
             React

## 📦 Installation des packages et démarrage des serveurs

BACK-END : 
Lien github de la partie back-end (incluant le fichiers .env.example ) : LIEN GITHUB BACKEND
Depuis le terminal, positionnez-vous dans le dossier `backend`  et exécutez la commande :
`npm install` 
pour installer les packages requis pour le fonctionnement de l'API et ensuite exécutez la commande:
`npm run start` ou `npm run dev` (nodemon)
pour démarrer le serveur du backend.
Le message suivant devrait s'afficher dans le terminal :
`Listening on port 3000`
Si le serveur s'exécute sur un autre port, celui-ci sera affiché dans la console à la place de port 3000. 


FRONT-END :
Lien github de la partie front-end : LIEN GITHUB FRONTEND à télécharger afin d'accéder à l'interface de l'API.
Ensuite, positinnez-vous dans le dossier frontend et exécutez la commande :
`npm install`
pour installer les packages requis pour le fonctionnement du frontend et ensuite exécutez la commande:
`npm run start`
pour démarrer le serveur du frontend -- Port 4200


## 🔐 Variables d'environnement 

Dans le dossier backend, créez un fichier ".env" (ou changez ".env.example" en ".env") et déclarez les variables nécessaires selon les instructions du fichier ".env.example" pour  connecter une base de données à l'API et/ou voir les variables ci-dessous.
Variables d'environnement nécessaires : 

PORT = 3000
DB_CONNECTION_NAME="Enter DB Name"
DB_CONNECTION_USERNAME="Enter DB Username"
DB_CONNECTION_PASSWORD="Enter DB Password"

CRYPTOJS_EMAIL_KEY=" insert a key : lowercase & numbers at least 12 characters (preferably UUID V4) "
JWT_TOKEN=" insert a token : lowercase & numbers at least 12 characters (preferably UUID V4) "

## ⚙️ Connection à Mysql

Suite aux déclarations des variables dans le fichier .env, la connexion à la base de donnée s'affiche sur la console quand le serveur démarre : Connection to database successful ! et Database synced ! qui confirme la synchronisation de la base de données.



