/* =====================================================
   Live NYC Data Ticker
   Free APIs, no keys needed, CORS-friendly
   ===================================================== */
(function () {
  var weather1 = document.getElementById('ticker-weather');
  var weather2 = document.getElementById('ticker-weather2');
  var rats1 = document.getElementById('ticker-rats');
  var rats2 = document.getElementById('ticker-rats2');
  var bikes1 = document.getElementById('ticker-bikes');
  var bikes2 = document.getElementById('ticker-bikes2');
  var noise1 = document.getElementById('ticker-noise');
  var noise2 = document.getElementById('ticker-noise2');
  var film1 = document.getElementById('ticker-film');
  var film2 = document.getElementById('ticker-film2');
  var dogs1 = document.getElementById('ticker-dogs');
  var dogs2 = document.getElementById('ticker-dogs2');
  var restaurants1 = document.getElementById('ticker-restaurants');
  var restaurants2 = document.getElementById('ticker-restaurants2');
  var pothole1 = document.getElementById('ticker-pothole');
  var pothole2 = document.getElementById('ticker-pothole2');

  if (!weather1) return;

  function set(a, b, text) {
    if (a) a.textContent = text;
    if (b) b.textContent = text;
  }

  // --- Weather (Open-Meteo, NYC coords) ---
  fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,weathercode&temperature_unit=fahrenheit&timezone=America/New_York')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var temp = Math.round(d.current.temperature_2m);
      var code = d.current.weathercode;
      var desc = weatherDesc(code);
      set(weather1, weather2, 'NYC Right Now: ' + temp + '\u00B0F ' + desc);
    })
    .catch(function () {
      set(weather1, weather2, 'NYC Weather: --');
    });

  function weatherDesc(code) {
    if (code === 0) return '\u2600\uFE0F Clear';
    if (code <= 3) return '\u26C5 Partly Cloudy';
    if (code <= 48) return '\uD83C\uDF2B\uFE0F Foggy';
    if (code <= 67) return '\uD83C\uDF27\uFE0F Rain';
    if (code <= 77) return '\u2744\uFE0F Snow';
    if (code <= 82) return '\uD83C\uDF27\uFE0F Showers';
    if (code <= 86) return '\u2744\uFE0F Snow Showers';
    if (code >= 95) return '\u26A1 Thunderstorm';
    return '';
  }

  // --- 311 Rat Sightings (last 30 days) ---
  var thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=count(*)&$where=complaint_type=%27Rodent%27%20AND%20created_date%3E%27' + thirtyAgo + '%27')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var count = d[0] ? Number(d[0].count).toLocaleString() : '???';
      set(rats1, rats2, '\uD83D\uDC00 Rat Sightings (30d): ' + count);
    })
    .catch(function () {
      set(rats1, rats2, '\uD83D\uDC00 Rat Sightings: --');
    });

  // --- CitiBike (available bikes across NYC) ---
  fetch('https://gbfs.citibikenyc.com/gbfs/en/station_status.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var total = 0;
      d.data.stations.forEach(function (s) {
        total += s.num_bikes_available || 0;
      });
      set(bikes1, bikes2, '\uD83D\uDEB2 CitiBikes Available: ' + total.toLocaleString());
    })
    .catch(function () {
      set(bikes1, bikes2, '\uD83D\uDEB2 CitiBikes: --');
    });

  // --- 311 Noise Complaints (last 7 days) ---
  var sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=count(*)&$where=complaint_type=%27Noise%20-%20Residential%27%20AND%20created_date%3E%27' + sevenAgo + '%27')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var count = d[0] ? Number(d[0].count).toLocaleString() : '???';
      set(noise1, noise2, '\uD83D\uDD0A Noise Complaints (7d): ' + count);
    })
    .catch(function () {
      set(noise1, noise2, '\uD83D\uDD0A Noise Complaints: --');
    });

  // --- Film Permits (active this week) ---
  var today = new Date().toISOString().slice(0, 10);
  fetch('https://data.cityofnewyork.us/resource/tg4x-b46p.json?$select=count(*)&$where=startdatetime%3E%27' + sevenAgo + '%27%20AND%20startdatetime%3C%27' + today + '%27')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var count = d[0] ? Number(d[0].count).toLocaleString() : '???';
      set(film1, film2, '\uD83C\uDFAC Film Permits (7d): ' + count);
    })
    .catch(function () {
      set(film1, film2, '\uD83C\uDFAC Film Permits: --');
    });

  // --- Dog Licenses (this year) ---
  var yearStart = new Date().getFullYear() + '-01-01';
  fetch('https://data.cityofnewyork.us/resource/nu7n-tubp.json?$select=count(*)&$where=licenseddate%3E%27' + yearStart + '%27')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var count = d[0] ? Number(d[0].count).toLocaleString() : '???';
      set(dogs1, dogs2, '\uD83D\uDC36 New Dog Licenses (YTD): ' + count);
    })
    .catch(function () {
      set(dogs1, dogs2, '\uD83D\uDC36 Dog Licenses: --');
    });

  // --- Restaurant Inspections with critical violations (last 30 days) ---
  fetch('https://data.cityofnewyork.us/resource/43nn-pn8j.json?$select=count(*)&$where=grade=%27C%27%20AND%20inspection_date%3E%27' + thirtyAgo + '%27')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var count = d[0] ? Number(d[0].count).toLocaleString() : '???';
      set(restaurants1, restaurants2, '\uD83C\uDF7D\uFE0F Grade C Restaurants (30d): ' + count);
    })
    .catch(function () {
      set(restaurants1, restaurants2, '\uD83C\uDF7D\uFE0F Restaurant Fails: --');
    });

  // --- Pothole Complaints (last 7 days) ---
  fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=count(*)&$where=complaint_type=%27Pothole%27%20AND%20created_date%3E%27' + sevenAgo + '%27')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var count = d[0] ? Number(d[0].count).toLocaleString() : '???';
      set(pothole1, pothole2, '\uD83D\uDEA7 Pothole Complaints (7d): ' + count);
    })
    .catch(function () {
      set(pothole1, pothole2, '\uD83D\uDEA7 Potholes: --');
    });
})();
