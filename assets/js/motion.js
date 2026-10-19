/*
 * All animation lives here, built on GSAP (core, ScrollTrigger and Flip).
 * Every method is safe to call when GSAP failed to load or the visitor
 * prefers reduced motion: the page still works, it just doesn't move.
 */
(function () {
  const hasGsap = typeof window.gsap !== 'undefined';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const animate = hasGsap && !reduced;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger, Flip);

  const revealed = new WeakSet();

  /* ---------- The flower ----------
     Used by the hero and every programme card. Each petal stores its resting angle in
     data-r and turns around the flower's centre (svgOrigin 0 0). */

  function flowerParts(root) {
    return {
      outer: root.querySelectorAll('.f-petal'),
      inner: root.querySelectorAll('.f-inner'),
      centre: root.querySelectorAll('.f-ring, .f-core'),
    };
  }

  // Folds the flower into its centre, ready to bloom
  function closeFlower(root) {
    const { outer, inner, centre } = flowerParts(root);
    outer.forEach((p) => gsap.set(p, { svgOrigin: '0 0', rotation: +p.dataset.r - 60, scale: 0 }));
    inner.forEach((p) => gsap.set(p, { svgOrigin: '0 0', rotation: +p.dataset.r + 40, scale: 0 }));
    gsap.set(centre, { svgOrigin: '0 0', scale: 0 });
  }

  function openFlower(root) {
    const { outer, inner, centre } = flowerParts(root);
    [...outer, ...inner].forEach((p) => gsap.set(p, { svgOrigin: '0 0', rotation: +p.dataset.r, scale: 1 }));
    gsap.set(centre, { scale: 1 });
  }

  // Centre pops, outer petals unfurl in turn, then the cream petals open on top
  function bloomFlower(root, delay = 0, duration = 1.1) {
    const { outer, inner, centre } = flowerParts(root);
    return gsap.timeline({ delay })
      .to(centre, { scale: 1, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.08 }, 0)
      .to(outer, { rotation: (i, el) => +el.dataset.r, scale: 1, duration, ease: 'elastic.out(1, .65)', stagger: 0.07 }, 0.1)
      .to(inner, { rotation: (i, el) => +el.dataset.r, scale: 1, duration: duration * 0.8, ease: 'back.out(1.8)', stagger: 0.05 }, 0.45);
  }

  /* ---------- Hero: the colour takeover ----------
     Plays on its own when the page loads, like a title sequence:
       1. the seed, with "One seed. Six ways to grow."
       2. six full-screen colour panels wipe up in turn, one per programme
       3. the last panel lifts away and six petals sweep in to form the flower
       4. the flower spins and lands in the "O" of BLOOMCON, and the lockup appears
     Scrolling or Skip jumps to step 3; Replay plays it again. */

  // Centre of an element within the stage, from layout offsets (unaffected by GSAP transforms)
  function centreIn(el, stage) {
    let x = el.offsetWidth / 2;
    let y = el.offsetHeight / 2;
    for (let node = el; node && node !== stage; node = node.offsetParent) {
      x += node.offsetLeft;
      y += node.offsetTop;
    }
    return { x, y };
  }

  function hero() {
    const section = document.getElementById('top');
    if (!animate) { section.classList.add('hero-static'); return; }

    const stage = section.querySelector('.hero-stage');
    const visual = document.getElementById('heroVisual');
    const flower = document.getElementById('heroFlower');
    const outer = flower.querySelectorAll('.f-petal');
    const inner = flower.querySelectorAll('.f-inner');
    const centre = flower.querySelectorAll('.f-ring, .f-core');
    const intro = section.querySelector('.tk-intro');
    const panels = section.querySelectorAll('.tk-panel');
    const finals = section.querySelectorAll('[data-final]');
    const slot = section.querySelector('.o-slot');
    const skip = section.querySelector('.hero-skip');
    const replay = section.querySelector('.hero-replay');

    // Petals start huge and see-through, swung round, ready to sweep in.
    // Each petal's base sits on the flower centre, so it pivots on its own bottom-centre.
    outer.forEach((p) => gsap.set(p, { transformOrigin: '50% 100%', rotation: +p.dataset.r + 90, scale: 3, autoAlpha: 0 }));
    inner.forEach((p) => gsap.set(p, { transformOrigin: '50% 100%', rotation: +p.dataset.r - 45, scale: 0 }));
    gsap.set(panels, { clipPath: 'inset(100% 0% 0% 0%)' });
    panels.forEach((panel) => gsap.set(panel.querySelector('.tk-petal'), { transformOrigin: '50% 100%', rotation: -28, scaleY: 0 }));
    gsap.set(section.querySelectorAll('.tk-word > span'), { yPercent: 105 });
    gsap.set(section.querySelectorAll('.tk-line'), { autoAlpha: 0, y: 16 });
    gsap.set(finals, { y: 24 });
    section.classList.add('hero-ready');

    // Offset and scale that put the flower into the "O" slot.
    // The drawn flower spans about 69% of its box (inset 11%, petals reach 389 of 440 units).
    const dock = () => {
      const from = centreIn(visual, stage);
      const to = centreIn(slot, stage);
      return { x: to.x - from.x, y: to.y - from.y, scale: slot.offsetWidth / (visual.offsetWidth * 0.69) };
    };

    const STEP = 1.5; // seconds each programme panel holds the screen
    const PANELS_AT = 1; // the intro is a quick beat: the first panel arrives after a second
    const tl = gsap.timeline({
      delay: 0.25,
      onStart: () => gsap.to(skip, { autoAlpha: 1, duration: 0.4 }),
      onComplete: () => {
        tl.timeScale(1);
        gsap.to(skip, { autoAlpha: 0, duration: 0.3 });
        gsap.to(replay, { autoAlpha: 1, duration: 0.4 });
      },
    });

    // 1. The seed
    tl.from(centre, { scale: 0, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2.5)', stagger: 0.08 })
      .from(intro.children, { autoAlpha: 0, y: 16, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, 0.1);

    // 2. Six colour panels, each wiping up over the last
    panels.forEach((panel, i) => {
      const at = PANELS_AT + i * STEP;
      tl.to(panel, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut' }, at)
        .to(panel.querySelector('.tk-petal'), { scaleY: 1, duration: 1.1, ease: 'power3.out' }, at + 0.25)
        .to(panel.querySelectorAll('.tk-word > span'), { yPercent: 0, duration: 0.7, ease: 'power4.out', stagger: 0.07 }, at + 0.35)
        .to(panel.querySelectorAll('.tk-line'), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, at + 0.45);
    });

    // 3. The last panel lifts away and the petals gather into the flower
    tl.addLabel('gather', PANELS_AT + 6 * STEP)
      .set(intro, { autoAlpha: 0 }, 'gather')
      .set([...panels].slice(0, -1), { clipPath: 'inset(0% 0% 100% 0%)' }, 'gather')
      .to(panels[panels.length - 1], { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power4.inOut' }, 'gather')
      .to(outer, { rotation: (i, el) => +el.dataset.r, scale: 1, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.07 }, 'gather+=0.35')
      .to(inner, { rotation: (i, el) => +el.dataset.r, scale: 1, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.04 }, 'gather+=1.1');

    // 4. Spin once and fly into the wordmark
    tl.addLabel('land', 'gather+=1.6')
      .to(flower.querySelector('.f-flower'), { rotation: 360, transformOrigin: '50% 50%', duration: 1.2, ease: 'power2.inOut' }, 'land')
      .to(visual, { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, duration: 1.1, ease: 'power3.inOut' }, 'land+=0.45')
      .to(finals, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 'land+=1');

    // Skipping goes straight to the gather, then plays the ending a little faster
    const skipAhead = () => {
      if (tl.time() >= tl.labels.gather) return;
      tl.seek('gather').timeScale(1.6).play();
    };
    skip.addEventListener('click', skipAhead);
    // The first scroll gesture skips ahead, so nobody has to wait for the sequence
    const onScrollIntent = (e) => {
      if (e.type === 'keydown' && !['ArrowDown', 'PageDown', 'End', ' '].includes(e.key)) return;
      skipAhead();
    };
    ['wheel', 'touchmove', 'keydown'].forEach((type) => window.addEventListener(type, onScrollIntent, { passive: true }));
    window.addEventListener('scroll', () => { if (window.scrollY > 10) skipAhead(); }, { passive: true });

    replay.addEventListener('click', () => {
      gsap.to(replay, { autoAlpha: 0, duration: 0.2 });
      window.scrollTo({ top: 0, behavior: 'instant' }); // otherwise the scroll-to-skip would end it at once
      tl.timeScale(1).restart(true);
    });

    // Keep the flower in the "O" if the window changes size after it has landed
    window.addEventListener('resize', () => { if (tl.progress() === 1) gsap.set(visual, dock()); });

    // Then the next section slides up over the hero as it sinks back
    gsap.to(stage, {
      scale: 0.92, opacity: 0.4, borderRadius: 40, transformOrigin: '50% 100%', ease: 'none',
      scrollTrigger: { trigger: '.journey', start: 'top bottom', end: 'top 30%', scrub: true },
    });
  }

  /* ---------- Programme cards ---------- */

  function closeBud(card) {
    closeFlower(card);
    gsap.set(card.querySelector('.card-ring'), { strokeDasharray: 460, strokeDashoffset: 460 });
  }

  function openBud(card) {
    openFlower(card);
    gsap.set(card.querySelector('.card-ring'), { strokeDashoffset: 0 });
  }

  function bloom(card, delay = 0) {
    bloomFlower(card, delay);
    gsap.to(card.querySelector('.card-ring'), { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay });
    gsap.from(card.querySelector('.card-icon'), { scale: 0, duration: 0.6, ease: 'back.out(2.4)', delay: delay + 0.35 });
  }

  function revealCard(card, index) {
    if (revealed.has(card)) return;
    revealed.add(card);
    gsap.to(card, {
      opacity: 1, y: 0, rotationX: 0, clipPath: 'inset(0% 0% 0% 0% round 28px)',
      duration: 1.1, ease: 'expo.out', delay: index * 0.11,
      onComplete: () => gsap.set(card, { clearProps: 'clipPath,transform' }),
    });
    bloom(card, 0.2 + index * 0.11);
  }

  function addHoverTilt(card) {
    const inner = card.querySelector('.card-inner');
    const icon = card.querySelector('.card-icon');
    const { outer, inner: innerPetals } = flowerParts(card);
    let turns = 0;
    const tiltX = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
    const tiltY = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
    gsap.set(inner, { transformPerspective: 1000 });

    card.addEventListener('pointermove', (e) => {
      const r = inner.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      inner.style.setProperty('--mx', `${x * 100}%`);
      inner.style.setProperty('--my', `${y * 100}%`);
      tiltX((0.5 - y) * 7);
      tiltY((x - 0.5) * 9);
    });

    card.addEventListener('pointerenter', () => {
      if (!revealed.has(card)) return;
      turns += 1;
      gsap.to(outer, { rotation: (i, el) => +el.dataset.r + turns * 60, duration: 0.9, ease: 'back.out(1.6)', overwrite: 'auto' });
      gsap.to(innerPetals, { rotation: (i, el) => +el.dataset.r - turns * 60, duration: 0.9, ease: 'back.out(1.6)', overwrite: 'auto' });
      gsap.to(icon, { y: -3, rotation: -8, duration: 0.5, ease: 'back.out(3)' });
    });

    card.addEventListener('pointerleave', () => {
      tiltX(0);
      tiltY(0);
      if (!revealed.has(card)) return;
      gsap.to(icon, { y: 0, rotation: 0, duration: 0.5 });
    });
  }

  function cards() {
    const all = gsap.utils.toArray('.prog-card');
    if (!animate) { all.forEach((c) => revealed.add(c)); return; }

    all.forEach(closeBud);
    gsap.set(all, { opacity: 0, y: 70, rotationX: -16, transformPerspective: 1000, transformOrigin: '50% 100%', clipPath: 'inset(35% 0% 0% 0% round 28px)' });
    ScrollTrigger.batch(all, { start: 'top 90%', once: true, onEnter: (batch) => batch.forEach(revealCard) });
    if (finePointer) all.forEach(addHoverTilt);
  }

  // Makes every card visible at once, used before a filter change re-flows the grid.
  function revealAllCards() {
    if (!hasGsap) return;
    gsap.utils.toArray('.prog-card').forEach((c) => {
      if (revealed.has(c)) return;
      revealed.add(c);
      gsap.set(c, { opacity: 1, y: 0, rotationX: 0, clearProps: 'clipPath,transform' });
      openBud(c);
    });
  }

  /* ---------- Simple fade-up for other blocks ---------- */

  function reveals() {
    if (!animate) return;
    const items = gsap.utils.toArray('.reveal');
    gsap.set(items, { opacity: 0, y: 32 });
    ScrollTrigger.batch(items, {
      start: 'top 88%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }),
    });
  }

  /* ---------- Public API used by app.js ---------- */

  window.Motion = {
    // Petal confetti from a point, in the colour of the clicked element
    burst(x, y, color) {
      if (!animate) return;
      for (let i = 0; i < 12; i++) {
        const petal = document.createElement('span');
        petal.className = 'burst-petal';
        petal.style.background = color;
        document.body.appendChild(petal);
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 46 + Math.random() * 44;
        gsap.set(petal, { left: x, top: y, rotation: angle * 57.3 + 90, scale: 0.6 });
        gsap.to(petal, {
          x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 18, rotation: '+=140', scale: 1, opacity: 0,
          duration: 0.95, ease: 'power3.out', onComplete: () => petal.remove(),
        });
      }
    },

    bump(el) {
      if (animate && el) gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, .4)' });
    },

    // Captures card positions before a filter change; call the returned function after the DOM updates.
    flipCards() {
      if (!hasGsap) return () => {};
      revealAllCards();
      const state = Flip.getState('.prog-card');
      return () => Flip.from(state, {
        duration: reduced ? 0 : 0.7, ease: 'power3.inOut', absolute: true, stagger: 0.035, scale: true,
        // Entering cards can keep a stray offset from Flip's absolute positioning, so reset them at the end
        onComplete: () => gsap.set('.prog-card', { clearProps: 'transform' }),
        onEnter: (els) => {
          if (reduced) return;
          gsap.fromTo(els, { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.6, delay: 0.2, ease: 'expo.out', stagger: 0.05, clearProps: 'transform' });
          els.forEach((el, i) => { closeBud(el); bloom(el, 0.3 + i * 0.06); });
        },
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' }),
      });
    },

    // Grows a dialog panel out of the element that opened it
    dialogIn(panel, fromEl) {
      if (!animate || !fromEl) return;
      gsap.fromTo(panel, offsetFrom(fromEl, panel, 0.4), { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.7, ease: 'expo.out', clearProps: 'transform' });
      gsap.from(panel.querySelectorAll('.d-stagger'), { opacity: 0, y: 14, duration: 0.5, stagger: 0.04, delay: 0.2, ease: 'power2.out' });
    },

    // Shrinks a dialog panel back into its source, then calls done()
    dialogOut(panel, fromEl, done) {
      if (!animate || !fromEl) { done(); return; }
      gsap.to(panel, { ...offsetFrom(fromEl, panel, 0), duration: 0.4, ease: 'power3.in', onComplete: () => { gsap.set(panel, { clearProps: 'all' }); done(); } });
    },

    ticket(el) {
      if (!animate || !el) return;
      gsap.fromTo(el, { y: 30, rotationX: -20, opacity: 0, transformPerspective: 800 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.9, ease: 'expo.out' });
      const r = el.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + 40, 'rgb(232 177 59)');
    },
  };

  function offsetFrom(source, target, opacity) {
    const r = source.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - (t.left + t.width / 2),
      y: r.top + r.height / 2 - (t.top + t.height / 2),
      scaleX: r.width / t.width,
      scaleY: Math.min(r.height / t.height, 1.4),
      opacity,
    };
  }

  /* ---------- Start ---------- */

  // Cards and lists are rendered by Alpine templates, so wait until Alpine has built them
  document.addEventListener('alpine:initialized', () => {
    hero(); // first: its pin changes where everything below sits
    if (!hasGsap) return;
    cards();
    reveals();

    // Web fonts can shift layout after first paint, so re-measure scroll positions once they settle.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
  });

  // If Alpine never started the story (e.g. its script was blocked), show the static lockup
  window.addEventListener('load', () => {
    const section = document.getElementById('top');
    if (!section.classList.contains('hero-ready')) section.classList.add('hero-static');
  });
})();
