# 🔗 Guide FlexQuery - Intégration Google Sheets

## 🎯 Objectif
Utiliser **FlexQuery** pour charger automatiquement les données de l'analyseur IBKR dans Google Sheets avec mise à jour en temps réel.

---

## 📋 Prérequis

1. ✅ **Application IBKR Analyzer** en ligne sur GitHub Pages
   - URL : `https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/`

2. ✅ **Google Sheets** avec accès à FlexQuery
   - FlexQuery est disponible dans Sheets (Données > FlexQuery)

3. ✅ **Fichier JSON d'export** hébergé sur GitHub
   - À créer avec le bouton "Exporter JSON" de l'app

---

## 🔄 Flux d'utilisation

```
📁 IBKR (fichiers CSV)
        ↓
🌐 Analyseur (index.html sur GitHub Pages)
        ↓
📤 Export JSON (data.json sur GitHub)
        ↓
📊 Google Sheets (FlexQuery charge les données)
        ↓
📋 Déclaration fiscale + Synthèse
```

---

## ⚙️ Configuration étape par étape

### Étape 1 : Importer vos données dans l'analyseur

1. Allez sur : **https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/**
2. Cliquez sur **"📂 Importer CSV"** dans le menu gauche
3. Sélectionnez tous vos fichiers CSV IBKR
4. Cliquez **"📤 Consolider les données"**
5. ✅ Les données sont sauvegardées en **IndexedDB** (navigateur)

### Étape 2 : Exporter en JSON

*À faire une fois les données chargées :*

1. Cliquez sur **"⚙️ Paramètres"**
2. Cliquez **"📥 Exporter données en JSON"** *(bouton à ajouter)*
3. Un fichier `ibkr-portfolio.json` se télécharge
4. Ouvrez-le et **copiez tout le contenu**

### Étape 3 : Héberger le JSON sur GitHub

1. Allez sur : https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer
2. Cliquez sur **"Add file"** → **"Create new file"**
3. Nommez-le : `data.json`
4. Collez le contenu JSON
5. Cliquez **"Commit changes"**

### Étape 4 : Utiliser l'URL brute dans FlexQuery

L'URL brute du JSON est :
```
https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json
```

---

## 🎯 Formules FlexQuery pour Google Sheets

### 1️⃣ Charger toutes les transactions

Dans une cellule vide (ex: `A1`) :

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT id, date, symbole, categorie, montant FROM transactions ORDER BY date DESC"
)
```

**Résultat :**
| id | date | symbole | categorie | montant |
|---|---|---|---|---|
| a1b2c3d4 | 2026-09-08 | AAPL | Transactions | 1250.50 |
| ... | ... | ... | ... | ... |

---

### 2️⃣ Transactions par année

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT SUBSTR(date, 1, 4) as annee, COUNT(*) as nb_transactions, SUM(montant) as total 
   FROM transactions 
   GROUP BY SUBSTR(date, 1, 4) 
   ORDER BY annee DESC"
)
```

---

### 3️⃣ Transactions par catégorie IBKR

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT categorie, COUNT(*) as nombre, SUM(montant) as total_eur 
   FROM transactions 
   GROUP BY categorie 
   ORDER BY nombre DESC"
)
```

---

### 4️⃣ Dividendes uniquement

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT date, symbole, montant 
   FROM transactions 
   WHERE categorie = 'Dividendes' 
   ORDER BY date DESC"
)
```

---

### 5️⃣ Transactions USA (FOREX + Intérêts)

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT date, symbole, montant 
   FROM transactions 
   WHERE categorie IN ('Forex', 'Intérêt') 
   ORDER BY date DESC"
)
```

---

### 6️⃣ Montants par symbole (résumé portefeuille)

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json",
  "SELECT symbole, COUNT(*) as operations, SUM(montant) as total_eur 
   FROM transactions 
   GROUP BY symbole 
   HAVING total_eur <> 0 
   ORDER BY total_eur DESC"
)
```

---

## 🔄 Mise à jour automatique

### ✅ Rafraîchir FlexQuery dans Google Sheets

1. Les formules se mettent à jour **toutes les 6-24 heures** automatiquement
2. Pour forcer le rafraîchissement immédiat :
   - Sélectionnez la cellule
   - Cliquez **Données** > **FlexQuery** > **Actualiser**

### ✅ Mettre à jour le JSON source

1. Chaque mois, réexportez les données depuis l'analyseur
2. Remplacez le fichier `data.json` sur GitHub
3. FlexQuery se rafraîchira automatiquement

---

## 📊 Exemple de tableau de bord Google Sheets

Voici une structure recommandée :

```
FEUILLE 1 : "Dashboard"
├── Vue d'ensemble
│   ├── Total transactions : =COUNTA(Données!A:A) - 1
│   ├── Total montant : =SUM(Données!E:E)
│   └── Dernière mise à jour : =NOW()
│
├── Résumé par année
│   └── [Formule FlexQuery #2]
│
└── Résumé par catégorie
    └── [Formule FlexQuery #3]

FEUILLE 2 : "Données"
├── [Toutes les transactions via FlexQuery #1]

FEUILLE 3 : "Dividendes"
├── [Dividendes uniquement via FlexQuery #4]

FEUILLE 4 : "Fiscalité"
├── [Retenues USA, gains/pertes, etc.]
```

---

## 🛡️ Sécurité FlexQuery

### ✅ Avantages
- Les données restent **100% privées**
- Aucun partage automatique vers Google
- Vous contrôlez le JSON sur GitHub

### ⚠️ Points d'attention
- Le JSON sur GitHub est **public** (lecture seule)
- Si vous partagez le Google Sheets, les données sont visibles
- Pour plus de confidentialité, hébergez le JSON en **privé**

---

## 🚀 Astuces avancées

### 1. Filtrer par date dynamique

```excel
=FILTER(
  FLEXQUERY(...),
  DATE(LEFT(A2:A, 4), MID(A2:A, 6, 2), RIGHT(A2:A, 2)) >= DATE(2026, 1, 1)
)
```

### 2. Calculer P&L par action

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/.../data.json",
  "SELECT symbole, 
   SUM(CASE WHEN montant > 0 THEN montant ELSE 0 END) as achats,
   SUM(CASE WHEN montant < 0 THEN montant ELSE 0 END) as ventes,
   SUM(montant) as pl_net
   FROM transactions 
   WHERE categorie = 'Transactions' 
   GROUP BY symbole"
)
```

### 3. Alerte sur impôts USA

```excel
=FLEXQUERY(
  "https://raw.githubusercontent.com/.../data.json",
  "SELECT date, montant, montant * 0.28 as impot_usa_28pct 
   FROM transactions 
   WHERE categorie = 'Dividendes' 
   ORDER BY date DESC"
)
```

---

## 🔧 Dépannage

| Problème | Solution |
|----------|----------|
| **"Erreur FlexQuery"** | Vérifiez que le JSON est valide (https://jsonlint.com) |
| **Données vides** | Assurez-vous d'avoir exporté en JSON depuis l'app |
| **URL incorrecte** | Utilisez l'URL **brute** GitHub (raw.githubusercontent.com) |
| **Ne se met pas à jour** | Cliquez Données > FlexQuery > Actualiser |

---

## 📝 Modèle Google Sheets prêt à l'emploi

*À créer : un template Google Sheets avec toutes les formules préconfigurées*

👉 **Lien** : https://docs.google.com/spreadsheets/d/... (à ajouter)

---

## ✅ Checklist d'intégration

- [ ] App ouverte et testée sur : https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/
- [ ] CSV IBKR importés et consolidés
- [ ] JSON exporté depuis l'app
- [ ] Fichier `data.json` créé sur GitHub
- [ ] URL brute testée dans navigateur
- [ ] Première formule FlexQuery créée dans Google Sheets
- [ ] Tableau de bord configuré
- [ ] Mise à jour automatique confirmée

---

## 📞 Besoin d'aide ?

- **Questions FlexQuery ?** → [Docs Google Sheets](https://support.google.com/docs/answer/12639778)
- **Problème app ?** → Ouvrez DevTools (F12) > Console
- **Amélioration suggérée ?** → Créez une Issue sur GitHub

---

**Bon travail ! 🚀**  
Vos données fiscales sont désormais centralisées, à jour et vérifiables.
