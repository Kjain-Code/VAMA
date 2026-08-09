// sticky header shadow on scroll
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // animated counters
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const isDecimal = el.dataset.decimal === 'true';
      let cur = 0;
      const step = Math.max(1, Math.round(target / 60));
      const tick = () => {
        cur += step;
        if (cur >= target) cur = target;
        el.textContent = isDecimal ? (cur / 10).toFixed(1) : cur.toLocaleString('en-IN');
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  // hair-stage selector
  const stageCards = document.querySelectorAll('.stage-card');
  const stageResult = document.getElementById('stageResult');
  const stageRecText = document.getElementById('stageRecText');
  const concernSelect = document.getElementById('lf-concern');
  const stageToConcern = {
    thin: 'Thinning hair',
    recede: 'Receding hairline',
    patch: 'Bald patch / crown',
    extensive: 'Extensive hair loss',
    unsure: 'Not sure — need advice'
  };
  stageCards.forEach(card => {
    card.addEventListener('click', () => {
      stageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      stageRecText.textContent = card.dataset.rec;
      stageResult.classList.add('show');
      const mapped = stageToConcern[card.dataset.stage];
      if (mapped && concernSelect) concernSelect.value = mapped;
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // testimonial nav
  const track = document.getElementById('testTrack');
  document.getElementById('testNext').addEventListener('click', () => track.scrollBy({ left: 340, behavior: 'smooth' }));
  document.getElementById('testPrev').addEventListener('click', () => track.scrollBy({ left: -340, behavior: 'smooth' }));

  // lead form -> WhatsApp handoff (no backend required)
  // NOTE: To collect leads into email / Google Sheet / CRM instead of (or in addition to)
  // WhatsApp, replace the block below with a fetch() call to your backend/Formspree endpoint.
  const leadForm = document.getElementById('leadForm');
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('lf-name').value.trim();
    const phone = document.getElementById('lf-phone').value.trim();
    const city = document.getElementById('lf-city').value;
    const concern = document.getElementById('lf-concern').value;

    const msg = `Hi VAMA Clinic, I'd like a free hair transplant analysis.%0AName: ${encodeURIComponent(name)}%0APhone: ${phone}%0APreferred clinic: ${encodeURIComponent(city)}%0AConcern: ${encodeURIComponent(concern)}`;
    const waLink = `https://api.whatsapp.com/send?phone=918882911433&text=${msg}`;
    document.getElementById('waConfirmLink').href = waLink;

    document.getElementById('formView').style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');

    // Auto-open WhatsApp for the lead
    window.open(waLink, '_blank');
  });