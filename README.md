# 🎓 Gestion des Étudiants — Frontend (React)

Interface web pour la gestion des étudiants, bulletins, matières et examens — connectée à l'API Spring Boot.

## 📋 Sommaire

- Technologies utilisées
- Prérequis
- Installation
- Lancer le projet
- Comptes de test
- Structure du projet

---

## 🛠 Technologies utilisées

 Technologie 

1. React 18 : Bibliothèque d'interface utilisateur 
2. React Router : Navigation entre les pages 
3. Axios : Appels HTTP vers l'API backend 
4. React Toastify : Notifications visuelles 
5. jsPDF + html2canvas : Génération de bulletins en PDF 

---

## ✅ Prérequis

1. Node.js (version 18 ou plus) → [Télécharger ici](https://nodejs.org/)
2. Le backend Spring Boot doit être démarré (voir [gestion-etudiants-backend](https://github.com/dmmouctar/gestion-etudiants-backend))
3. Un éditeur de code, (VS Code) -> (https://code.visualstudio.com/)

Pour vérifier que Node.js est installé :
```bash
node -v
npm -v
```

---

## 📥 Installation pas à pas

### 1. Cloner le projet

```bash
git clone https://github.com/dmmouctar/gestion-etudiants-frontend.git
cd gestion-etudiants-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Vérifier la configuration de l'API

Le fichier `src/api/axios.js` pointe par défaut vers :
```js
baseURL: 'http://localhost:8080/api'
```

Si votre backend tourne sur une autre adresse, modifiez cette ligne.

---

## ▶️ Lancer le projet

⚠️ **Le backend Spring Boot doit déjà être démarré** avant de lancer le frontend (voir le [README du backend](https://github.com/dmmouctar/gestion-etudiants-backend)).

Dans le terminal, à la racine du projet :

```bash
npm start
```

Le projet s'ouvre automatiquement sur (http://localhost:3000)

---

## 🔑 Comptes de test

**Administrateur :**
1. Email : admin@school.ma 
2. Mot de passe : Admin@1234


**Étudiant** (créé via l'interface admin après le premier lancement) :
> Connectez-vous en admin → Étudiants → Nouvel étudiant → renseignez un email + mot de passe de compte → utilisez ces identifiants pour tester le rôle étudiant.

---

## 📁 Structure du projet

```
src/
├── api/              → Fonctions d'appel à l'API (axios)
├── context/          → Gestion de l'authentification (AuthContext)
├── components/       → Composants réutilisables (Sidebar, Navbar, Spinner...)
├── pages/
│   ├── auth/         → Page de connexion
│   ├── admin/        → Toutes les pages de l'administrateur
│   └── etudiant/     → Toutes les pages de l'étudiant
└── styles/           → CSS global (responsive inclus)
```

---

## 📱 Fonctionnalités principales

- ✅ Authentification sécurisée (JWT) avec rôles ADMIN / ÉTUDIANT
- ✅ Gestion complète des étudiants, filières, matières, examens
- ✅ Saisie des notes et calcul automatique des moyennes pondérées
- ✅ Génération et validation des bulletins
- ✅ **Impression des bulletins en PDF**
- ✅ **Photo de profil personnalisée** par utilisateur
- ✅ Interface **responsive** (mobile, tablette, desktop)

---

## 🔗 Projets liés

- Backend Spring Boot : [gestion-etudiants-backend](https://github.com/dmmouctar/gestion-etudiants-backend)
- Base de données : [gestion-etudiants-database](https://github.com/dmmouctar/gestion-etudiants-database)

---

## 👤 Auteur

**Mamadou Mouctar Diallo**
