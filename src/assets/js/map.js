/* =====================================================
   Interactive Map — Leaflet.js
   ===================================================== */
(function() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const dataEl = document.getElementById('interview-data');
  if (!dataEl) return;

  let interviews;
  try {
    interviews = JSON.parse(dataEl.textContent);
  } catch (e) {
    console.error('Failed to parse interview data:', e);
    return;
  }

  const map = L.map('map', {
    center: [40.7380, -73.9800],
    zoom: 12,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // CartoDB Voyager — warm, clean tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Apple pin icon SVG
  const appleIcon = L.divIcon({
    html: '<svg width="32" height="38" viewBox="0 0 32 38" fill="none"><ellipse cx="16" cy="36" rx="6" ry="2" fill="rgba(0,0,0,0.15)"/><path d="M16 4C10 4 4 9 4 17C4 25 10 32 16 34C22 32 28 25 28 17C28 9 22 4 16 4Z" fill="#E53935"/><path d="M16 4C14 4 12 3 14 1C15 0 17 0 18 1C20 3 18 4 16 4Z" fill="#2E7D32"/><ellipse cx="12" cy="14" rx="3" ry="4" fill="rgba(255,255,255,0.2)"/></svg>',
    className: 'apple-pin',
    iconSize: [32, 38],
    iconAnchor: [16, 36],
    popupAnchor: [0, -34]
  });

  const markers = L.markerClusterGroup({
    maxClusterRadius: 40,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        html: '<div class="cluster-icon">' + cluster.getChildCount() + '</div>',
        className: 'custom-cluster',
        iconSize: [40, 40]
      });
    }
  });

  interviews.forEach(function(interview, index) {
    if (!interview.latitude || !interview.longitude) return;

    const marker = L.marker([interview.latitude, interview.longitude], { icon: appleIcon });

    // Build popup with photo
    var photoHtml = '';
    if (interview.photo) {
      photoHtml = '<img src="' + interview.photo + '" alt="' + interview.name + '" class="popup-photo">';
    }

    var popup = photoHtml +
      '<div class="popup-body">' +
        '<div class="popup-name">' + interview.name + '</div>' +
        '<div class="popup-quote">&ldquo;' + interview.quote + '&rdquo;</div>' +
        '<div class="popup-place">' + interview.placeName +
          (interview.placeType ? ' &mdash; ' + interview.placeType : '') +
        '</div>' +
        '<a href="' + interview.substackUrl + '" class="popup-link" target="_blank" rel="noopener">Read the interview &rarr;</a>' +
      '</div>';

    marker.bindPopup(popup);

    marker.on('popupopen', function() {
      document.querySelectorAll('.sidebar-card').forEach(function(c) { c.classList.remove('active'); });
      var card = document.querySelector('[data-index="' + index + '"]');
      if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    marker.interviewIndex = index;
    markers.addLayer(marker);
  });

  map.addLayer(markers);

  window.flyToInterview = function(index) {
    var interview = interviews[index];
    if (!interview) return;
    map.flyTo([interview.latitude, interview.longitude], 15, { duration: 0.8 });
    markers.eachLayer(function(layer) {
      if (layer.interviewIndex === index) layer.openPopup();
    });
    if (window.innerWidth < 1024) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Inject styles
  var style = document.createElement('style');
  style.textContent = '.apple-pin{background:none;border:none}.custom-cluster{background:none}.cluster-icon{width:40px;height:40px;background:#E53935;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-weight:700;font-size:14px;box-shadow:0 2px 8px rgba(229,57,53,0.4);border:3px solid white}';
  document.head.appendChild(style);
})();
