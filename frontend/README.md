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
             CSS : Saas


## 📦 Installation des packages et démarrage des serveurs du FRONTEND uniquement

FRONT-END :
Lien github de la partie front-end : 
https://github.com/karinbaldisseri/P7-Groupomania/tree/main/frontend
à télécharger afin d'accéder à l'interface de l'API.

Ensuite, positinnez-vous dans le dossier frontend et exécutez la commande :
`npm install`
pour installer les packages requis pour le fonctionnement du frontend et 

ensuite exécutez la commande:
`npm run start`
pour démarrer le serveur du frontend -- Port 3306


## 🔐 Variables d'environnement 

Dans le frontend, créez un fichier ".env" (ou changez ".env.example" en ".env") et déclarez les variables nécessaires selon les instructions du fichier ".env.example".
Variables d'environnement nécessaires : 

VITE_BASE_URL=insert baseURL (ex: localhost:port)




