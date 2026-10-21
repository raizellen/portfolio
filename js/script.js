(function () {
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Name tiles hop when clicked ---------- */
  var tiles = document.querySelectorAll(".tile");
  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      tile.classList.remove("hop");
      void tile.offsetWidth; // restart the animation
      tile.classList.add("hop");
    });
    tile.addEventListener("animationend", function (e) {
      if (e.animationName === "hop") tile.classList.remove("hop");
    });
  });

  /* ---------- Projects gallery ---------- */
  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var prev = document.querySelector("[data-gallery-prev]");
    var next = document.querySelector("[data-gallery-next]");
    var dotsBox = document.querySelector("[data-gallery-dots]");
    var cards = gallery.querySelectorAll(".project-card");
    var dots = [];

    var step = function () {
      var gap = parseFloat(getComputedStyle(gallery).columnGap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    };
    var behavior = reduced ? "auto" : "smooth";

    var goTo = function (i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      gallery.scrollTo({ left: i * step(), behavior: behavior });
    };

    cards.forEach(function (card, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", "Go to project " + (i + 1) + " of " + cards.length);
      dot.addEventListener("click", function () { goTo(i); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });

    var update = function () {
      var max = gallery.scrollWidth - gallery.clientWidth;
      var index = Math.round(gallery.scrollLeft / step());
      if (gallery.scrollLeft >= max - 4) index = cards.length - 1;
      index = Math.max(0, Math.min(cards.length - 1, index));
      dots.forEach(function (d, i) {
        if (i === index) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
      prev.disabled = gallery.scrollLeft <= 4;
      next.disabled = gallery.scrollLeft >= max - 4;
    };

    prev.addEventListener("click", function () {
      gallery.scrollBy({ left: -step(), behavior: behavior });
    });
    next.addEventListener("click", function () {
      gallery.scrollBy({ left: step(), behavior: behavior });
    });
    gallery.addEventListener("keydown", function (e) {
      if (e.target !== gallery) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    gallery.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- The cat ---------- */
  var INK = "#3a2430", BLUSH = "#f8ebe5", ROSE = "#d4878f", OCHRE = "#dba548";
  var catSvg =
    '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<path class="tail" d="M24 82 C4 82 4 56 18 52" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="76" rx="28" ry="20" fill="' + INK + '"/>' +
    '<ellipse cx="62" cy="94" rx="9" ry="5" fill="' + INK + '"/>' +
    '<ellipse cx="38" cy="94" rx="9" ry="5" fill="' + INK + '"/>' +
    '<polygon points="50,36 54,12 69,25" fill="' + INK + '"/>' +
    '<polygon points="65,25 80,12 85,37" fill="' + INK + '"/>' +
    '<polygon points="54,30 56,19 63,26" fill="' + ROSE + '"/>' +
    '<polygon points="71,26 79,19 81,31" fill="' + ROSE + '"/>' +
    '<circle cx="67" cy="44" r="21" fill="' + INK + '"/>' +
    '<path d="M50 61 Q67 71 84 59" fill="none" stroke="' + OCHRE + '" stroke-width="6" stroke-linecap="round"/>' +
    '<g class="eyes">' +
    '<circle cx="60" cy="43" r="4" fill="' + BLUSH + '"/><circle cx="75" cy="43" r="4" fill="' + BLUSH + '"/>' +
    '<circle cx="61" cy="44" r="2" fill="' + INK + '"/><circle cx="76" cy="44" r="2" fill="' + INK + '"/>' +
    '</g>' +
    '<polygon points="64,50 70,50 67,54" fill="' + ROSE + '"/>' +
    '<path d="M67 54 Q63 58 60 56 M67 54 Q71 58 74 56" fill="none" stroke="' + BLUSH + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M50 52 H42 M50 56 L43 60 M84 52 H92 M84 56 L91 60" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>' +
    '</svg>';

  var lines = [
    "Meow!",
    "She builds apps AND teaches kids to code.",
    "Psst, the projects page has an astronaut HUD.",
    "Ask her about recursion. She has a great explanation.",
    "Do that again. I liked it.",
    "StyleU is a whole outfit planner. Go look.",
    "Dean's List three years running.",
    "Purr. Keep clicking.",
    "Email her. She replies. Probably."
  ];

  var cat = document.createElement("div");
  cat.className = "cat";
  cat.innerHTML =
    '<div class="bubble" role="status" aria-live="polite"></div>' +
    '<button class="cat-btn" type="button" aria-label="Pet the cat and make it jump">' + catSvg + "</button>";
  document.body.appendChild(cat);

  var bubble = cat.querySelector(".bubble");
  var button = cat.querySelector(".cat-btn");
  var x = 12;
  var busy = false;
  var hideTimer = null;
  var lastLine = -1;

  function maxX() {
    return Math.max(12, window.innerWidth - cat.offsetWidth - 12);
  }

  function say(text, atX) {
    bubble.textContent = text;
    // Keep the bubble on screen: anchor it to the side of the cat facing the middle of the page.
    cat.classList.toggle("bubble-right", atX > window.innerWidth / 2 - cat.offsetWidth);
    bubble.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { bubble.classList.remove("show"); }, 3800);
  }

  function randomLine() {
    var i;
    do { i = Math.floor(Math.random() * lines.length); } while (i === lastLine && lines.length > 1);
    lastLine = i;
    return lines[i];
  }

  function place(left) {
    x = left;
    cat.style.left = x + "px";
  }

  function pickTarget() {
    var target = x;
    for (var tries = 0; tries < 12; tries++) {
      target = 12 + Math.random() * (maxX() - 12);
      if (Math.abs(target - x) > 140) break;
    }
    return target;
  }

  function jump(text) {
    if (busy) return;
    var target = pickTarget();
    var dx = target - x;
    cat.classList.toggle("faces-left", dx < 0);
    say(text, target);
    if (reduced || !cat.animate) { place(target); return; }

    busy = true;
    var height = 110 + Math.random() * 60;
    var frames = [
      { transform: "translate(0px, 0px) scale(1, 1)", offset: 0 },
      { transform: "translate(0px, 0px) scale(1.12, 0.84)", offset: 0.12 }
    ];
    var n = 8;
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      var arc = 4 * t * (1 - t);
      frames.push({
        transform: "translate(" + (dx * t).toFixed(1) + "px, " + (-height * arc).toFixed(1) +
          "px) scale(" + (0.94 + 0.04 * (1 - arc)).toFixed(2) + ", " + (1.08 - 0.04 * (1 - arc)).toFixed(2) + ")",
        offset: 0.12 + 0.76 * t
      });
    }
    frames.push({ transform: "translate(" + dx.toFixed(1) + "px, 0px) scale(1.15, 0.82)", offset: 0.94 });
    frames.push({ transform: "translate(" + dx.toFixed(1) + "px, 0px) scale(1, 1)", offset: 1 });

    var anim = cat.animate(frames, { duration: 950, easing: "linear" });
    anim.onfinish = function () {
      place(target);
      busy = false;
    };
  }

  button.addEventListener("click", function () { jump(randomLine()); });

  window.addEventListener("resize", function () {
    if (x > maxX()) place(maxX());
  });

  // One greeting hop shortly after the page loads.
  setTimeout(function () { jump("Hi! Click me."); }, 1100);
})();
