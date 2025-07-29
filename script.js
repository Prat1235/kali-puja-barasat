async function fetchPandalData() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeFt8tTkSrxG1fw3BIfZLniav7NuCU1g9uQCTW0Rb8uGcDD2Jlhrq2yM3cmafbT2K-MdouBR3ngXHC/pub?output=csv';
  try {
    const res = await fetch(sheetUrl);
    const csv = await res.text();
    const rows = csv.trim().split('\n').slice(1);

    return rows.map(row => {
      const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!cols || cols.length < 4) return null;

      return {
        name: cols[0].replace(/^"|"$/g, ''),
        lat: parseFloat(cols[1]),
        lng: parseFloat(cols[2]),
        desc: cols[3].replace(/^"|"$/g, '')
      };
    }).filter(Boolean);
  } catch (err) {
    console.error("Error fetching CSV:", err);
    return [];
  }
}

async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.721, lng: 88.48 },
    zoom: 14,
  });

  const infoWindow = new google.maps.InfoWindow();
  const markers = await fetchPandalData();

  markers.forEach(pandal => {
    const marker = new google.maps.Marker({
      position: { lat: pandal.lat, lng: pandal.lng },
      map,
      title: pandal.name,
    });

    marker.addListener('click', () => {
      infoWindow.setContent(`<strong>${pandal.name}</strong><br>${pandal.desc}`);
      infoWindow.open(map, marker);
    });
  });
}
