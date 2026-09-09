/**
 * Module d'export JSON pour intégration FlexQuery
 * Génère un JSON structuré compatible avec Google Sheets
 */

class ExportModule {
    constructor(ibkrDb) {
        this.ibkrDb = ibkrDb;
    }

    /**
     * Exporte toutes les transactions au format JSON FlexQuery
     */
    async exporterJSON() {
        try {
            const transactions = await this.ibkrDb.getAll('transactions');
            
            if (transactions.length === 0) {
                throw new Error("Aucune transaction à exporter");
            }

            // Créer la structure JSON
            const data = {
                metadata: {
                    version: "1.0",
                    export_date: new Date().toISOString(),
                    export_timestamp: Math.floor(Date.now() / 1000),
                    total_transactions: transactions.length,
                    date_range: {
                        from: Math.min(...transactions.map(t => t.date)),
                        to: Math.max(...transactions.map(t => t.date))
                    }
                },
                statistiques: this.calculerStatistiques(transactions),
                transactions: transactions,
                roulements: this.detecterRoulements(transactions),
                resume_fiscal: this.genererResumeFiscal(transactions)
            };

            return data;
        } catch (err) {
            console.error("Erreur export JSON:", err);
            throw err;
        }
    }

    /**
     * Calcule les statistiques globales
     */
    calculerStatistiques(transactions) {
        const stats = {
            total_transactions: transactions.length,
            montant_total: transactions.reduce((sum, t) => sum + t.montant, 0),
            categories: new Set(transactions.map(t => t.categorie)).size,
            annees: [...new Set(transactions.map(t => t.annee))].sort(),
            symboles_uniques: new Set(transactions.map(t => t.symbole)).size,
            par_annee: {},
            par_categorie: {},
            par_symbole: {}
        };

        // Détail par année
        transactions.forEach(t => {
            if (!stats.par_annee[t.annee]) {
                stats.par_annee[t.annee] = { count: 0, total: 0 };
            }
            stats.par_annee[t.annee].count++;
            stats.par_annee[t.annee].total += t.montant;
        });

        // Détail par catégorie
        transactions.forEach(t => {
            if (!stats.par_categorie[t.categorie]) {
                stats.par_categorie[t.categorie] = { count: 0, total: 0 };
            }
            stats.par_categorie[t.categorie].count++;
            stats.par_categorie[t.categorie].total += t.montant;
        });

        // Détail par symbole
        transactions.forEach(t => {
            if (!stats.par_symbole[t.symbole]) {
                stats.par_symbole[t.symbole] = { count: 0, total: 0 };
            }
            stats.par_symbole[t.symbole].count++;
            stats.par_symbole[t.symbole].total += t.montant;
        });

        return stats;
    }

    /**
     * Détecte les roulements d'options (fermetures + réouvertures rapides)
     */
    detecterRoulements(transactions) {
        const roulements = [];
        const options = transactions.filter(t => 
            t.categorie.toLowerCase().includes('option') ||
            t.description.toLowerCase().includes('opt')
        );

        const parSymbole = {};
        options.forEach(opt => {
            if (!parSymbole[opt.symbole]) parSymbole[opt.symbole] = [];
            parSymbole[opt.symbole].push(opt);
        });

        // Détecter fermeture + réouverture rapide
        for (const [symbole, opts] of Object.entries(parSymbole)) {
            const sorted = opts.sort((a, b) => 
                new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`)
            );

            for (let i = 0; i < sorted.length - 1; i++) {
                const curr = sorted[i];
                const next = sorted[i + 1];

                // Montants opposés = fermeture/réouverture
                if (Math.abs(curr.montant + next.montant) < 0.01) {
                    const dateDebut = new Date(curr.date);
                    const dateFin = new Date(next.date);
                    const joursDiff = Math.floor((dateFin - dateDebut) / (1000 * 60 * 60 * 24));

                    if (joursDiff >= 0 && joursDiff <= 60) {
                        roulements.push({
                            symbole: symbole,
                            date_fermeture: curr.date,
                            date_reouverture: next.date,
                            jours_diff: joursDiff,
                            montant_fermeture: curr.montant,
                            montant_reouverture: next.montant,
                            pl_roulement: curr.montant + next.montant
                        });
                    }
                }
            }
        }

        return roulements;
    }

    /**
     * Génère un résumé fiscal
     */
    genererResumeFiscal(transactions) {
        const fiscal = {
            dividendes: {
                montant_brut: 0,
                impot_retenu: 0,
                montant_net: 0,
                nombre: 0
            },
            interets: {
                montant_brut: 0,
                impot_retenu: 0,
                montant_net: 0,
                nombre: 0
            },
            frais: {
                commissions: 0,
                frais_divers: 0,
                total: 0
            },
            transactions_actions: {
                nombre: 0,
                gains_net: 0
            },
            transactions_options: {
                nombre: 0,
                gains_net: 0
            },
            forex: {
                nombre: 0,
                gains_net: 0
            }
        };

        transactions.forEach(t => {
            const categLower = t.categorie.toLowerCase();

            if (categLower.includes('dividend')) {
                fiscal.dividendes.montant_brut += Math.abs(t.montant);
                fiscal.dividendes.nombre++;
                // Retenue USA 28% (à affiner selon réalité)
                fiscal.dividendes.impot_retenu += Math.abs(t.montant) * 0.28;
                fiscal.dividendes.montant_net = fiscal.dividendes.montant_brut - fiscal.dividendes.impot_retenu;
            }

            if (categLower.includes('intérêt')) {
                fiscal.interets.montant_brut += Math.abs(t.montant);
                fiscal.interets.nombre++;
                fiscal.interets.impot_retenu += Math.abs(t.montant) * 0.28;
                fiscal.interets.montant_net = fiscal.interets.montant_brut - fiscal.interets.impot_retenu;
            }

            if (categLower.includes('commission') || categLower.includes('frais')) {
                fiscal.frais.frais_divers += Math.abs(t.montant);
            }

            if (categLower.includes('action') && !categLower.includes('option')) {
                fiscal.transactions_actions.nombre++;
            }

            if (categLower.includes('option')) {
                fiscal.transactions_options.nombre++;
            }

            if (categLower.includes('forex')) {
                fiscal.transactions_options.nombre++;
            }
        });

        fiscal.frais.total = fiscal.frais.commissions + fiscal.frais.frais_divers;

        return fiscal;
    }

    /**
     * Télécharge le JSON en tant que fichier
     */
    async telechargerJSON() {
        try {
            const data = await this.exporterJSON();
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ibkr-portfolio-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true;
        } catch (err) {
            console.error("Erreur téléchargement:", err);
            throw err;
        }
    }

    /**
     * Copie le JSON dans le presse-papiers
     */
    async copierDansClipboard() {
        try {
            const data = await this.exporterJSON();
            const jsonStr = JSON.stringify(data, null, 2);
            await navigator.clipboard.writeText(jsonStr);
            return true;
        } catch (err) {
            console.error("Erreur copie:", err);
            throw err;
        }
    }

    /**
     * Exporte en CSV pour Excel
     */
    async exporterCSV() {
        try {
            const transactions = await this.ibkrDb.getAll('transactions');
            
            if (transactions.length === 0) {
                throw new Error("Aucune transaction à exporter");
            }

            // En-têtes
            const headers = ['ID', 'Date', 'Heure', 'Catégorie', 'Symbole', 'Montant', 'Description'];
            
            // Lignes
            const rows = transactions.map(t => [
                t.id,
                t.date,
                t.heure,
                t.categorie,
                t.symbole,
                t.montant,
                t.description
            ]);

            // Assembler CSV
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => 
                    typeof cell === 'string' && cell.includes(',') 
                        ? `"${cell}"` 
                        : cell
                ).join(','))
            ].join('\n');

            // Télécharger
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ibkr-portfolio-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true;
        } catch (err) {
            console.error("Erreur export CSV:", err);
            throw err;
        }
    }

    /**
     * Exporte en PDF (avec jsPDF)
     */
    async exporterPDF() {
        // À implémenter avec jsPDF
        console.log("Fonctionnalité PDF en développement");
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportModule;
}
