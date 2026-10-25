// KMO Groeiscan
// Pas vragen, tips en profielen hieronder aan; de rest van de code hoeft niet te veranderen.
// Elk antwoord is 0 tot 3 punten waard, in de volgorde waarin het in de lijst staat.

const CONTACT_EMAIL = 'hello@briquedigital.be';

const QUESTIONS = [
  {
    pillar: 'Aantrekken',
    question: 'Hoe komen nieuwe klanten nu bij je terecht?',
    answers: [
      'Vooral via mond-tot-mond',
      'Af en toe via de website, zonder plan',
      'Via ads of SEO, maar onregelmatig',
      'Via vaste kanalen die voorspelbaar leads opleveren',
    ],
  },
  {
    pillar: 'Aantrekken',
    question: 'Weet je wat één nieuwe lead je gemiddeld kost?',
    answers: [
      'Geen idee',
      'Ik heb een ruwe schatting',
      'Ja, voor sommige kanalen',
      'Ja, per kanaal, en ik stuur erop bij',
    ],
  },
  {
    pillar: 'Opvolgen',
    question: 'Hoe snel reageer je op een nieuwe aanvraag?',
    answers: [
      'Binnen een week, als ik eraan denk',
      'Binnen een paar dagen',
      'Binnen 24 uur',
      'Binnen het uur, en de eerste stap gaat automatisch',
    ],
  },
  {
    pillar: 'Opvolgen',
    question: 'Waar houd je je leads bij?',
    answers: [
      'In mijn mailbox of in mijn hoofd',
      'In een Excel of een lijstje',
      'In een CRM, maar alles gaat manueel',
      'In een CRM met automatische opvolging',
    ],
  },
  {
    pillar: 'Omzetten',
    question: 'Hoeveel van je offertes worden een klant?',
    answers: [
      'Geen idee',
      'Minder dan 1 op 5',
      'Tussen 1 en 2 op 5',
      'Meer dan 2 op 5',
    ],
  },
  {
    pillar: 'Omzetten',
    question: 'Wat gebeurt er met een offerte zonder antwoord?',
    answers: [
      'Niets, ik wacht af',
      'Ik bel of mail soms nog eens',
      'Ik volg altijd op na een vaste termijn',
      'Er loopt een vaste opvolgflow, deels automatisch',
    ],
  },
  {
    pillar: 'Meten',
    question: 'Weet je welk kanaal je de meeste omzet oplevert?',
    answers: [
      'Nee',
      'Ik heb een buikgevoel',
      'Ja, ongeveer',
      'Ja, ik zie het zwart op wit in mijn cijfers',
    ],
  },
  {
    pillar: 'Meten',
    question: 'Hoe zit het met je tracking (GA4, pixels, conversies)?',
    answers: [
      'Geen idee of het werkt',
      'Er staat iets, maar niemand kijkt ernaar',
      'Het werkt en ik kijk er af en toe naar',
      'Correct ingesteld, en ik bekijk het maandelijks',
    ],
  },
];

const TIPS = {
  Aantrekken: [
    'Kies één kanaal waar je doelgroep zit en zet daar drie maanden consequent op in, in plaats van overal een beetje.',
    'Bereken je kost per lead per kanaal. Pas dan weet je waar je budget het meeste oplevert.',
  ],
  Opvolgen: [
    'Reageer binnen 24 uur op elke aanvraag. Hoe sneller je antwoordt, hoe groter de kans op een gesprek.',
    'Zet al je leads op één plek en laat een eerste mail automatisch vertrekken.',
  ],
  Omzetten: [
    'Volg elke offerte op na 3 en na 7 dagen. Veel deals gaan verloren door stilte, niet door de prijs.',
    'Houd bij welke offertes je wint en verliest, en waarom. Zo zie je waar je aanbod sterker kan.',
  ],
  Meten: [
    'Stel conversies in voor wat echt telt: aanvragen, telefoontjes, offertes. Niet alleen bezoekers.',
    'Kijk één keer per maand naar dezelfde 3 à 5 cijfers. Regelmaat zegt meer dan een groot rapport.',
  ],
};

const PROFILES = [
  { max: 8, name: 'Starter', text: 'Je marketing draait vooral op toeval en mond-tot-mond. Goed nieuws: hier liggen de snelste winsten.' },
  { max: 16, name: 'Groeier', text: 'Je hebt een basis, maar er lekt nog groei weg tussen de stappen.' },
  { max: 24, name: 'Versneller', text: 'Je marketing staat er. Nu draait het om slim opschalen en bijsturen op cijfers.' },
];

const PILLARS = ['Aantrekken', 'Opvolgen', 'Omzetten', 'Meten'];
const MAX_PER_PILLAR = 6;

const root = document.getElementById('scan');
let answers = [];
let current = 0;

function show(html) {
  root.innerHTML = html;
  root.classList.remove('step-in');
  void root.offsetWidth; // herstart de animatie
  root.classList.add('step-in');
  const focusTarget = root.querySelector('[data-focus]');
  if (focusTarget) focusTarget.focus({ preventScroll: true });
}

function renderStart() {
  show(`
    <p class="scan-kicker">KMO Groeiscan</p>
    <h1>Hoe klaar is jouw marketing om te groeien?</h1>
    <p class="scan-meta">8 vragen · 2 minuten · meteen resultaat</p>
    <button class="btn btn-cta btn-big" data-action="start" data-focus>
      Start de scan <span class="cta-icon">→</span>
    </button>
  `);
}

function renderQuestion() {
  const q = QUESTIONS[current];
  const progress = (current / QUESTIONS.length) * 100;

  show(`
    <div class="scan-progress" role="progressbar" aria-valuenow="${current}" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}">
      <div class="scan-progress-bar" style="width: ${progress}%"></div>
    </div>
    <p class="scan-kicker">Vraag ${current + 1} van ${QUESTIONS.length} · ${q.pillar}</p>
    <h2 tabindex="-1" data-focus>${q.question}</h2>
    <div class="scan-answers">
      ${q.answers.map((a, i) => `
        <button class="scan-answer${answers[current] === i ? ' selected' : ''}" data-answer="${i}">
          <span class="scan-answer-letter">${'ABCD'[i]}</span>${a}
        </button>
      `).join('')}
    </div>
    ${current > 0 ? '<button class="scan-back" data-action="back">← Vorige vraag</button>' : ''}
  `);
}

function scoreByPillar() {
  const scores = Object.fromEntries(PILLARS.map((p) => [p, 0]));
  QUESTIONS.forEach((q, i) => { scores[q.pillar] += answers[i]; });
  return scores;
}

function renderResult() {
  const scores = scoreByPillar();
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const max = QUESTIONS.length * 3;
  const profile = PROFILES.find((p) => total <= p.max);
  const weakest = PILLARS.reduce((low, p) => (scores[p] < scores[low] ? p : low), PILLARS[0]);

  const subject = `Mijn KMO Groeiscan: ${total}/${max} (${profile.name})`;
  const body = [
    'Hallo Brique,',
    '',
    `Ik deed de KMO Groeiscan en scoorde ${total}/${max} (${profile.name}).`,
    '',
    ...PILLARS.map((p) => `${p}: ${scores[p]}/${MAX_PER_PILLAR}`),
    '',
    'Ik bespreek mijn resultaat graag eens.',
    '',
    'Naam:',
    'Bedrijf:',
    'Telefoon:',
  ].join('\n');
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  show(`
    <p class="scan-kicker">Je resultaat</p>
    <h1 tabindex="-1" data-focus>${total} / ${max} <span class="scan-profile">${profile.name}</span></h1>
    <p class="scan-lead">${profile.text}</p>

    <div class="scan-bars">
      ${PILLARS.map((p) => `
        <div class="scan-bar${p === weakest ? ' weakest' : ''}">
          <div class="scan-bar-label">
            <span>${p}</span>
            <span>${scores[p]}/${MAX_PER_PILLAR}${p === weakest ? ' · grootste kans' : ''}</span>
          </div>
          <div class="scan-bar-track"><div class="scan-bar-fill" style="--w: ${(scores[p] / MAX_PER_PILLAR) * 100}%"></div></div>
        </div>
      `).join('')}
    </div>

    <div class="scan-tips">
      <h3>2 tips voor ${weakest}</h3>
      <ol>${TIPS[weakest].map((t) => `<li>${t}</li>`).join('')}</ol>
    </div>

    <div class="scan-actions">
      <a href="${mailto}" class="btn btn-cta btn-big">Bespreek je resultaat gratis <span class="cta-icon">✳</span></a>
      <button class="scan-back" data-action="restart">Opnieuw doen</button>
    </div>
  `);

  // Balken laten vollopen na het tekenen
  requestAnimationFrame(() => root.querySelectorAll('.scan-bar-fill').forEach((el) => el.classList.add('fill')));
}

root.addEventListener('click', (e) => {
  const answerBtn = e.target.closest('[data-answer]');
  const actionBtn = e.target.closest('[data-action]');

  if (answerBtn) {
    answers[current] = Number(answerBtn.dataset.answer);
    answerBtn.classList.add('selected');
    // Korte pauze zodat je je keuze ziet oplichten
    setTimeout(() => {
      current += 1;
      current < QUESTIONS.length ? renderQuestion() : renderResult();
    }, 220);
    return;
  }

  if (!actionBtn) return;
  const action = actionBtn.dataset.action;

  if (action === 'start') {
    current = 0;
    renderQuestion();
  } else if (action === 'back') {
    current -= 1;
    renderQuestion();
  } else if (action === 'restart') {
    answers = [];
    renderStart();
  }
});

renderStart();
