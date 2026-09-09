# 📊 IBKR Portfolio Analyzer

[![Production](https://img.shields.io/badge/Production-main-green?logo=github)](https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/tree/main)
[![Development](https://img.shields.io/badge/Development-dev-orange?logo=github)](https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/tree/dev)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?logo=github)](https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/)
[![Dev Version](https://img.shields.io/badge/Dev%20Demo-github.io-orange?logo=github)](https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/dev/)

## 🎯 Objectifs

Un outil gratuit et open-source pour analyser précisément vos investissements IBKR :

✅ **Synthèse lisible** - Vue d'ensemble claire de vos positions  
✅ **Analyse fiscale** - Bilan ultra précis pour la déclaration annuelle  
✅ **100% Gratuit** - Aucune dépendance payante  
✅ **Données locales** - Tout reste dans votre navigateur (IndexedDB)  
✅ **Partageable** - Interface intuitive pour tous  

---

## 🚀 Utilisation

### **Version Production (STABLE)** ⭐
```
https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/
```
→ Version testée et validée pour une utilisation quotidienne

### **Version Développement (TEST)** 🔧
```
https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/dev/
```
→ Nouvelles fonctionnalités en cours de test  
→ Accès avant la publication officielle  
→ Parfait pour les feedbacks

---

## 📋 Fonctionnalités

### ✅ Actuellement Disponibles
- 📁 Import de fichiers CSV (format IBKR)
- 📊 Statistiques globales (transactions, catégories, années)
- 💾 Stockage local sécurisé (IndexedDB)
- 📥 Export en JSON
- 🗑️ **Suppression des données** (NEW!)
- 🎨 Interface moderne et responsive

### 🔄 En Développement
- 📈 Graphiques et visualisations
- 📐 Calculs fiscaux avancés
- 🔄 Détection des roulements
- 📄 Génération de rapports IFU
- 🔄 Gestion des mises à jour (FlexQuery)
- 💱 Analyse FOREX

---

## 🛠️ Workflow de Développement

```
📝 Modification sur branche `dev`
    ↓
🧪 Test sur https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/dev/
    ↓
👀 Vérification + Pull Request
    ↓
✅ Validation
    ↓
🚀 Merge sur `main` (Production)
```

---

## 📊 Structure du Projet

```
IBKR-Portfolio-Analyzer/
├── index.html           # Interface principale
├── script.js            # Logique (IndexedDB, import, stats)
├── style.css            # Styles (intégrés dans index.html)
├── _config.yml          # Config Jekyll
├── .github/
│   └── workflows/
│       ├── pages.yml    # Déploiement main
│       └── dev-pages.yml # Déploiement dev
└── README.md            # Ce fichier
```

---

## 💾 Stockage des Données

### IndexedDB
- **Sécurité** : Données 100% locales, jamais uploadées
- **Capacité** : Plusieurs Mo disponibles
- **Durabilité** : Persiste entre les sessions
- **Gestion** : Suppression manuelle via l'app

### Import/Export
- **Import** : Fichiers CSV (format IBKR standard)
- **Export** : JSON (portable, réutilisable)

---

## 🧪 Tests en Dev

Avant de passer une nouvelle version en production :

1. ✅ Testez sur la version dev
2. ✅ Importez un fichier CSV de test
3. ✅ Vérifiez les statistiques
4. ✅ Testez la suppression des données
5. ✅ Exportez en JSON
6. ✅ Laissez des feedbacks si besoin

---

## 🚀 Comment Contribuer

### Pour les utilisateurs
- 🐛 Signalez les bugs
- 💡 Proposez des améliorations
- 🧪 Testez les versions dev

### Pour les développeurs
```bash
# Cloner le repo
git clone https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer.git

# Créer une branche de feature
git checkout -b feature/mon-feature

# Commit et push
git push origin feature/mon-feature

# Créer une Pull Request
```

---

## 📋 Roadmap

- [ ] Interface de gestion des données améliorée
- [ ] Calculs fiscaux (PV/PL, dividendes, intérêts)
- [ ] Graphiques interactifs
- [ ] Export PDF pour déclaration fiscale
- [ ] Synchronisation FlexQuery
- [ ] Support multi-devise
- [ ] Détection des roulements options
- [ ] Rapports IFU générés

---

## ⚖️ Licence

MIT License - Libre d'utilisation et de modification

---

## 📞 Support

- 🐛 Issues : https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/issues
- 💬 Discussions : https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/discussions

---

## 📈 Statut du Projet

| Branche | Status | URL |
|---------|--------|-----|
| **main** | ✅ Production | [Live](https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/) |
| **dev** | 🔧 Développement | [Test](https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/dev/) |

---

**Dernière mise à jour** : Septembre 2026  
**Maintenu par** : Quasar-Nebulus
