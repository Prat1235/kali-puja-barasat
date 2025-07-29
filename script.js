var map = L.map('map').setView([22.721, 88.480], 14);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Your public CSV export link
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeFt8tTkSrxG1fw3BIfZLniav7NuCU1g9uQCTW0Rb8uGcDD2Jlhrq2yM3cmafbT2K-MdouBR3ngXHC/pub?output=csv';

// Optional CORS proxy
const proxy = 'https://cors-anywhere.herokuapp.com/';

// Fetch the CSV
fetch(proxy + sheetURL)
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split('\n');
    const headers = rows[0].split(',');

    rows.slice(1).forEach((line, index) => {
      const row = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

      if (!row || row.length < 4) {
        console.warn(`⛔ Skipping row ${index + 2}: Invalid format`);
        return;
      }

      const name = row[0].replace(/^"|"$/g, '');
      const lat = parseFloat(row[1]);
      const lng = parseFloat(row[2]);
      const desc = row[3].replace(/^"|"$/g, '');

      if (!isNaN(lat) && !isNaN(lng)) {
  console.log(`✔️ Marker: ${name} (${lat}, ${lng})`);
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${name}</b><br>${desc}`)
    .on('click', function (e) {
      this.openPopup();
    });
}

        // Manually open popup on click
        marker.on('click', () => {
          marker.openPopup();
        });

        console.log(`✅ Marker added: ${name} (${lat}, ${lng})`);
      } else {
        console.warn(`⚠️ Invalid coordinates at row ${index + 2}: ${lat}, ${lng}`);
      }
    });
  })
  .catch(error => {
    console.error("⚠️ Error fetching CSV:", error);
  });
