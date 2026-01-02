<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IP info</title>
    <link rel="stylesheet" href="ipStyle.css">
    <link rel="shortcut icon" href="../assets/iconSite.ico" type="image/x-icon">    
</head>
<body>
	<div class="form">
    <?php
        $client_ip = $_SERVER["REMOTE_ADDR"];

        $url = "https://ipinfo.io/{$client_ip}/json";

        // Inizializza la sessione cURL
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // evita errori SSL su hosting condivisi

        $response = curl_exec($ch);

        if ($response === false) {
            die("Errore cURL: " . curl_error($ch));
        }

        curl_close($ch);

        // Decodifica il JSON
        $data = json_decode($response, true);

        if (isset($data['ip'])) {
            echo "<h2 class='text'>Geolocalizzazione IP</h2>";
            
            // Inizia la tabella HTML
            echo "<table class='ip-geo-table'>";
            
            // Riga Indirizzo IP
            echo "<tr>";
            echo "  <th>Indirizzo IP</th>";
            echo "  <td>" . htmlspecialchars($data['ip']) . "</td>";
            echo "</tr>";
            
            // Riga Città
            echo "<tr>";
            echo "  <th>Città</th>";
            echo "  <td>" . htmlspecialchars($data['city'] ?? 'N/A') . "</td>";
            echo "</tr>";
            
            // Riga Regione
            echo "<tr>";
            echo "  <th>Regione</th>";
            echo "  <td>" . htmlspecialchars($data['region'] ?? 'N/A') . "</td>";
            echo "</tr>";
            
            // Riga Paese
            echo "<tr>";
            echo "  <th>Paese</th>";
            echo "  <td>" . htmlspecialchars($data['country'] ?? 'N/A') . "</td>";
            echo "</tr>";
            
            // Riga Posizione
            echo "<tr>";
            echo "  <th>Posizione (lat,lon)</th>";
            echo "  <td>" . htmlspecialchars($data['loc'] ?? 'N/A') . "</td>";
            echo "</tr>";
            
            // Chiudi la tabella
            echo "</table>";

        } else {
            // Aggiungi una classe anche all'errore
            echo "<p class='ip-error'>Errore: impossibile ottenere la posizione (la risposta JSON non contiene 'ip').</p>";
        }
    ?>
    </div>
    <a href="../index.html"><input type="button" value="Torna alla home page"></a>
    <h2 class="text">Imposta il tema chiaro/scuro</h2>
    <label class="theme-switch" for="theme-slider" title="Attiva/Disattiva Dark Mode">
        <input type="checkbox" id="theme-slider">
        <span class="slider round"></span>
    </label>
    <script src="../homepage/darkMode.js"></script>
</body>
</html>