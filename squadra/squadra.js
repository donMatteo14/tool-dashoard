// --- GESTIONE UI (TOASTS E MODALI) ---
    
    // Funzione per mostrare notifiche (sostituisce alert)
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        
        container.appendChild(toast);

        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Variabile per salvare la funzione di callback corrente
    let confirmCallback = null;

    // Funzione per mostrare modale di conferma (sostituisce confirm)
    function showConfirm(message, onConfirm) {
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-modal').classList.add('active');
        
        // Imposta la nuova azione per il tasto "Sì"
        const yesBtn = document.getElementById('confirm-yes-btn');
        // Rimuove vecchi listener clonando il bottone
        const newBtn = yesBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newBtn, yesBtn);
        
        newBtn.addEventListener('click', function() {
            onConfirm();
            chiudiConfirm();
        });
    }

    function chiudiConfirm() {
        document.getElementById('confirm-modal').classList.remove('active');
    }


    // --- GESTIONE DATI ---
    let elencoGiocatori = JSON.parse(localStorage.getItem('my_squadra_roster')) || [];

    function salvaDati() {
        localStorage.setItem('my_squadra_roster', JSON.stringify(elencoGiocatori));
        renderizzaLista();
    }

    // --- LOGICA PRINCIPALE ---
    
    document.addEventListener('DOMContentLoaded', () => {
        renderizzaLista();
        
        // Listener per tasto Invio nell'input
        document.getElementById('nuovoGiocatore').addEventListener('keypress', function(e) {
            if(e.key === 'Enter') aggiungiGiocatore();
        });
    });

    function aggiungiGiocatore() {
        const input = document.getElementById('nuovoGiocatore');
        const nome = input.value.trim();
        
        if (!nome) {
            showToast("Scrivi un nome valido!", "error");
            return;
        }

        // Controllo case-insensitive per duplicati
        const esiste = elencoGiocatori.some(g => g.toLowerCase() === nome.toLowerCase());

        if (!esiste) {
            // Capitalizza la prima lettera
            const nomeFormat = nome.charAt(0).toUpperCase() + nome.slice(1);
            elencoGiocatori.push(nomeFormat);
            elencoGiocatori.sort();
            salvaDati();
            input.value = '';
            showToast("Giocatore aggiunto!", "success");
        } else {
            showToast("Giocatore già presente in lista!", "error");
        }
    }

    function chiediRimozione(nome) {
        showConfirm(`Vuoi davvero eliminare ${nome} dalla rosa?`, function() {
            elencoGiocatori = elencoGiocatori.filter(g => g !== nome);
            salvaDati();
            showToast("Giocatore eliminato.", "info");
        });
    }

    function renderizzaLista() {
        const lista = document.getElementById('lista-giocatori');
        lista.innerHTML = '';
        elencoGiocatori.forEach(giocatore => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="player-tag">
                    <span>${giocatore}</span>
                    <button class="btn-danger" onclick="chiediRimozione('${giocatore}')">✕</button>
                </div>
            `;
            lista.appendChild(li);
        });
    }

    // --- SQUADRE E TABELLONE ---

    function vaiAlleSquadre() {
        if (elencoGiocatori.length === 0) {
            showToast("La rosa è vuota! Aggiungi dei giocatori.", "error");
            return;
        }

        const numTotale = parseInt(document.getElementById('nGiocatori').value);
        if (elencoGiocatori.length < numTotale) {
             showToast(`Attenzione: hai solo ${elencoGiocatori.length} giocatori in rosa per una partita da ${numTotale}.`, "info");
        }

        const perSquadra = numTotale / 2;
        generaSlotSquadra('slots-a', 'squadra_a', perSquadra);
        generaSlotSquadra('slots-b', 'squadra_b', perSquadra);

        document.getElementById('setup-panel').classList.add('hidden');
        document.getElementById('builder-panel').classList.remove('hidden');

        attivaControlloDuplicati();
    }

    function generaSlotSquadra(containerId, nomeSelect, quantita) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        let optionsHTML = `<option value="">-- Seleziona --</option>`;
        elencoGiocatori.forEach(g => {
            optionsHTML += `<option value="${g}">${g}</option>`;
        });

        for (let i = 1; i <= quantita; i++) {
            const div = document.createElement('div');
            div.className = 'slot';
            div.innerHTML = `
                <label>Slot ${i}</label>
                <select class="scelta-giocatore">
                    ${optionsHTML}
                </select>
            `;
            container.appendChild(div);
        }
    }

    function tornaIndietro() {
        document.getElementById('builder-panel').classList.add('hidden');
        document.getElementById('setup-panel').classList.remove('hidden');
    }

    // --- ANTI-DUPLICATI ---
    function attivaControlloDuplicati() {
        const tuttiSelect = document.querySelectorAll('.scelta-giocatore');

        function aggiornaListe() {
            const giocatoriSelezionati = new Set();
            tuttiSelect.forEach(select => {
                if (select.value !== "") giocatoriSelezionati.add(select.value);
            });

            tuttiSelect.forEach(select => {
                const valoreAttuale = select.value;
                const options = select.querySelectorAll('option');
                
                options.forEach(option => {
                    if (option.value === "") return;
                    if (giocatoriSelezionati.has(option.value) && option.value !== valoreAttuale) {
                        option.disabled = true;
                        option.innerText = option.value + " (Occupato)"; // Feedback visivo
                    } else {
                        option.disabled = false;
                        option.innerText = option.value;
                    }
                });
            });
        }
        tuttiSelect.forEach(sel => sel.addEventListener('change', aggiornaListe));
        aggiornaListe();
    }

    // --- EXPORT ---
    function mostraModaleExport() {
        document.getElementById('export-modal').classList.add('active');
    }

    function esportaJPG() {
        const area = document.getElementById('capture-area');
        
        // Nascondi temporaneamente i bordi per lo screenshot se vuoi
        html2canvas(area, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'formazione_calcetto.jpg';
            link.click();
            document.getElementById('export-modal').classList.remove('active');
            showToast("Immagine scaricata!", "success");
        }).catch(err => {
            console.error(err);
            showToast("Errore nell'esportazione.", "error");
        });
    }