// sticky header shadow on scroll
const header = document.getElementById('siteHeader');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });
}


// scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {

    if (en.isIntersecting) {

      en.target.classList.add('in');

      io.unobserve(en.target);

    }

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

      if (cur >= target) {
        cur = target;
      }

      el.textContent = isDecimal
        ? (cur / 10).toFixed(1)
        : cur.toLocaleString('en-IN');


      if (cur < target) {
        requestAnimationFrame(tick);
      }

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


    if (stageRecText) {
      stageRecText.textContent = card.dataset.rec;
    }


    if (stageResult) {
      stageResult.classList.add('show');
    }


    const mapped = stageToConcern[card.dataset.stage];


    if (mapped && concernSelect) {
      concernSelect.value = mapped;
    }

  });

});


// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {

  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');


  if (!q || !a) return;


  q.addEventListener('click', () => {

    const isOpen = item.classList.contains('open');


    document
      .querySelectorAll('.faq-item.open')
      .forEach(o => {

        o.classList.remove('open');

        const answer = o.querySelector('.faq-a');

        if (answer) {
          answer.style.maxHeight = null;
        }

      });


    if (!isOpen) {

      item.classList.add('open');

      a.style.maxHeight = a.scrollHeight + 'px';

    }

  });

});


// testimonial nav
const track = document.getElementById('testTrack');
const testNext = document.getElementById('testNext');
const testPrev = document.getElementById('testPrev');


if (track && testNext && testPrev) {

  testNext.addEventListener('click', () => {

    track.scrollBy({
      left: 340,
      behavior: 'smooth'
    });

  });


  testPrev.addEventListener('click', () => {

    track.scrollBy({
      left: -340,
      behavior: 'smooth'
    });

  });

}


// ======================================================
// LEAD FORM -> PRIVYR + WHATSAPP
// ======================================================

const leadForm = document.getElementById('leadForm');


if (leadForm) {

  leadForm.addEventListener('submit', async (e) => {

    e.preventDefault();


    const nameElement = document.getElementById('lf-name');
    const phoneElement = document.getElementById('lf-phone');
    const cityElement = document.getElementById('lf-city');
    const concernElement = document.getElementById('lf-concern');


    const name = nameElement ? nameElement.value.trim() : '';
    const phone = phoneElement ? phoneElement.value.trim() : '';
    const city = cityElement ? cityElement.value : '';
    const concern = concernElement ? concernElement.value : '';


    if (!name || !phone || !city || !concern) {
      return;
    }


    // ------------------------------------------
    // SEND LEAD TO PRIVYR
    // ------------------------------------------

    try {

      const response = await fetch('/api/lead', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          name: name,

          phone: phone,

          city: city,

          concern: concern,

          source: 'Weight Loss Landing Page'

        })

      });


      if (!response.ok) {

        console.error('Privyr lead submission failed');

      }

    } catch (error) {

      console.error('Privyr connection error:', error);

    }


    // ------------------------------------------
    // WHATSAPP
    // ------------------------------------------

    const msg =
      `Hi VAMA Clinic, I'd like a free weight loss consultation.%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Phone: ${encodeURIComponent(phone)}%0A` +
      `Preferred clinic: ${encodeURIComponent(city)}%0A` +
      `Concern: ${encodeURIComponent(concern)}`;


    const waLink =
      `https://api.whatsapp.com/send?phone=918882911433&text=${msg}`;


    const waConfirmLink =
      document.getElementById('waConfirmLink');


    if (waConfirmLink) {

      waConfirmLink.href = waLink;

    }


    const formView =
      document.getElementById('formView');

    const formSuccess =
      document.getElementById('formSuccess');


    if (formView) {

      formView.style.display = 'none';

    }


    if (formSuccess) {

      formSuccess.classList.add('show');

    }


    // Open WhatsApp
    window.open(waLink, '_blank');

  });

}