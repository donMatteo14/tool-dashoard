document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    fileInput.addEventListener('change', (event) => {
        // Controlla se è stato selezionato almeno un file
        if (event.target.files.length > 0) {
            // Mostra il nome del primo file selezionato
            fileNameDisplay.textContent = event.target.files[0].name;
        }
    });
});


function convertWebP(webpBlob, format) {
  return new Promise((resolve) => {
    // 1. Crea un URL per l'immagine WebP
    const imgUrl = URL.createObjectURL(webpBlob);
    
    // 2. Crea un elemento immagine
    const img = new Image();
    img.onload = () => {
      // 3. Crea un elemento canvas e impostane le dimensioni
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 4. Disegna l'immagine WebP sul canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // 5. Esporta il canvas nel nuovo formato
      // 'image/jpeg' o 'image/png'
      const mimeType = format === 'jpg' ? 'image/JPG' : 'image/PNG';
      
      canvas.toBlob((blob) => {
        // Rilascia l'URL dell'oggetto per liberare memoria
        URL.revokeObjectURL(imgUrl);
        // Risolvi la Promise con il nuovo Blob (il file convertito)
        resolve(blob); 
      }, mimeType, 0.9); // 0.9 è la qualità per il JPG, ignorata per il PNG
    };
    
    // Assegna l'URL all'elemento immagine per avviare il caricamento
    img.src = imgUrl;
  });
}

async function startConversion(format) {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('status');
    const downloadLink = document.getElementById('downloadLink');
    const ddl = document.getElementById('downloadButton');
    console.log(ddl)

    downloadLink.href = '#';
    statusDiv.classList.remove("error");
    statusDiv.classList.remove("success");
    const webpFile = fileInput.files[0];

    if (!webpFile) {
        statusDiv.classList.add("error");
        statusDiv.textContent = 'Per favore, seleziona un file webp.';
        return;
    }

    statusDiv.textContent = `Conversione in corso in ${format.toUpperCase()}...`;

    try {
        // Avvia la conversione
        const convertedBlob = await convertWebP(webpFile, format);

        // Crea il nome del file di output
        const fileName = webpFile.name.replace(/\.webp$/i, `.${format}`);

        // 1. Crea un URL locale per il download del nuovo file
        const downloadUrl = URL.createObjectURL(convertedBlob);

        // 2. Aggiorna il link di download
        downloadLink.href = downloadUrl;
        downloadLink.download = fileName;
        downloadLink.textContent = `Scarica il file`;
        downloadLink.style.display = 'block';

        ddl.style.visibility = 'visible';
        console.log(ddl);
    
        statusDiv.classList.add("success");
        statusDiv.textContent = 'Conversione completata!';

    } catch (error) {
        statusDiv.textContent = 'Errore durante la conversione: ' + error.message;
        console.error(error);
    }
}