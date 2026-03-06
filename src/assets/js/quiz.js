/* =====================================================
   "What Kind of New Yorker Are You?" Quiz
   Personality types drawn from Know The Score interviews
   ===================================================== */
(function () {
  var quizSection = document.getElementById('quiz');
  if (!quizSection) return;

  var questions = [
    {
      q: "It's Saturday with no plans. You...",
      options: [
        { text: "Wander a neighborhood you've never explored", type: "explorer" },
        { text: "Hit up a community event or volunteer gig", type: "builder" },
        { text: "Work on a side project at your favorite cafe", type: "survivor" },
        { text: "Check who's playing at the dive bar tonight", type: "lifer" },
        { text: "Journal by the water and hit a new restaurant", type: "striver" },
        { text: "Walk across a bridge at golden hour", type: "romantic" }
      ]
    },
    {
      q: "A friend visiting from out of town asks what to do. You...",
      options: [
        { text: "Give them a hyper-specific walking tour", type: "explorer" },
        { text: "Take them to a community garden or small museum", type: "builder" },
        { text: "Bring them to a local spot tourists don't know", type: "survivor" },
        { text: "Take them to a bar that's been open since the '70s", type: "lifer" },
        { text: "Curate a whole day of 'experiences'", type: "striver" },
        { text: "Show them the spot where you fell in love with the city", type: "romantic" }
      ]
    },
    {
      q: "What's the biggest thing New York has given you?",
      options: [
        { text: "Knowledge — there's always more to learn", type: "explorer" },
        { text: "Purpose — a reason to show up", type: "builder" },
        { text: "Confidence — nothing intimidates me anymore", type: "survivor" },
        { text: "Freedom — to live exactly how I want", type: "lifer" },
        { text: "Growth — I'm a completely different person now", type: "striver" },
        { text: "Meaning — I found myself here", type: "romantic" }
      ]
    },
    {
      q: "A new brunch spot replaces your favorite bodega. You...",
      options: [
        { text: "Research the building's history and post about it", type: "explorer" },
        { text: "Organize a petition to support local businesses", type: "builder" },
        { text: "Shrug — you've seen this a hundred times", type: "survivor" },
        { text: "Mourn it loudly and refuse to eat there", type: "lifer" },
        { text: "Find a new spot and adapt", type: "striver" },
        { text: "Write about it in your journal at 2am", type: "romantic" }
      ]
    },
    {
      q: "Pick a NYC movie.",
      options: [
        { text: "Ghostbusters", type: "explorer" },
        { text: "Do The Right Thing", type: "builder" },
        { text: "Working Girl", type: "survivor" },
        { text: "Taxi Driver", type: "lifer" },
        { text: "The Devil Wears Prada", type: "striver" },
        { text: "Manhattan", type: "romantic" }
      ]
    },
    {
      q: "Your relationship with New York is best described as...",
      options: [
        { text: "A never-ending research project", type: "explorer" },
        { text: "A partnership — we show up for each other", type: "builder" },
        { text: "A complicated ex I still love", type: "survivor" },
        { text: "A 30-year marriage — messy but permanent", type: "lifer" },
        { text: "A transformative affair", type: "striver" },
        { text: "The love of my life", type: "romantic" }
      ]
    },
    {
      q: "You think about leaving NYC. What pulls you back?",
      options: [
        { text: "There's always more to discover", type: "explorer" },
        { text: "I'd miss the people too much", type: "builder" },
        { text: "I've earned this — I'm not giving it up", type: "survivor" },
        { text: "Where else would I even go?", type: "lifer" },
        { text: "Leaving would mean it beat me", type: "striver" },
        { text: "I literally cannot imagine life anywhere else", type: "romantic" }
      ]
    }
  ];

  var results = {
    explorer: {
      title: "The Explorer",
      emoji: "\uD83D\uDDFA\uFE0F",
      quote: "The city has given me everything.",
      inspired: "Eden Seiferheld",
      desc: "You know that the best things in New York are the things you find by accident. You wander without a destination. You know the history of the building on the corner. You have opinions about which block of which street is underrated. The city is not just where you live \u2014 it is what you study."
    },
    builder: {
      title: "The Community Builder",
      emoji: "\uD83E\uDDF1",
      quote: "It\u2019s a community, not a playground.",
      inspired: "Jane August & Claire Akkan",
      desc: "You believe New York only works if people show up for each other. You know your bodega guy\u2019s name. You throw events not for clout but because strangers should become neighbors. You give more than you get and you\u2019re proud of it."
    },
    survivor: {
      title: "The Survivor",
      emoji: "\uD83D\uDCAA",
      quote: "The city is cold. The people are soft.",
      inspired: "Barella Roberson",
      desc: "You have been through it. The city has taken your innocence, your savings, probably a few friendships. But it also proved you can build something from nothing. You\u2019re tough on the outside and tender on the inside. Not a single room intimidates you."
    },
    lifer: {
      title: "The Lifer",
      emoji: "\uD83C\uDFD9\uFE0F",
      quote: "Why not? We\u2019re in New York.",
      inspired: "Martha Wilson & Robert Galinsky",
      desc: "You\u2019ve watched coffee shops become Chase branches and art spaces become luxury condos, and you\u2019re still here. You go out four nights a week because what else would you do. The city is your greatest love and your most frustrating relationship."
    },
    striver: {
      title: "The Striver",
      emoji: "\u2728",
      quote: "Living here is such a flex.",
      inspired: "Lulu Akingbade & Claire Akkan",
      desc: "You moved here to become someone. Not famous \u2014 just more yourself. The city has sharpened you. Some days you think about leaving. But then you walk across the bridge at sunset and remember: this is why. The fact that you survive here is the point."
    },
    romantic: {
      title: "The Romantic",
      emoji: "\uD83C\uDF09",
      quote: "She is the greatest lover and the worst bitch in the world.",
      inspired: "Robert Galinsky & Eden Seiferheld",
      desc: "You talk about New York the way other people talk about their ex. You remember the exact date you moved here. You have a spot, a route, a time of day when the light hits a particular building and you think: this is it, this is why I\u2019m here."
    }
  };

  var currentQ = 0;
  var scores = {};
  Object.keys(results).forEach(function (k) { scores[k] = 0; });

  var container = quizSection.querySelector('.quiz-body');
  var progress = quizSection.querySelector('.quiz-progress-fill');
  var counter = quizSection.querySelector('.quiz-counter');

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function render() {
    var q = questions[currentQ];
    var pct = ((currentQ) / questions.length) * 100;
    progress.style.width = pct + '%';
    counter.textContent = (currentQ + 1) + ' / ' + questions.length;

    var html = '<div class="quiz-question">' + q.q + '</div>';
    html += '<div class="quiz-options">';
    var shuffled = shuffle(q.options.slice());
    shuffled.forEach(function (opt) {
      html += '<button class="quiz-option" data-type="' + opt.type + '">' + opt.text + '</button>';
    });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = this.getAttribute('data-type');
        scores[type]++;
        this.classList.add('selected');

        setTimeout(function () {
          currentQ++;
          if (currentQ >= questions.length) {
            showResult();
          } else {
            render();
          }
        }, 350);
      });
    });
  }

  function showResult() {
    progress.style.width = '100%';
    counter.textContent = 'Done!';

    var maxType = 'explorer';
    var maxScore = 0;
    Object.keys(scores).forEach(function (k) {
      if (scores[k] > maxScore) {
        maxScore = scores[k];
        maxType = k;
      }
    });

    var r = results[maxType];
    var html = '<div class="quiz-result">';
    html += '<div class="quiz-result-emoji">' + r.emoji + '</div>';
    html += '<div class="quiz-result-title">You are: ' + r.title + '</div>';
    html += '<div class="quiz-result-quote">"' + r.quote + '"</div>';
    html += '<div class="quiz-result-desc">' + r.desc + '</div>';
    html += '<div class="quiz-result-inspired">Inspired by <strong>' + r.inspired + '</strong> from Know The Score NYC</div>';
    html += '<div class="quiz-result-actions">';
    html += '<button class="btn btn-primary quiz-retake">Take Again</button>';
    html += '<a href="https://knowthescorenyc.substack.com" class="btn btn-secondary" target="_blank" rel="noopener">Read the Interviews</a>';
    html += '</div>';
    html += '</div>';
    container.innerHTML = html;

    container.querySelector('.quiz-retake').addEventListener('click', function () {
      currentQ = 0;
      Object.keys(scores).forEach(function (k) { scores[k] = 0; });
      render();
    });
  }

  render();
})();
