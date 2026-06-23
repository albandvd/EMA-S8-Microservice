# EMA-S8-Microservice

## 2. Application Javascript

Afin d'avoir une interface agréable sans passer trop de temps dessus car il ne s'agit pas du sujet du TP, les interfaces de la SPA (single page application) ont été entièrement faites avec l'IA. Il s'agit d'une application `TypeScript` (React + vite) utilisant des librairies JS/TS pour faciliter certaines opérations. On utilise notamment la librairie `keycloak-js` qui permet de gérer une instance keycloak pour avoir accès au fonction de connexion/déconnexion en `JavaScript`.

## 3. OAuth 2.1 auprès d'un fournisseur d'API public

Pour cette partie, nous avons fait le choix d'utiliser *Discord* comme provider pour mettre en place l'Oauth 2.1. Nous avons pu créer une nouvelle application dans le portail développeur afin de pouvoir mettre en place l'OAuth. Nous avons pu ensuite récupérer le `client_id` et le `client_secret` et donner notre URL de callback sur laquelle le provider doit nous rediriger une fois la connexion réussie (Dans notre cas localhost:3000/auth/discord/callback).

Ensuite nous avons créer les endpoint sur notre API afin de pouvoir demander l'autorisation à Discord. Tout d'abord l'endpoint /auth/discord/login permet de passer à Discord les paramètres nécessaires via l'url. On lui donne le `client_id`, la `redirect_uri` et le `scope` (qui permet de savoir quels informations Discord va nous renvoyer sur l'utilisateur, dans notre cas : `identity+email`).
Le deuxième endpoint va servir à récupérer l'autorisation de Discord. Une fois que l'utilisateur a consenti à partager ses données avec notre application, Discord va envoyer un code sur notre URL de callback. Avec ce code nous envoyons ensuite une requête à Discord avec notre `client_id` et notre `client_secret` afin de recupérer un accesToken qui prouve que la connexion est autorisée. Pour finir on récupère les information de l'utilisateur avec l'accessToken pour les afficher dans l'application.

## 4. Déléguer l'autorisation d'accès à l'API REST auprès d'un serveur OpenID Connect

Pour commencer nous avons lancé selon la documentation de Keycloak, une instance docker de keycloak avec la commande `docker run -p 127.0.0.1:8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.6.3 start-dev`.

Dans l'interface Keycloak on créer un `royaume` (ema-s8-microservices) ainsi qu'un client (aeroflow-api, correspondant à notre API REST) que l'on va configurer avec `client authentification` ON et `authorization` ON

Les paramètres de connexion à Keycloak sont stockés dans le `.env`.

Dans le fichier `jwt.strategy.ts`, on va définir les différents contrôles qui vont être fait sur le token.
On regarde premièrement la signature en interrogeant keycloak afin d'obtenir le certificat qui permet d'avoir la clé pour vérifier l'authenticité du token. On fait ensuite un contrôle sur l'`issuer` pour s'assurer que le token est émis par notre `royaume` et un contrôle sur l'audience afin de s'assurer que le token est émis pour les clients autorisés (dans notre cas il faut que l'utilisateur ait le `client_id` `aeroflow-api` dans son champ `audience` pour être autorisé).

On utilise ensuite l'auth guard standardisé de `NestJS` nommé `JwtAuthguard` en spécifiant la stratégie de validation `jwt`. De cette manière on bénéficie d'un système déjà mis en place par le framework `nestJS` tout en spécifiant les contrôles nécessaire à notre application.

Pour appliquer cet auth guard à nos routes, il faut ajouter la décoration `@UseGuards(JwtAuthGuard)`.

## 5. Déléguer l'authentification de l'application Web auprès du serveur OpenID Connect Keycloak

Dans l'interface Keycloak dans notre `royaume` (ema-s8-microservices), on créé un nouveau client (aeroflow-web, correspondant à notre application Javascript) que l'on va configurer avec `client authentification` OFF et `authorization` OFF (client public). On va aussi cocher `standard flow` et définir `http://localhost:5173` comme `Root URL` et `http://localhost:5173/*` comme URI de redirection valide.

La stratégie de vérification du token est la même que pour le 4. au détail prêt que nous avons ajouté le nouveau client `aeroflow_web` dans la liste des audiences autorisées.

Pour la connexion, on utilise la fonction `login()` de la librairie `keycloak-js` qui redirige l'utilisateur vers le portail de connexion de Keycloak. Une fois authentifié, le serveur Keycloak crée un cookie de session (associé à son domaine et lisible uniquement par lui). De retour sur l'application, la fonction `init()` récupère les jetons d'accès et les stocke en mémoire vive. Lors d'un rafraîchissement de page, c'est cette même fonction `init()` qui interroge Keycloak en arrière-plan pour vérifier la présence du cookie de session et restaure automatiquement l'authentification.

On peut ensuite consulté le token en allant voir dans la console de développement du navigateur dans l'onglet `network` après avoir fait un appel sécurisé à l'API.

## 6. Analyser le token JWT généré par Keycloak

Une section dans l'application permet directement de décrypter le contenu du token JWT. On peut y observer les informations sur l'utilisateur, l'issuer, l'audience, la date d'expiration, l'heure de connexion...

Dans notre cas on retrouve bien les données liées à notre utilisateur que l'on a créer sur keycloak.