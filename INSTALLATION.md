# 🚀 Installation et premiers pas

## ⚡ Accès immédiat (Recommandé)

Pas d'installation nécessaire ! Ouvrez simplement :

👉 **https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/**

L'application fonctionne directement dans votre navigateur. Vos données restent **100% locales** sur votre machine.

---

## 💻 Installation locale (Optionnel)

Si vous préférez une version locale sans Internet :

### Option 1 : Simplement ouvrir le fichier

```bash
# 1. Clonez ou téléchargez le repo
git clone https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer.git
cd IBKR-Portfolio-Analyzer

# 2. Ouvrez index.html dans votre navigateur
# Sous Windows : double-cliquez sur index.html
# Sous Mac : double-cliquez sur index.html
# Sous Linux : firefox index.html (ou votre navigateur préféré)
```

### Option 2 : Serveur local (Python)

```bash
# Python 3
python -m http.server 8000

# Puis ouvrez : http://localhost:8000
```

### Option 3 : Serveur local (Node.js)

```bash
# Avec http-server
npm install -g http-server
http-server

# Puis ouvrez : http://localhost:8080
```

---

## 🎯 Premier démarrage

### Étape 1 : Importer vos données IBKR

1. Ouvrez l'app : https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/
2. Cliquez sur **"📂 Importer CSV"** (menu gauche)
3. Cliquez **"Sélectionner fichiers..."**
4. Choisissez vos CSV IBKR (vous pouvez en sélectionner plusieurs)
5. Cliquez **"📤 Consolider les données"**

✅ Vos données sont sauvegardées automatiquement !

### Étape 2 : Explorer vos données

1. Cliquez sur **"🔍 Explorer"** (menu gauche)
2. Sélectionnez une catégorie dans le dropdown
3. Consultez vos transactions

### Étape 3 : Consulter les statistiques

1. Cliquez sur **"📊 Statistiques"** (menu gauche)
2. Visualisez :
   - Nombre total de transactions
   - Répartition par année
   - Répartition par catégorie IBKR

---

## 📤 Utiliser avec Google Sheets (FlexQuery)

### Vue générale du flux

```
Navigateur (App IBKR)
      ↓
  IndexedDB (vos données locales)
      ↓
  Exporter en JSON
      ↓
  GitHub (fichier data.json)
      ↓
  Google Sheets (FlexQuery)
      ↓
  Déclaration fiscale
```

### Configuration rapide

#### 1. Exporter vos données

1. Allez dans **"⚙️ Paramètres"**
2. Cliquez **"📥 Exporter en JSON"**
3. Un fichier `ibkr-portfolio-AAAA-MM-JJ.json` se télécharge

#### 2. Uploader sur GitHub

1. Allez sur : https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer
2. Cliquez **"Add file"** → **"Upload files"** (ou créer `data.json`)
3. Uploadez votre JSON
4. Cliquez **"Commit changes"**

#### 3. Utiliser dans Google Sheets

Dans une cellule Google Sheets :

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT date, symbole, categorie, montant FROM transactions ORDER BY date DESC"
)
```

👉 **Guide complet** : Voir [FLEXQUERY_GUIDE.md](FLEXQUERY_GUIDE.md)

---

## 🔒 Sécurité et données

### ✅ Vos données restent privées

- **Aucun serveur** ne reçoit vos données
- **IndexedDB** = base de données locale du navigateur
- **Pas de cloud** sauf si vous l'activez explicitement

### 📁 Où sont mes données ?

- **Navigateur** : `F12` → **Application** → **IndexedDB** → **IBKRPortfolio**
- **Exported** : Fichier JSON sur votre ordinateur + GitHub (facultatif)

### 🔐 Partager avec d'autres

L'URL publique fonctionne pour tout le monde :
- Chacun a **sa propre IndexedDB locale**
- Les données ne sont **jamais partagées**
- Vous pouvez partager l'app sans risque

---

## 🛠️ Dépannage

### ❌ "Les fichiers CSV ne se chargent pas"

**Solution :**
- Vérifiez que le fichier est bien un CSV (`.csv`)
- Vérifiez qu'il vient bien d'IBKR (format CSV compatible)
- Essayez avec un seul fichier d'abord

### ❌ "IndexedDB n'apparaît pas"

**Solution :**
- Ouvrez `F12` (DevTools)
- Allez sur l'onglet **"Application"**
- Développez **"IndexedDB"** dans le menu gauche
- Cherchez **"IBKRPortfolio"**

### ❌ "FlexQuery ne trouve pas le JSON"

**Solution :**
- Vérifiez que l'URL est en **raw.githubusercontent.com** (pas github.com)
- Assurez-vous que le fichier `data.json` existe sur GitHub
- Testez l'URL dans le navigateur : elle doit afficher du JSON

### ❌ "Je n'arrive pas à charger depuis le stockage local"

**Solution :**
1. Réimportez vos CSV
2. Cliquez "Consolider les données"
3. L'app sauvegarde automatiquement

---

## 🚀 Fonctionnalités disponibles

| Feature | État | Notes |
|---------|------|-------|
| **Import CSV** | ✅ Fait | Lecture et consolidation multi-fichiers |
| **Stockage local** | ✅ Fait | IndexedDB + persistance |
| **Explorer données** | ✅ Fait | Affichage par catégorie |
| **Statistiques** | ✅ Fait | Vue d'ensemble + détails |
| **Export JSON** | ⏳ Prochainement | Pour FlexQuery |
| **Export CSV** | ⏳ Prochainement | Pour Excel |
| **Détection roulements** | 🔄 En cours | Identification auto |
| **Calcul IFU** | 🚀 Planifié | Génération déclaration fiscale |
| **Retenues USA** | 🚀 Planifié | Calcul 28% dividendes |
| **Graphiques** | 🚀 Planifié | Visualisation P&L |

---

## 📚 Documentation

- **[README.md](README.md)** : Vue d'ensemble du projet
- **[FLEXQUERY_GUIDE.md](FLEXQUERY_GUIDE.md)** : Guide détaillé Google Sheets
- **[index.html](index.html)** : Application principale

---

## 💡 Cas d'usage courants

### 📋 Préparation déclaration fiscale

```
1. Fin décembre : exporter CSV depuis IBKR
2. Importer dans l'app
3. Consulter statistiques (année complète)
4. Exporter en JSON
5. Charger dans Google Sheets
6. Remplir déclaration (IFU 2086)
```

### 📊 Suivi mensuel portefeuille

```
1. Chaque fin de mois : exporter CSV récent depuis IBKR
2. Importer dans l'app (dédoublonnage automatique)
3. Consulter "Roulements" pour options
4. Mettre à jour JSON sur GitHub
5. Google Sheets rafraîchit automatiquement
```

### 🔄 Gestion multi-années

```
1. Créer un fichier JSON par année
2. GitHub peut héberger data-2024.json, data-2025.json, data-2026.json
3. FlexQuery peut charger plusieurs années
4. Comparer fiscalité année par année
```

---

## ⚙️ Configuration avancée (Optionnel)

### Personnaliser les colonnes du mapping

Éditez `COLUMN_MAPPING` dans `index.html` :

```javascript
const COLUMN_MAPPING = {
    "Transactions": {
        dateCol: 1,      // Colonne "Date"
        heureCol: 2,     // Colonne "Time"
        symbolCol: 3,    // Colonne "Symbol"
        montantCol: 6    // Colonne "Amount"
    },
    // Ajouter d'autres catégories...
};
```

### Héberger le JSON en privé

Au lieu de GitHub public, utilisez :
- **Dropbox** : https://dl.dropboxusercontent.com/...
- **Google Drive** : Partage public
- **OneDrive** : Partage public

---

## 📞 Support et contribution

### 🐛 Signaler un bug

1. Allez sur : https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/issues
2. Cliquez "New Issue"
3. Décrivez le problème

### 💡 Suggérer une amélioration

Créez une Issue avec le tag **"enhancement"**

### 🤝 Contribuer au code

1. Fork le repo
2. Créez une branche : `git checkout -b feature/ma-feature`
3. Commitez : `git commit -m "Ajout de..."`
4. Pushez : `git push origin feature/ma-feature`
5. Créez une Pull Request

---

## 📜 Licence

MIT - Libre d'utilisation

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-09-09  
**Statut** : En développement actif ✨
