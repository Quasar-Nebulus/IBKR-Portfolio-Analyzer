# 🚀 Activation GitHub Pages

## ⚡ IMPORTANT : Action manuelle requise

GitHub Pages n'est pas encore activé pour ce repository. Voici comment le faire :

### Étape 1 : Accéder aux Settings
1. Allez sur : **https://github.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer**
2. Cliquez sur l'onglet **⚙️ Settings**

### Étape 2 : Configurer GitHub Pages
1. Dans le menu gauche, allez à **Pages** (sous "Code and automation")
2. Sous **"Build and deployment"**, sélectionnez :
   - **Source** : `Deploy from a branch`
   - **Branch** : `main`
   - **Folder** : `/ (root)`
3. Cliquez sur **Save**

### Étape 3 : Attendre la publication
- GitHub va construire et déployer le site (2-3 minutes)
- Vous verrez un message vert : ✅ "Your site is live at..."
- L'URL sera : **https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/**

---

## ✅ Vérification

Une fois activé, testez :
```
https://quasar-nebulus.github.io/IBKR-Portfolio-Analyzer/
```

Vous devriez voir :
- **Sidebar gauche** avec menu de navigation
- **Zone d'import** des fichiers CSV IBKR
- **Statistiques** détaillées
- **Paramètres** d'export

---

## 🔄 Workflow automatique

Un workflow GitHub Actions a été créé (`.github/workflows/pages.yml`). À chaque modification du code :
- ✅ Le site se redéploie automatiquement
- ✅ Aucune action manuelle requise après l'activation initiale

---

## 📝 Troubleshooting

| Problème | Solution |
|----------|----------|
| **404 - Page not found** | Vérifiez que GitHub Pages est bien activé dans Settings |
| **CSS/JS ne chargent pas** | Videz le cache du navigateur (Ctrl+Shift+R) |
| **Ancien contenu affiché** | Attendez 5-10 min ou forcez un rechargement |

---

**Une fois activé, vous pouvez utiliser FlexQuery directement avec :**
```
=FLEXQUERY("https://raw.githubusercontent.com/Quasar-Nebulus/IBKR-Portfolio-Analyzer/main/data.json", "...")
```

Besoin d'aide ? Consultez `FLEXQUERY_GUIDE.md` 📊
