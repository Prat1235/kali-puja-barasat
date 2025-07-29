async function fetchPandalData() {
  const timestamp = new Date().getTime();
  const sheetUrl = `https://docs.google.com/spreadsheets/d/1nryB_quFnJRQBbFe1XgI_XbpkGcRDm9rrrqQ4WfzYvo/gviz/tq?tqx=out:json&sheet=Sheet1&cacheBust=${timestamp}`;

  try {
    const res = await fetch(sheetUrl);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    return rows.map(row => ({
      name: row.c[0]?.v,
      lat: parseFloat(row.c[1]?.v),
      lng: parseFloat(row.c[2]?.v),
      desc: row.c[3]?.v || 'No description available'
    }));
  } catch (err) {
    console.error("Failed to load pandal data", err);
    return [];
  }
}

async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 22.72, lng: 88.48 }
  });

  const pandals = await fetchPandalData();

  pandals.forEach(pandal => {
    if (!isNaN(pandal.lat) && !isNaN(pandal.lng)) {
      const marker = new google.maps.Marker({
        position: { lat: pandal.lat, lng: pandal.lng },
        map,
        title: pandal.name || "Unnamed Pandal"
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${pandal.name}</strong><br>${pandal.desc}`
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    }
  });
}
