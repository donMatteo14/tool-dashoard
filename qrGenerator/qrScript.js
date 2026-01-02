let qr; // Variabile per il QR code
let msg;

function generateQRCode() {
    let url = document.getElementById("userUrl").value; // Prende l'URL dall'input
    url = url.toLowerCase();
    let qrContainer = document.getElementById("qrcode");
    const err = document.getElementById("error");
    err.style.display = "none";
    if (!url) {
        err.style.display = "block";
        err.innerHTML = "Inserisci un link valido";
        return;
    }
    else if(!url.startsWith("http"))
    {
        err.style.display = "block";
        err.innerHTML = "Assicurati che il link inizi con http:// o https://";
        return;
    }
    

    // Svuota il contenitore del QR code prima di generarne uno nuovo
    qrContainer.innerHTML = "";

    // Genera il nuovo QR code
    qr = new QRCode(qrContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H
        
    });
}

function downloadQRCode() {
    let qrCanvas = document.querySelector("#qrcode canvas");
    const err = document.getElementById("error");
    if (!qrCanvas) {
        err.style.display = "block";
        err.innerHTML = "Genera prima un QR code";
        return;
    }

    let borderSize = 40; // Spessore del bordo bianco

    // Creiamo un nuovo canvas con sfondo bianco
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    // Imposta le dimensioni con il bordo
    let newSize = qrCanvas.width + borderSize * 2;
    canvas.width = newSize;
    canvas.height = newSize;

    // Riempie lo sfondo di bianco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Assicura che l'immagine venga disegnata nel nuovo canvas
    let img = new Image();
    img.onload = function() {
        ctx.drawImage(img, borderSize, borderSize);
        
        // Dopo il disegno, scarichiamo l'immagine
        let qrImage = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = qrImage;
        link.download = "qr_code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.src = qrCanvas.toDataURL("image/png"); // Convertiamo il QR code in immagine
}