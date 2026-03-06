/* =====================================================
   Photo Montage — Loading Screen
   Strict alternation: face, NYC, face, NYC...
   ===================================================== */
(function() {
  var screen = document.querySelector('.loading-screen');
  if (!screen) return;

  // Skip on repeat visits
  if (sessionStorage.getItem('ktsnyc_visited')) {
    screen.classList.add('fade-out');
    setTimeout(function() { screen.remove(); }, 100);
    return;
  }

  var facePhotos = Array.from(screen.querySelectorAll('img.montage-face'));
  var landmarkPhotos = Array.from(screen.querySelectorAll('img.montage-landmark'));
  var logo = screen.querySelector('.montage-logo');
  var overlay = screen.querySelector('.montage-logo-overlay');
  var dotsContainer = screen.querySelector('.montage-dots');

  if (facePhotos.length === 0) {
    screen.classList.add('fade-out');
    setTimeout(function() { screen.remove(); }, 100);
    return;
  }

  // Strict alternation: face, landmark, face, landmark...
  // Use however many pairs we can make
  var pairs = Math.min(facePhotos.length, landmarkPhotos.length);
  var sequence = [];
  for (var i = 0; i < pairs; i++) {
    sequence.push({ photo: facePhotos[i], type: 'face' });
    sequence.push({ photo: landmarkPhotos[i], type: 'landmark' });
  }

  // Generate progress dots
  for (var d = 0; d < sequence.length; d++) {
    var dot = document.createElement('div');
    dot.className = 'montage-dot';
    dotsContainer.appendChild(dot);
  }
  var dots = dotsContainer.querySelectorAll('.montage-dot');

  var current = -1;

  function showNext() {
    // Fade out previous
    if (current >= 0) {
      sequence[current].photo.classList.remove('active');
      dots[current].classList.remove('active');
    }

    current++;

    if (current >= sequence.length) {
      // Fade straight to the site — no logo (hero has it)
      screen.classList.add('fade-out');
      sessionStorage.setItem('ktsnyc_visited', '1');
      setTimeout(function() { screen.remove(); }, 800);
      return;
    }

    sequence[current].photo.classList.add('active');
    dots[current].classList.add('active');

    // Faces hold longer, landmarks slightly quicker
    var hold = sequence[current].type === 'face' ? 900 : 700;
    setTimeout(showNext, hold);
  }

  setTimeout(showNext, 300);
})();
