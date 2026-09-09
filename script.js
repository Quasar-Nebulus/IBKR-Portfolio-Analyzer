// Database Management
let db;

const DB_NAME = 'IBKR_Portfolio';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Add transactions to DB
function addTransactionsToDB(transactions) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    transactions.forEach(tx => {
      // Créer un hash pour éviter les doublons
      const hash = createHash(tx);
      tx.hash = hash;
      store.put(tx);
    });
    
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

// Create hash for duplicate detection
function createHash(transaction) {
  const str = `${transaction.date}-${transaction.symbol}-${transaction.quantity}-${transaction.price}-${transaction.type}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Get all transactions from DB
function getAllTransactions() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Delete all transactions (NEW FUNCTION - IMPORTANT)
function deleteAllTransactions() {
  return new Promise((resolve, reject) => {
    if (!confirm('⚠️ ATTENTION ⚠️\n\nVous êtes sur le point de SUPPRIMER TOUTES les données !\n\nCette action est irréversible.\n\nÊtes-vous sûr ?')) {
      reject('Suppression annulée par l\'utilisateur');
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      console.log('✅ Toutes les données ont été supprimées avec succès');
      resolve();
    };
  });
}

// Delete specific transaction by ID
function deleteTransaction(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Clear and reimport (useful for updating)
function clearAndReimport(newTransactions) {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteAllTransactions();
      await addTransactionsToDB(newTransactions);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Parse CSV File
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const transactions = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(v => v.trim());
    const transaction = {};
    
    headers.forEach((header, index) => {
      transaction[header] = values[index] || '';
    });
    
    transactions.push(transaction);
  }
  
  return transactions;
}

// Handle File Upload
document.getElementById('csvFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const text = e.target.result;
      const transactions = parseCSV(text);
      
      await addTransactionsToDB(transactions);
      updateStatistics();
      document.getElementById('status').textContent = `✅ ${transactions.length} transactions importées avec succès !`;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      document.getElementById('status').textContent = `❌ Erreur lors de l\'import: ${error}`;
    }
  };
  reader.readAsText(file);
});

// Update Statistics
async function updateStatistics() {
  const transactions = await getAllTransactions();
  
  if (transactions.length === 0) {
    document.getElementById('stats').innerHTML = '📊 Aucune donnée. Importez un fichier CSV.';
    return;
  }
  
  const years = new Set();
  const symbols = new Set();
  const categories = new Set();
  let rollovers = 0, adjustments = 0;
  
  transactions.forEach(tx => {
    if (tx.date) years.add(tx.date.substring(0, 4));
    if (tx.symbol) symbols.add(tx.symbol);
    if (tx.type) categories.add(tx.type);
    if (tx.type === 'Roulements') rollovers++;
    if (tx.type === 'Ajustements') adjustments++;
  });
  
  const yearStats = {};
  transactions.forEach(tx => {
    const year = tx.date ? tx.date.substring(0, 4) : 'Unknown';
    yearStats[year] = (yearStats[year] || 0) + 1;
  });
  
  let html = `
    <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
      <h3>📊 Statistiques globales</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Transactions totales:</strong> ${transactions.length}</li>
        <li><strong>Catégories:</strong> ${categories.size}</li>
        <li><strong>Roulements:</strong> ${rollovers}</li>
        <li><strong>Ajustements:</strong> ${adjustments}</li>
        <li><strong>Années:</strong> ${years.size}</li>
        <li><strong>Symboles uniques:</strong> ${symbols.size}</li>
      </ul>
      <h3>📅 Répartition par année</h3>
      <ul style="list-style: none; padding: 0;">
  `;
  
  Object.entries(yearStats).sort().forEach(([year, count]) => {
    html += `<li><strong>${year}:</strong> ${count} transactions</li>`;
  });
  
  html += `</ul></div>`;
  
  document.getElementById('stats').innerHTML = html;
}

// Export to JSON
function exportToJSON() {
  getAllTransactions().then(transactions => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IBKR_Portfolio_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  });
}

// Settings Panel - Delete Data Button
function showSettingsPanel() {
  const panel = `
    <div id="settingsModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
         background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); 
         z-index: 1000; min-width: 400px;">
      <h2>⚙️ Paramètres</h2>
      <div style="margin: 20px 0;">
        <button onclick="exportToJSON()" style="padding: 10px 20px; background: #4CAF50; color: white; 
                border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
          📥 Exporter en JSON
        </button>
        <button onclick="deleteAllData()" style="padding: 10px 20px; background: #f44336; color: white; 
                border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
          🗑️ Supprimer toutes les données
        </button>
      </div>
      <button onclick="closeSettingsPanel()" style="padding: 10px 20px; background: #2196F3; color: white; 
              border: none; border-radius: 5px; cursor: pointer; width: 100%;">
        Fermer
      </button>
    </div>
    <div id="settingsBackdrop" onclick="closeSettingsPanel()" 
         style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999;"></div>
  `;
  document.body.insertAdjacentHTML('beforeend', panel);
}

function closeSettingsPanel() {
  const modal = document.getElementById('settingsModal');
  const backdrop = document.getElementById('settingsBackdrop');
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
}

async function deleteAllData() {
  try {
    await deleteAllTransactions();
    await updateStatistics();
    closeSettingsPanel();
    document.getElementById('status').textContent = '✅ Toutes les données ont été supprimées avec succès !';
  } catch (error) {
    if (error !== 'Suppression annulée par l\'utilisateur') {
      console.error('Erreur lors de la suppression:', error);
      document.getElementById('status').textContent = `❌ Erreur: ${error}`;
    }
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await updateStatistics();
});
