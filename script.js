var map = L.map('map').setView([22.721, 88.480], 14);

// Load map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeFt8tTkSrxG1fw3BIfZLniav7NuCU1g9uQCTW0Rb8uGcDD2Jlhrq2yM3cmafbT2K-MdouBR3ngXHC/pub?output=csv';

fetch('https://cors-anywhere.herokuapp.com/' + sheetURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n');
    console.log("Total Rows:", rows.length);

    const headers = rows[0].split(',');
    console.log("Headers:", headers);

    rows.slice(1).forEach((line, i) => {
      const row = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

      console.log(`Row ${i + 2}:`, row);

      if (!row || row.length < 4) {
        console.warn(`Skipping row ${i + 2} - not enough columns`);
        return;
      }

      const name = row[0].replace(/^"|"$/g, '');
      const lat = parseFloat(row[1]);
      const lng = parseFloat(row[2]);
      const desc = row[3].replace(/^"|"$/g, '');

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log(`✔️ Marker: ${name} (${lat}, ${lng})`);
        L.marker([lat, lng]).addTo(map)
          .bindPopup(`<b>${name}</b><br>${desc}`);
      } else {
        console.warn(`❌ Invalid coordinates at row ${i + 2}:`, row[1], row[2]);
      }
    });
  })
  .catch(err => {
    console.error("⚠️ Error fetching CSV:", err);
  });
