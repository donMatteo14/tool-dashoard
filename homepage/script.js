
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("toolContainer");
    // Carica il file JSON
    fetch("/homepage/lista.json")
        .then(response => response.json()) // Converte il file in un oggetto JavaScript
        .then(lista => {
            lista.forEach(lista => {
                let card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <h2>${lista.nome}</h2>
                    <img src="${lista.icon}" alt="${lista.nome}" style="width:10vh;">
                `;
                card.onclick = () => window.location.href = lista.link;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Errore nel caricamento del JSON:", error));
});

