var map = L.map('map').setView([22.721, 88.480], 14);

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Google Sheets CSV (Publish to Web → CSV link)
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeFt8tTkSrxG1fw3BIfZLniav7NuCU1g9uQCTW0Rb8uGcDD2Jlhrq2yM3cmafbT2K-MdouBR3ngXHC/pub?output=csv';

// Use a CORS proxy (only if running locally — not needed for GitHub Pages)
fetch('https://cors-anywhere.herokuapp.com/' + sheetURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n');
    const headers = rows[0].split(',');

    rows.slice(1).forEach((line, i) => {
      const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!cols || cols.length < 4) return;

      const name = cols[0].replace(/^"|"$/g, '');
      const lat = parseFloat(cols[1]);
      const lng = parseFloat(cols[2]);
      const desc = cols[3].replace(/^"|"$/g, '');

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<strong>${name}</strong><br>${desc}`);
        marker.on('click', () => marker.openPopup()); // ✅ Fix added
      }
    });
  })
  .catch(err => {
    console.error("⚠️ Error fetching CSV:", err);
  });
