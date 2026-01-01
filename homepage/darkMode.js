// Seleziona l'input dello slider e il body
const themeSliderInput = document.getElementById('theme-slider'); // <-- MODIFICATO: Seleziona l'input
const text = document.querySelectorAll('.text');
const bodyElement = document.body;

// Chiave usata per salvare la preferenza nel localStorage (invariata)
const themeLocalStorageKey = 'themePreference';

// Funzione per applicare il tema (aggiungere/rimuovere la classe 'dark-mode')
// AGGIUNTA: sincronizzazione dello stato checked dello slider
const applyTheme = (theme) => {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        text.forEach(e =>{
            e.classList.add('dark-mode');
        })
        if (themeSliderInput) themeSliderInput.checked = true; // <-- NUOVO: Imposta slider a ON
    } else {
        bodyElement.classList.remove('dark-mode');
        text.forEach(e =>{
            e.classList.remove('dark-mode');
        })
        if (themeSliderInput) themeSliderInput.checked = false; // <-- NUOVO: Imposta slider a OFF
    }
};

// Funzione per determinare il tema iniziale (invariata)
const determineInitialTheme = () => {
    const savedTheme = localStorage.getItem(themeLocalStorageKey);
    if (savedTheme) {
        return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

// NUOVA Funzione per gestire il cambio di stato dello slider
const handleThemeChange = (event) => {
    const isChecked = event.target.checked; // Controlla se lo slider è ON
    const newTheme = isChecked ? 'dark' : 'light'; // Determina il tema

    applyTheme(newTheme); // Applica il tema
    localStorage.setItem(themeLocalStorageKey, newTheme); // Salva la preferenza
};

// --- Esecuzione all'avvio ---

// 1. Applica il tema corretto al caricamento della pagina (ora sincronizza anche lo slider)
const initialTheme = determineInitialTheme();
applyTheme(initialTheme);

// 2. Aggiungi l'event listener allo slider (sull'evento 'change')
if (themeSliderInput) {
    themeSliderInput.addEventListener('change', handleThemeChange); // <-- MODIFICATO: Evento 'change' e funzione handler
} else {
    console.warn("Elemento input con id 'theme-slider' non trovato.");
}


// (Opzionale) Listener per cambiamenti OS (invariato, ma ora chiamerà applyTheme aggiornato)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const savedTheme = localStorage.getItem(themeLocalStorageKey);
    if (!savedTheme) {
        const newTheme = event.matches ? 'dark' : 'light';
        applyTheme(newTheme); // applyTheme aggiornato sincronizzerà anche lo slider
    }
});
