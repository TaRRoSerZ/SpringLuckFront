# 📚 Documentation Complète - SpringLuck Casino

## 🎓 Introduction : Les Notions Essentielles pour Tout Comprendre

Avant de plonger dans le détail du projet, prenons le temps de comprendre les concepts de base. Cette section s'adresse à vous comme si vous découvriez le développement web pour la première fois.

### 🌐 Qu'est-ce qu'une Application Web ?

Imaginez un restaurant :

- **Le client** (vous, sur votre navigateur) : c'est la personne qui commande
- **Le serveur** (backend) : c'est la cuisine qui prépare les plats
- **L'interface** (frontend) : c'est le menu et la salle où vous mangez

Notre projet **SpringLuck** est comme ce restaurant, mais pour un casino en ligne :

- Le **frontend** (ce projet) : c'est ce que vous voyez à l'écran (les jeux, les boutons, les animations)
- Le **backend** (serveur Spring Boot) : c'est là où sont stockées les données (votre argent, votre compte, l'historique)
- Ils **communiquent ensemble** : quand vous placez un pari, le frontend envoie la demande au backend qui calcule tout et répond

### 🎨 React : Construire des Interfaces comme des LEGO

**React** est une bibliothèque JavaScript qui permet de créer des interfaces utilisateur.

**Analogie simple :**

- Imaginez que vous construisez une maison avec des LEGO
- Chaque **pièce LEGO** est un **composant React** (un bouton, un menu, une carte de jeu)
- Vous assemblez ces pièces pour créer votre **maison complète** (votre application)

**Exemple concret :**

```tsx
// Un composant simple : un bouton
function BoutonJouer() {
  return <button>Jouer maintenant !</button>
}

// Vous pouvez l'utiliser partout :
<BoutonJouer />
<BoutonJouer />
<BoutonJouer />
```

**Avantages :**

- **Réutilisable** : vous créez un bouton une fois, vous l'utilisez 100 fois
- **Maintenable** : si vous modifiez le bouton, il change partout automatiquement
- **Organisé** : chaque pièce a sa fonction précise

### 🧩 TypeScript : JavaScript avec un Filet de Sécurité

**JavaScript** est le langage qui fait vivre les sites web.
**TypeScript** est JavaScript, mais avec des **règles strictes** qui évitent les erreurs.

**Analogie :**

- **JavaScript** : C'est comme conduire sans ceinture de sécurité
- **TypeScript** : C'est comme conduire avec une ceinture + airbag + assistant de freinage

**Exemple concret :**

```typescript
// Sans TypeScript (JavaScript)
function calculer(prix) {
	return prix * 2; // Et si quelqu'un passe "hello" au lieu d'un nombre ?
}

// Avec TypeScript
function calculer(prix: number): number {
	return prix * 2; // TypeScript vérifie que "prix" est bien un nombre !
}
```

### 🗺️ Routing (Navigation) : Les Chemins de Votre Application

**Le routing**, c'est comme avoir un **GPS dans votre application**.

**Analogie :**

- Votre application est une ville
- Chaque **page** est une adresse (rue)
- Le **router** est le GPS qui vous emmène à la bonne adresse

**Exemple dans notre projet :**

```
/ (page d'accueil)           → Vous voyez la liste des jeux
/game/1 (jeu Bomb or Claat)  → Vous jouez au jeu 1
/dashboard (tableau de bord) → Vous voyez votre compte
/deposit (dépôt)             → Vous ajoutez de l'argent
```

Quand vous cliquez sur un lien, le router change la page **sans recharger tout le site** (plus rapide !).

### 🔐 Authentification avec Keycloak : La Porte d'Entrée

**Keycloak** est un système de **connexion sécurisé**.

**Analogie :**

- Imaginez un club privé avec un **videur à l'entrée**
- Le videur (Keycloak) vérifie votre **carte de membre** (token)
- Si c'est bon, vous pouvez entrer et profiter du club (accéder aux jeux)

**Comment ça fonctionne :**

1. Vous cliquez sur "Connexion"
2. Keycloak ouvre une fenêtre sécurisée
3. Vous entrez votre email et mot de passe
4. Keycloak vous donne un **token** (une clé numérique temporaire)
5. À chaque action, vous montrez ce token au backend pour prouver qui vous êtes

**Pourquoi c'est important :**

- Votre mot de passe n'est **jamais stocké** dans notre application
- Keycloak gère tout de manière **ultra-sécurisée**
- Si le token expire, Keycloak en génère un nouveau automatiquement

### 💾 Le Context API : Un Coffre-Fort Partagé

**Le Context** est comme un **coffre-fort accessible partout** dans votre application.

**Analogie :**

- Sans Context : Chaque pièce de votre maison a son propre frigo
- Avec Context : Un seul grand frigo central accessible de toutes les pièces

**Exemple dans notre projet : BalanceContext**

```typescript
// Le BalanceContext stocke votre solde (balance)
// Tous les composants peuvent lire et modifier ce solde
// Quand il change, TOUS les composants sont automatiquement mis à jour
```

**Pourquoi c'est utile :**

- Votre **balance** doit être visible partout (navbar, jeux, dashboard)
- Sans Context, il faudrait passer cette info manuellement à travers 50 composants
- Avec Context, n'importe quel composant peut y accéder directement

### 🔄 Les Hooks : Les Super-Pouvoirs de React

Les **hooks** sont des fonctions spéciales qui donnent des **super-pouvoirs** à vos composants.

**Les hooks les plus courants :**

#### `useState` : La Mémoire du Composant

```tsx
// Permet de "retenir" une valeur
const [compteur, setCompteur] = useState(0);

// compteur = la valeur actuelle (0)
// setCompteur = la fonction pour changer cette valeur

function augmenter() {
	setCompteur(compteur + 1); // Passe de 0 à 1
}
```

**Analogie :** C'est comme un **post-it** sur lequel React écrit et peut modifier

#### `useEffect` : Faire une Action au Bon Moment

```tsx
useEffect(() => {
	// Ce code s'exécute quand le composant s'affiche
	console.log("Le composant est apparu !");
}, []);
```

**Analogie :** C'est comme un **réveil** qui vous dit "Maintenant, fais ceci !"

#### `useContext` : Accéder au Coffre-Fort

```tsx
const { balance, placeBet } = useBalance();
// balance = votre argent actuel
// placeBet = fonction pour parier
```

### 📡 Les Appels API : Parler au Backend

Une **API** (Application Programming Interface) est comme un **serveur de restaurant**.

**Analogie :**

1. Vous (frontend) appelez le serveur : "Je veux un steak !"
2. Le serveur (API) transmet à la cuisine (backend)
3. La cuisine prépare le plat
4. Le serveur vous rapporte le plat

**Exemple dans notre projet :**

```typescript
// Récupérer vos données utilisateur
const response = await fetch("http://localhost:8083/users/monemail@test.com");
const userData = await response.json();
// Maintenant vous avez vos infos !
```

**Types de requêtes :**

- **GET** : "Donne-moi des infos" (lire)
- **POST** : "Enregistre ces nouvelles données" (créer)
- **PUT** : "Modifie ces données" (mettre à jour)
- **DELETE** : "Supprime ça" (supprimer)

### 📦 Les Dépendances (packages npm) : Les Outils du Développeur

Les **dépendances** sont comme des **outils dans une boîte à outils**.

**Analogie :**

- Vous voulez construire une table
- Plutôt que de fabriquer une scie vous-même, vous en **achetez une**
- Les dépendances sont des **outils tout faits** que d'autres ont créés

**Exemples dans notre projet :**

- **React** : l'outil principal pour créer l'interface
- **React Router** : l'outil pour naviguer entre les pages
- **Keycloak-js** : l'outil pour gérer la connexion
- **Stripe** : l'outil pour les paiements

**Comment les installer :**

```bash
pnpm install  # Installe tous les outils nécessaires
```

### 🏗️ Vite : Le Constructeur Rapide

**Vite** est un **outil de construction** pour votre application.

**Analogie :**

- Vous écrivez votre code (les plans de la maison)
- Vite **construit** la maison finale (assemble, optimise, compile)
- Vite a aussi un **mode développement** : il reconstruit instantanément à chaque changement

**Commandes importantes :**

```bash
pnpm dev     # Lance le mode développement (test en local)
pnpm build   # Construit la version finale (pour la production)
```

---

## 🚀 Démarrage du Projet

### Prérequis

Avant de commencer, vous devez avoir installé sur votre ordinateur :

1. **Node.js** (version 18 ou supérieure) - Le moteur JavaScript
   - Téléchargez depuis : https://nodejs.org/
2. **pnpm** - Le gestionnaire de paquets (plus rapide que npm)

   - Installez avec : `npm install -g pnpm`

3. **Keycloak** - Le serveur d'authentification (doit tourner sur le port 9090)

   - Suivre la documentation Keycloak pour l'installation

4. **Backend Spring Boot** - Le serveur (doit tourner sur le port 8083)
   - Suivre la documentation du backend SpringLuck

### Installation

1. **Ouvrir un terminal PowerShell** dans le dossier du projet

2. **Installer toutes les dépendances :**

   ```powershell
   pnpm install
   ```

   Cette commande télécharge tous les outils nécessaires (React, TypeScript, etc.)

3. **Vérifier les URLs de connexion :**
   - Keycloak doit être accessible sur : `http://localhost:9090`
   - Backend doit être accessible sur : `http://localhost:8083`

### Lancer l'Application

```powershell
pnpm dev
```

Cette commande :

- Démarre un serveur de développement local
- Ouvre automatiquement votre navigateur sur `http://localhost:5173`
- Recharge automatiquement la page à chaque modification de code

**Vous verrez dans le terminal :**

```
VITE v7.1.7  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Arrêter l'Application Proprement

Pour arrêter le serveur de développement :

1. **Dans le terminal où tourne l'application :**

   - Appuyez sur `Ctrl + C`
   - Confirmez avec `Y` (Yes) si demandé

2. **Fermer proprement le navigateur :**
   - Fermez l'onglet `http://localhost:5173`

**Ordre d'arrêt recommandé :**

1. Arrêter le frontend (ce projet) : `Ctrl + C`
2. Arrêter le backend Spring Boot
3. Arrêter Keycloak

---

## 📁 Structure du Projet : L'Architecture Complète

Voici comment le projet est organisé. Chaque dossier a un rôle précis.

```
spring-luck-front/
│
├── public/                      # Fichiers accessibles publiquement
├── src/                         # Code source principal
│   ├── components/              # Composants React (pièces LEGO)
│   ├── constants/               # Données fixes
│   ├── contexts/                # Données partagées (coffres-forts)
│   ├── keycloak/                # Configuration de l'authentification
│   ├── services/                # Communication avec le backend
│   ├── styles/                  # Fichiers CSS pour l'apparence
│   └── App.tsx                  # Composant principal
│
├── eslint.config.js             # Règles de qualité du code
├── index.html                   # Page HTML de base
├── package.json                 # Liste des dépendances
├── tsconfig.json                # Configuration TypeScript
├── vite.config.ts               # Configuration Vite
└── README.md                    # Documentation de base
```

---

## 📂 Détail des Dossiers et Fichiers

### 📁 `/` (Racine du Projet)

#### `package.json`

**Rôle :** C'est la **carte d'identité** du projet.

**Contenu principal :**

- **Nom du projet** : `spring-luck-front`
- **Scripts** : commandes disponibles
  ```json
  "dev": "vite"              → Lance le mode développement
  "build": "tsc -b && vite build" → Construit la version production
  "lint": "eslint ."         → Vérifie la qualité du code
  "preview": "vite preview"  → Prévisualise la version construite
  ```
- **Dépendances** : tous les outils nécessaires
  - `react` : La bibliothèque principale
  - `react-router-dom` : Navigation entre pages
  - `keycloak-js` : Authentification
  - `@stripe/react-stripe-js` : Paiements
  - `three`, `@react-three/fiber` : Animations 3D

**Liens avec d'autres fichiers :**

- Lu par `pnpm` lors de l'installation
- Les scripts sont exécutés via `pnpm dev`, `pnpm build`, etc.

#### `index.html`

**Rôle :** Le **squelette HTML** de base de l'application.

**Contenu :**

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>SpringLuck Casino</title>
	</head>
	<body>
		<div id="root"></div>
		<!-- React va s'injecter ici -->
		<script type="module" src="/src/main.tsx"></script>
	</body>
</html>
```

**Liens :**

- Charge `src/main.tsx` qui lance toute l'application React
- La `<div id="root">` est le point d'entrée de React

#### `vite.config.ts`

**Rôle :** Configuration de **Vite** (l'outil de build).

**Fonctions :**

- Définit les plugins (comme `@vitejs/plugin-react`)
- Configure le serveur de développement
- Optimise la construction finale

#### `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

**Rôle :** Configuration de **TypeScript**.

**Fonctions :**

- Définit les règles de compilation TypeScript
- Spécifie la version JavaScript cible
- Configure les chemins des modules

#### `eslint.config.js`

**Rôle :** Règles de **qualité du code**.

**Fonctions :**

- Détecte les erreurs potentielles
- Impose des conventions de code
- Améliore la lisibilité

---

### 📁 `/src` (Code Source)

#### `main.tsx`

**Rôle :** Le **point d'entrée** de l'application React.

**Code :**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
```

**Explications :**

1. **Trouve** la `<div id="root">` dans `index.html`
2. **Crée** un point de montage React
3. **Injecte** le composant `<App />` dedans
4. **StrictMode** : mode strict de React pour détecter les problèmes

**Liens :**

- Appelé par `index.html`
- Charge `App.tsx`

#### `App.tsx`

**Rôle :** Le **cœur de l'application**. C'est le composant principal qui orchestre tout.

**Responsabilités :**

1. **Initialise Keycloak** (système d'authentification)
2. **Synchronise l'utilisateur** avec le backend
3. **Définit toutes les routes** (pages de l'application)
4. **Enveloppe tout dans le BalanceProvider** (gestion du solde)

**Structure du code :**

```tsx
function App() {
  // 1. États
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  // 2. Initialisation Keycloak au chargement
  useEffect(() => {
    initKeycloak(
      async () => {
        // Utilisateur connecté → synchroniser avec backend
        const token = getToken();
        if (token) {
          await syncUser();
        }
        setKeycloakInitialized(true);
      },
      () => {
        // Utilisateur non connecté
        setKeycloakInitialized(true);
      }
    );
  }, []);

  // 3. Affichage pendant le chargement
  if (!keycloakInitialized) {
    return <div className="loader"></div>;
  }

  // 4. Définition des routes
  return (
    <BalanceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page d'accueil />} />
          <Route path="/game/:id" element={<GameContainer />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction/:id" element={<TransactionDetails />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </BalanceProvider>
  );
}
```

**Flux d'exécution :**

1. App démarre → Affiche un loader
2. Initialise Keycloak → Vérifie si l'utilisateur est connecté
3. Si connecté → Synchronise avec le backend
4. Keycloak initialisé → Affiche les routes
5. L'utilisateur navigue → React Router change la page

**Liens avec d'autres fichiers :**

- Importe **tous les composants** de pages
- Utilise `keycloak/keycloak.ts` pour l'auth
- Utilise `services/authService_new.ts` pour la synchro
- Utilise `contexts/BalanceContext.tsx` pour le solde
- Appelé par `main.tsx`

#### `App.css`

**Rôle :** Styles CSS globaux de l'application.

**Contenu :**

- Variables CSS (couleurs, polices)
- Styles de base (body, reset)
- Animations (loader, transitions)

---

### 📁 `/src/components` (Composants React)

Ce dossier contient toutes les **pièces LEGO** de l'interface.

#### `Navbar.tsx`

**Rôle :** La **barre de navigation** en haut de la page.

**Fonctionnalités :**

- Affiche le logo
- Menu de navigation (Accueil, Jeux, VIP)
- **Barre de recherche** pour filtrer les jeux
- **Bouton de connexion/déconnexion**
- **Affichage du solde** (balance) de l'utilisateur connecté
- Menu déroulant pour "Déposer" ou "Tableau de bord"

**États gérés :**

```tsx
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
const [searchTerm, setSearchTerm] = useState<string>("");
const [isMenuOpen, setIsMenuOpen] = useState(false);
const { balance } = useBalance(); // Récupère le solde du Context
```

**Flux :**

1. Au chargement → Vérifie si l'utilisateur est connecté
2. Si connecté → Affiche le solde et le menu utilisateur
3. Si non connecté → Affiche "Connexion"
4. La recherche filtre les jeux en temps réel

**Liens :**

- Utilise `useBalance()` du `BalanceContext`
- Utilise `login()`, `logout()`, `isAuthenticated()` de `keycloak.ts`
- Utilise la constante `GAMES` de `constants/games.ts`

#### `HeroSection.tsx`

**Rôle :** La **section héro** (bannière principale) de la page d'accueil.

**Contenu :**

- Titre accrocheur
- Description du casino
- Bouton d'appel à l'action (CTA)
- Fond animé (souvent avec Beams)

**Liens :**

- Peut utiliser `reactbits/Beams.tsx` pour les animations

#### `GameSection.tsx`

**Rôle :** La **grille de jeux** sur la page d'accueil.

**Fonctionnalités :**

- Affiche tous les jeux disponibles sous forme de cartes
- Utilise `GameCard.tsx` pour chaque jeu
- Récupère la liste des jeux depuis `constants/games.ts`

**Code simplifié :**

```tsx
function GameSection() {
	return (
		<section className="game-section">
			<h2>Nos Jeux</h2>
			<div className="games-grid">
				{GAMES.map((game) => (
					<GameCard key={game.id} game={game} />
				))}
			</div>
		</section>
	);
}
```

**Liens :**

- Utilise `GameCard.tsx`
- Importe `GAMES` de `constants/games.ts`

#### `GameCard.tsx`

**Rôle :** Une **carte de jeu** individuelle.

**Fonctionnalités :**

- Affiche l'image du jeu
- Affiche le titre et le tag (New, Hot, etc.)
- Lien vers la page du jeu (`/game/:id`)

**Props reçues :**

```tsx
interface GameCardProps {
	game: GameInfo; // {id, title, imageUrl, tag}
}
```

**Liens :**

- Utilisé par `GameSection.tsx`
- Navigue vers `GameContainer.tsx` au clic

#### `GameContainer.tsx`

**Rôle :** Le **conteneur de jeu**. C'est la page qui affiche un jeu spécifique.

**Fonctionnement :**

```tsx
const GameContainer = () => {
	const { id } = useParams<{ id: string }>(); // Récupère l'ID depuis l'URL

	const gameMap: Record<string, JSX.Element> = {
		"1": <BombOrClaat />,
		"2": <SloppyBj />,
		"3": <DiddySco />,
		"4": <RiggedPaperScissors />,
	};

	const gameComponent = gameMap[id || ""];

	if (!gameComponent) {
		return <div>Jeu non trouvé</div>;
	}

	return <div>{gameComponent}</div>;
};
```

**Flux :**

1. L'utilisateur clique sur une carte de jeu
2. Navigation vers `/game/1` (par exemple)
3. `GameContainer` récupère `id = "1"` de l'URL
4. Affiche le composant correspondant (`BombOrClaat`)

**Liens :**

- Utilise `useParams()` de React Router
- Importe tous les jeux de `components/games/`

#### `VipHeroSection.tsx`

**Rôle :** Section **VIP** pour promouvoir les offres premium.

**Contenu :**

- Message marketing VIP
- Avantages de devenir VIP
- Bouton pour accéder à la zone VIP

#### `Footer.tsx`

**Rôle :** Le **pied de page** avec liens légaux et infos.

**Contenu :**

- Liens vers "À propos", "CGU", "Contact"
- Logo
- Mentions légales
- Icônes réseaux sociaux

#### `Dashboard.tsx`

**Rôle :** Le **tableau de bord** de l'utilisateur connecté.

**Fonctionnalités :**

- Affiche les **informations personnelles** (nom, email)
- Affiche le **solde** (balance)
- Liste l'**historique des transactions** (dépôts, paris, gains)
- Possibilité de voir le détail d'une transaction

**États gérés :**

```tsx
const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [userData, setUserData] = useState<UserData | null>(null);
const [loading, setLoading] = useState(true);
```

**Flux :**

1. Vérifie si l'utilisateur est authentifié
2. Si non → Redirige vers `/`
3. Si oui → Charge les données utilisateur
4. Appelle `getUserData()` → Récupère infos + balance
5. Appelle `fetchUserTransactions()` → Récupère l'historique
6. Affiche tout dans le tableau de bord

**Liens :**

- Utilise `getUserInfo()`, `getToken()` de `keycloak.ts`
- Utilise `getUserData()` de `services/authService_new.ts`
- Utilise `fetchUserTransactions()` de `services/transactionService.ts`
- Contient `Navbar` et `Footer`

#### `DepositPage.tsx`

**Rôle :** Page pour **déposer de l'argent** sur le compte.

**Fonctionnalités :**

- Formulaire pour choisir un montant
- Intégration avec **Stripe** pour le paiement
- Création d'une transaction `DEPOSIT` dans le backend

**Flux :**

1. L'utilisateur choisit un montant (ex: 50€)
2. Clique sur "Déposer"
3. Stripe ouvre une fenêtre de paiement sécurisée
4. Paiement validé → Transaction créée dans le backend
5. Balance mise à jour automatiquement

**Liens :**

- Utilise `@stripe/react-stripe-js`
- Appelle `createTransaction()` de `transactionService.ts`
- Utilise `useBalance()` pour recharger le solde

#### `TransactionDetails.tsx`

**Rôle :** Page de **détail d'une transaction** spécifique.

**Fonctionnalités :**

- Affiche toutes les infos d'une transaction :
  - ID
  - Type (DEPOSIT, BET_PLACED, BET_WIN)
  - Montant
  - Statut
  - Date
  - Stripe Intent ID (si applicable)

**Flux :**

1. L'utilisateur clique sur une transaction dans le Dashboard
2. Navigation vers `/transaction/:id`
3. Récupère l'ID depuis l'URL
4. Charge les détails de la transaction
5. Affiche tout

#### `AdminPage.tsx`

**Rôle :** Page d'**administration** (accès restreint).

**Fonctionnalités :**

- Voir tous les utilisateurs
- Voir toutes les transactions
- Statistiques globales
- Gestion des utilisateurs

**Sécurité :**

- Accessible uniquement aux utilisateurs avec le rôle `admin` dans Keycloak

#### `BetSection.tsx`

**Rôle :** Composant réutilisable pour **placer un pari** dans un jeu.

**Fonctionnalités :**

- Champ pour entrer un montant
- Validation (montant > 0, montant <= balance)
- Appel à `placeBet()` du BalanceContext

**Props :**

```tsx
interface BetSectionProps {
	onBetPlaced: (amount: number) => void; // Callback quand le pari est placé
}
```

**Liens :**

- Utilisé par tous les jeux (BombOrClaat, SloppyBj, etc.)
- Utilise `useBalance()` du BalanceContext

#### `AuthLayout.tsx`

**Rôle :** Layout pour les pages nécessitant une **authentification**.

**Fonctionnalités :**

- Vérifie si l'utilisateur est connecté
- Si non → Redirige vers la page d'accueil
- Si oui → Affiche le contenu de la page

**Usage :**

```tsx
<AuthLayout>
	<Dashboard />
</AuthLayout>
```

---

### 📁 `/src/components/games` (Jeux)

Chaque jeu est dans son propre sous-dossier.

#### `/BombOrClaat`

**Jeu :** Désamorcer une bombe en coupant le bon fil.

**Fichiers :**

- `BombOrClaat.tsx` : Logique du jeu
- `BombOrClaat.css` : Styles du jeu

**Mécanique :**

1. L'utilisateur place un pari
2. Choisit un fil à couper (rouge, bleu, vert)
3. Si bon fil → Gagne 2x la mise
4. Si mauvais fil → Perd la mise

**Liens :**

- Utilise `useBalance()` pour `placeBet()` et `recordWin()`

#### `/SloppyBj`

**Jeu :** Blackjack simplifié.

**Fichiers :**

- `SloppyBj.tsx` : Logique principale
- `BjCard.tsx` : Composant carte
- `Dealer.tsx` : Logique du croupier
- `Player.tsx` : Logique du joueur
- `GameStatus.tsx` : Affichage du statut
- `SloppyBj.css` : Styles

**Mécanique :**

1. Pari placé
2. Distribution 2 cartes joueur + 1 carte croupier
3. Joueur choisit : Tirer / Rester
4. Croupier joue (tire jusqu'à 17)
5. Comparaison → Gagnant déterminé

#### `/DiddySco`

**Jeu :** Jeu de danse/rythme (Discothèque).

**Fichiers :**

- `DiddySco.tsx`
- `DiddySco.css`

**Mécanique :**

- Jeu basé sur le timing et les clics

#### `/RiggedPaperScissors`

**Jeu :** Pierre-Papier-Ciseaux (avec un twist).

**Fichiers :**

- `RiggedPaperScissors.tsx`
- `RiggedPaperScissors.css`

**Mécanique :**

1. Pari placé
2. Choix entre Pierre/Papier/Ciseaux
3. Ordinateur fait un choix "aléatoire"
4. Comparaison → Résultat

---

### 📁 `/src/components/reactbits`

Composants réutilisables d'animation.

#### `Beams.tsx`

**Rôle :** Animation de **faisceaux lumineux** en arrière-plan.

**Usage :**

```tsx
<Beams />
```

**Liens :**

- Utilisé dans `HeroSection`, `VipHeroSection`
- Utilise probablement `@react-three/fiber` pour du 3D

---

### 📁 `/src/constants`

Données fixes et constantes du projet.

#### `games.ts`

**Rôle :** Liste de **tous les jeux** disponibles.

**Contenu :**

```typescript
export type GameInfo = {
	id: number;
	title: string;
	imageUrl: string;
	tag?: string; // "New", "Hot", etc.
};

export const GAMES: GameInfo[] = [
	{
		id: 1,
		title: "Bomb or Claat",
		imageUrl: "/icons/BombOrClaat.svg",
		tag: "New",
	},
	{ id: 2, title: "Sloppy BJ", imageUrl: "/icons/SloppyBJ.svg", tag: "Hot" },
	{ id: 3, title: "Diddy Scothèque", imageUrl: "/icons/diddySco.svg" },
	{
		id: 4,
		title: "Rigged Paper Scissors",
		imageUrl: "/icons/rigged-paper-scissors.svg",
	},
];
```

**Utilisation :**

- Importé par `GameSection.tsx` pour afficher tous les jeux
- Importé par `Navbar.tsx` pour la recherche
- Référence pour `GameContainer.tsx` (mapping ID → composant)

**Avantages :**

- **Centralisé** : pour ajouter un jeu, on modifie juste ce fichier
- **Type-safe** : TypeScript garantit la structure

---

### 📁 `/src/contexts`

Gestion des **états globaux** partagés.

#### `BalanceContext.tsx`

**Rôle :** Gère le **solde de l'utilisateur** globalement.

**Pourquoi un Context ?**

- Le solde doit être accessible **partout** (Navbar, jeux, Dashboard)
- Doit se **mettre à jour automatiquement** après chaque transaction
- Évite de passer la balance manuellement à travers 50 composants

**États exposés :**

```typescript
interface BalanceContextType {
	balance: number; // Solde actuel (en €)
	isLoadingBalance: boolean; // Chargement en cours ?
	reloadBalance: () => Promise<void>; // Recharger depuis le backend
	placeBet: (amount: number) => Promise<boolean>; // Placer un pari
	recordWin: (winAmount: number) => Promise<boolean>; // Enregistrer un gain
}
```

**Fonctionnement :**

1. **Au chargement de l'app :**

   ```tsx
   useEffect(() => {
   	loadInitialBalance(); // Charge la balance depuis le backend
   }, []);
   ```

2. **Placer un pari :**

   ```tsx
   async function placeBet(amount: number): Promise<boolean> {
   	if (amount <= 0 || amount > balance) return false;

   	await createTransaction(amount, "BET_PLACED"); // Backend
   	await reloadBalance(); // Recharge la balance
   	return true;
   }
   ```

3. **Enregistrer un gain :**
   ```tsx
   async function recordWin(winAmount: number): Promise<boolean> {
   	await createTransaction(winAmount, "BET_WIN");
   	await reloadBalance();
   	return true;
   }
   ```

**Utilisation dans un composant :**

```tsx
function MonComposant() {
	const { balance, placeBet, recordWin } = useBalance();

	const handleBet = async () => {
		const success = await placeBet(10); // Parie 10€
		if (success) {
			console.log("Pari placé !");
		}
	};

	return <div>Balance: {balance}€</div>;
}
```

**Liens :**

- Utilise `getUserData()` de `authService_new.ts`
- Utilise `createTransaction()` de `transactionService.ts`
- Wrap toute l'app dans `App.tsx`
- Utilisé par tous les composants qui ont besoin de la balance

---

### 📁 `/src/keycloak`

Configuration et interaction avec **Keycloak**.

#### `keycloak.ts`

**Rôle :** **Interface unique** pour toute l'authentification.

**Fonctions principales :**

1. **`initKeycloak(onAuthSuccess, onAuthError)`**

   ```typescript
   // Initialise Keycloak au démarrage de l'app
   initKeycloak(
   	() => console.log("Utilisateur connecté"),
   	() => console.log("Utilisateur non connecté")
   );
   ```

   - Vérifie si un token existe (SSO silencieux)
   - Si oui → Appelle `onAuthSuccess`
   - Si non → Appelle `onAuthError`

2. **`login()`**

   ```typescript
   // Redirige vers la page de connexion Keycloak
   login();
   ```

   - Ouvre la page Keycloak
   - Après connexion → Revient sur le Dashboard

3. **`register()`**

   ```typescript
   // Redirige vers la page d'inscription Keycloak
   register();
   ```

4. **`logout()`**

   ```typescript
   // Déconnecte l'utilisateur
   logout();
   ```

   - Supprime le token
   - Revient sur la page d'accueil

5. **`isAuthenticated()`**

   ```typescript
   // Vérifie si l'utilisateur est connecté
   if (isAuthenticated()) {
   	// Utilisateur connecté
   }
   ```

6. **`getToken()`**

   ```typescript
   // Récupère le token JWT
   const token = getToken();
   ```

   - Utilisé pour les appels API sécurisés

7. **`getUserInfo()`**
   ```typescript
   // Récupère les infos de l'utilisateur depuis le token
   const user = getUserInfo();
   // { email: "user@example.com", name: "John Doe", sub: "123" }
   ```

**Configuration Keycloak :**

```typescript
const keycloak = new Keycloak({
	url: "http://localhost:9090", // URL du serveur Keycloak
	realm: "springluck", // Nom du realm
	clientId: "springluck-app", // ID de l'application cliente
});
```

**Rafraîchissement automatique du token :**

```typescript
keycloak.onTokenExpired = () => {
	keycloak
		.updateToken(70) // Rafraîchit si expire dans moins de 70s
		.then((refreshed) => {
			if (refreshed) console.log("Token rafraîchi");
		})
		.catch(() => console.error("Échec du rafraîchissement"));
};
```

**Liens :**

- Utilisé par `App.tsx` pour l'initialisation
- Utilisé par `Navbar.tsx` pour login/logout
- Utilisé par tous les composants nécessitant l'authentification
- Utilise `services/authService_new.ts` après connexion

---

### 📁 `/src/services`

Communication avec le **backend Spring Boot**.

#### `authService_new.ts`

**Rôle :** Gère les **utilisateurs** et leur **synchronisation** avec le backend.

**Fonctions principales :**

1. **`syncUser()`**

   ```typescript
   // Synchronise l'utilisateur Keycloak avec le backend
   const success = await syncUser();
   ```

   **Flux :**

   - Récupère l'email depuis le token Keycloak
   - Envoie un POST à `/users/sync` avec l'email
   - Le backend crée ou met à jour l'utilisateur
   - Retourne `true` si succès, `false` si échec

   **Quand l'utiliser :**

   - Juste après la connexion Keycloak
   - Pour s'assurer que l'utilisateur existe dans la base de données

2. **`getUserData()`**
   ```typescript
   // Récupère les données de l'utilisateur
   const userData = await getUserData();
   // { id: "123", balance: 5000 }  (balance en centimes)
   ```
   **Flux :**
   - Récupère l'email depuis le token
   - Appelle GET `/users/{email}`
   - Retourne les infos utilisateur (dont la balance)

**Code détaillé :**

```typescript
export const syncUser = async (): Promise<boolean> => {
	if (!isAuthenticated()) return false;

	const userInfo = getUserInfo();
	if (!userInfo || !userInfo.email) return false;

	const response = await fetch(`${API_BASE_URL}/users/sync`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify({ email: userInfo.email }),
	});

	return response.ok;
};
```

**Liens :**

- Appelé par `App.tsx` après l'initialisation Keycloak
- Utilisé par `Dashboard.tsx` pour charger les données
- Utilise `keycloak.ts` pour l'authentification

#### `transactionService.ts`

**Rôle :** Gère les **transactions** (paris, gains, dépôts).

**Fonctions principales :**

1. **`fetchUserTransactions(userId, token)`**

   ```typescript
   // Récupère l'historique des transactions
   const transactions = await fetchUserTransactions("user-123", token);
   ```

   **Retour :**

   ```typescript
   [
   	{
   		id: "tx-1",
   		userId: "user-123",
   		amount: 1000, // En centimes (10€)
   		type: "BET_PLACED",
   		status: "COMPLETED",
   		date: "2024-12-27T10:30:00Z",
   	},
   	// ...
   ];
   ```

2. **`createTransaction(amount, type)`**
   ```typescript
   // Crée une nouvelle transaction
   await createTransaction(10, "BET_PLACED"); // Pari de 10€
   await createTransaction(20, "BET_WIN"); // Gain de 20€
   await createTransaction(50, "DEPOSIT"); // Dépôt de 50€
   ```
   **Flux :**
   - Récupère l'email et le token de l'utilisateur connecté
   - Appelle POST `/users/transaction?email=...&type=...&amount=...`
   - Le backend met à jour la balance automatiquement

**Types de transactions :**

- `BET_PLACED` : Pari placé (soustrait de la balance)
- `BET_WIN` : Gain enregistré (ajouté à la balance)
- `DEPOSIT` : Dépôt d'argent (ajouté à la balance)
- `WITHDRAWAL` : Retrait d'argent (soustrait de la balance)

**Liens :**

- Utilisé par `BalanceContext.tsx` pour `placeBet()` et `recordWin()`
- Utilisé par `Dashboard.tsx` pour afficher l'historique
- Utilisé par `DepositPage.tsx` pour créer un dépôt

---

### 📁 `/src/styles`

Fichiers CSS pour le **design** des composants.

**Organisation :**

- Chaque composant a son propre fichier CSS
- Exemple : `Navbar.tsx` → `Navbar.css`

**Fichiers principaux :**

- `AdminPage.css` : Styles de la page admin
- `BetSection.css` : Styles de la section de pari
- `Dashboard.css` : Styles du tableau de bord
- `DepositPage.css` : Styles de la page de dépôt
- `Footer.css` : Styles du pied de page
- `GameSection.css` : Styles de la grille de jeux
- `HeroSection.css` : Styles de la bannière héro
- `Navbar.css` : Styles de la barre de navigation
- `TransactionDetails.css` : Styles des détails de transaction
- `VipHeroSection.css` : Styles de la section VIP

**Convention :**

```css
/* Utilisation de classes BEM (Block Element Modifier) */
.navbar {
}
.navbar__logo {
}
.navbar__menu {
}
.navbar__menu--open {
}
```

---

### 📁 `/public`

Fichiers **publics** accessibles directement.

#### `silent-check-sso.html`

**Rôle :** Page utilisée par Keycloak pour le **SSO silencieux**.

**Fonction :**

- Keycloak ouvre cette page dans un iframe invisible
- Vérifie si l'utilisateur a déjà une session active
- Si oui → Connexion automatique sans popup

#### `/icons`

**Contenu :** Icônes SVG des jeux

- `BombOrClaat.svg`
- `SloppyBJ.svg`
- `diddySco.svg`
- `rigged-paper-scissors.svg`

#### `/images`

**Contenu :** Images diverses (bannières, backgrounds, etc.)

#### `/symbols`

**Contenu :** Symboles et logos

---

## 🔗 Relations et Flux de Données

### 🎯 Flux d'Authentification

```
1. Utilisateur arrive sur le site
         ↓
2. App.tsx s'initialise
         ↓
3. App.tsx appelle initKeycloak() (keycloak.ts)
         ↓
4. Keycloak vérifie si un token existe
         ↓
5a. Token trouvé → Utilisateur connecté
    ↓
    → App.tsx appelle syncUser() (authService_new.ts)
    → Backend crée/met à jour l'utilisateur
    → App.tsx affiche les routes

5b. Pas de token → Utilisateur non connecté
    → App.tsx affiche les routes (accès limité)
```

### 💰 Flux de Gestion du Solde

```
1. BalanceProvider s'initialise (au chargement de App.tsx)
         ↓
2. Appelle getUserData() → Récupère la balance initiale
         ↓
3. Stocke la balance dans le Context
         ↓
4. Tous les composants peuvent accéder via useBalance()
         ↓
5. Utilisateur place un pari dans un jeu
         ↓
6. Jeu appelle placeBet(10) du BalanceContext
         ↓
7. BalanceContext appelle createTransaction(10, "BET_PLACED")
         ↓
8. Backend met à jour la balance
         ↓
9. BalanceContext appelle reloadBalance()
         ↓
10. Tous les composants utilisant useBalance() sont mis à jour automatiquement
    (Navbar affiche la nouvelle balance, etc.)
```

### 🎮 Flux de Jeu

```
1. Utilisateur sur la page d'accueil (/)
         ↓
2. GameSection.tsx affiche les jeux (depuis constants/games.ts)
         ↓
3. Utilisateur clique sur "Bomb or Claat"
         ↓
4. React Router navigue vers /game/1
         ↓
5. GameContainer.tsx récupère id=1 depuis l'URL
         ↓
6. GameContainer affiche <BombOrClaat />
         ↓
7. BombOrClaat.tsx affiche l'interface du jeu
         ↓
8. Utilisateur place un pari de 10€
         ↓
9. BombOrClaat appelle placeBet(10) (via useBalance())
         ↓
10. BalanceContext crée une transaction BET_PLACED
         ↓
11. Backend valide et met à jour la balance
         ↓
12. Utilisateur joue (choisit un fil)
         ↓
13. Résultat calculé (gain ou perte)
         ↓
14a. Si gain → BombOrClaat appelle recordWin(20)
     → BalanceContext crée une transaction BET_WIN
     → Backend ajoute 20€ à la balance

14b. Si perte → Rien à faire (le pari a déjà été déduit)
         ↓
15. Balance mise à jour partout dans l'app
```

### 📊 Flux du Dashboard

```
1. Utilisateur clique sur "Tableau de bord"
         ↓
2. React Router navigue vers /dashboard
         ↓
3. Dashboard.tsx vérifie isAuthenticated()
         ↓
4a. Non authentifié → Redirige vers /

4b. Authentifié → Continue
         ↓
5. Dashboard appelle getUserData() (authService_new.ts)
   → Récupère infos utilisateur + balance
         ↓
6. Dashboard appelle fetchUserTransactions() (transactionService.ts)
   → Récupère l'historique
         ↓
7. Dashboard affiche tout dans un tableau
         ↓
8. Utilisateur clique sur une transaction
         ↓
9. React Router navigue vers /transaction/:id
         ↓
10. TransactionDetails.tsx affiche le détail
```

---

## 🧪 Comment Fonctionne l'Application (Vue d'Ensemble)

### Architecture Générale

```
Frontend (React)          Backend (Spring Boot)         Keycloak
     ↓                            ↓                          ↓
┌─────────────┐           ┌─────────────┐            ┌─────────────┐
│   Navbar    │           │   Users     │            │   Auth      │
│   Games     │   ←HTTP→  │   Transactions│  ←HTTP→  │   Tokens    │
│   Dashboard │           │   Balance   │            │   Roles     │
└─────────────┘           └─────────────┘            └─────────────┘
```

### Technologies Utilisées

| Technologie      | Rôle              | Analogie                  |
| ---------------- | ----------------- | ------------------------- |
| **React**        | Créer l'interface | Les briques LEGO          |
| **TypeScript**   | Typage du code    | La ceinture de sécurité   |
| **React Router** | Navigation        | Le GPS                    |
| **Keycloak**     | Authentification  | Le videur du club         |
| **Context API**  | État global       | Le coffre-fort partagé    |
| **Vite**         | Build tool        | L'usine de construction   |
| **Stripe**       | Paiements         | Le terminal de paiement   |
| **CSS**          | Design            | La peinture et décoration |

### Cycle de Vie d'une Session Utilisateur

1. **Arrivée sur le site :**

   - App.tsx initialise Keycloak
   - Vérifie si un token existe
   - Si oui → Auto-connexion
   - Si non → Affichage normal

2. **Connexion :**

   - Clic sur "Connexion" dans la Navbar
   - Redirection vers Keycloak (page externe sécurisée)
   - Saisie email/mot de passe
   - Keycloak génère un token JWT
   - Retour sur le site avec le token
   - App.tsx synchronise avec le backend
   - Backend crée/met à jour l'utilisateur

3. **Navigation :**

   - Clic sur un lien
   - React Router change la page SANS recharger
   - Composant correspondant s'affiche

4. **Jeu :**

   - Clic sur un jeu → GameContainer → Composant du jeu
   - Place un pari → createTransaction("BET_PLACED")
   - Joue → Logique du jeu (local)
   - Résultat → createTransaction("BET_WIN") si gain
   - Balance mise à jour partout

5. **Dépôt d'argent :**

   - DepositPage → Formulaire Stripe
   - Paiement validé → createTransaction("DEPOSIT")
   - Balance augmente

6. **Déconnexion :**
   - Clic sur "Déconnexion"
   - Keycloak supprime le token
   - Retour à la page d'accueil
   - Accès limité (pas de jeux, pas de dashboard)

---

## 🛠️ Commandes Utiles

### Développement

```powershell
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Vérifier la qualité du code
pnpm lint

# Construire la version de production
pnpm build

# Prévisualiser la version de production
pnpm preview
```

### Gestion des Dépendances

```powershell
# Ajouter une nouvelle dépendance
pnpm add nom-du-package

# Ajouter une dépendance de développement
pnpm add -D nom-du-package

# Supprimer une dépendance
pnpm remove nom-du-package

# Mettre à jour toutes les dépendances
pnpm update
```

---

## 🐛 Debugging et Résolution de Problèmes

### Problème : "Keycloak ne s'initialise pas"

**Symptômes :** Le loader tourne indéfiniment

**Solutions :**

1. Vérifier que Keycloak tourne sur `http://localhost:9090`
2. Vérifier les logs de la console (`F12` → Console)
3. Vérifier la configuration dans `keycloak/keycloak.ts`

### Problème : "Balance ne se met pas à jour"

**Solutions :**

1. Vérifier que le backend tourne sur `http://localhost:8083`
2. Vérifier les logs de la console pour les erreurs API
3. Vérifier que le token est valide (`getToken()` dans la console)

### Problème : "Les jeux ne s'affichent pas"

**Solutions :**

1. Vérifier que les icônes existent dans `/public/icons/`
2. Vérifier le fichier `constants/games.ts`
3. Vérifier la console pour les erreurs d'import

---

## 📝 Bonnes Pratiques

### Organisation du Code

1. **Un composant = Un fichier**
2. **Nommage clair** : `UserProfile.tsx`, pas `Component1.tsx`
3. **Dossiers par fonctionnalité** : tous les fichiers d'un jeu dans `/games/NomDuJeu/`

### Gestion des États

1. **État local** : `useState` si l'état n'est utilisé que dans un composant
2. **État global** : Context API si l'état est partagé
3. **Serveur** : Toujours recharger depuis le backend pour les données critiques (balance)

### Sécurité

1. **Toujours vérifier l'authentification** côté backend
2. **Ne jamais stocker de données sensibles** dans le localStorage
3. **Toujours utiliser HTTPS** en production
4. **Valider les montants** côté backend (pas seulement frontend)

---

## 🚀 Déploiement en Production

### Étapes

1. **Construire l'application :**

   ```powershell
   pnpm build
   ```

   Cela crée un dossier `/dist` avec les fichiers optimisés.

2. **Configurer les URLs de production :**

   - Modifier `keycloak/keycloak.ts` : changer `http://localhost:9090` par l'URL de prod
   - Modifier `services/*.ts` : changer `http://localhost:8083` par l'URL de prod

3. **Déployer les fichiers :**

   - Copier le contenu de `/dist` sur votre serveur web (Nginx, Apache, etc.)

4. **Configurer le serveur web :**
   - Toutes les routes doivent pointer vers `index.html` (pour React Router)

---

## 📚 Ressources et Documentation Externe

### React

- Documentation officielle : https://react.dev/
- Tutorial interactif : https://react.dev/learn

### TypeScript

- Documentation : https://www.typescriptlang.org/docs/

### React Router

- Documentation : https://reactrouter.com/

### Keycloak

- Documentation : https://www.keycloak.org/documentation

### Stripe

- Documentation React : https://stripe.com/docs/stripe-js/react

### Vite

- Documentation : https://vite.dev/

---

## 🎓 Conclusion

Vous avez maintenant une compréhension complète de l'application SpringLuck :

1. **Les concepts de base** : React, TypeScript, routing, authentification, Context
2. **La structure du projet** : chaque dossier et fichier a un rôle précis
3. **Les flux de données** : comment les informations circulent
4. **Comment démarrer et arrêter** le projet
5. **Comment débugger** les problèmes courants

**Pour aller plus loin :**

- Expérimentez en modifiant du code
- Ajoutez un nouveau jeu en suivant la structure existante
- Consultez les documentations officielles pour approfondir

**N'oubliez pas :**

- Toujours tester localement avant de déployer
- Commenter votre code pour les futurs développeurs
- Demander de l'aide si vous êtes bloqué

Bon développement ! 🎉
