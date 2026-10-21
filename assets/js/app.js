/*
 * BLOOMCON 2.0 page behaviour (Alpine.js component).
 *
 * Content (programmes, schedule, FAQs, gallery, registration choices…) lives in content.js;
 * index.html renders it with Alpine templates bound to the properties below.
 */

// Registrations are sent to the BLOOMCON 2.0 Google Form, so they appear in its responses.
// The entry numbers come from the form itself; if a question is added or changed there,
// update the matching entry here and the choices in REG (content.js).
const GOOGLE_FORM = {
  action: 'https://docs.google.com/forms/d/e/1FAIpQLSfgyOaix_6YDkQ_Fk7y3Xq-cowZR2BFztHP9oE5ZUeNsc1yqg/formResponse',
  // The form's sections in order. Google needs to know which ones the person went through.
  sections: { about: 0, day: 1, jobfest: 2, globaverse: 3, bloomconnect: 4, finish: 5 },
  entries: {
    name: 'entry.1687000642',
    email: 'entry.703410194',
    phone: 'entry.112352400',
    gender: 'entry.583304703',
    age: 'entry.793730581',
    persona: 'entry.280698927',
    org: 'entry.1432597574',
    morning: 'entry.1062904743',
    afternoon: 'entry.1556690775',
    jobfest: {
      situation: 'entry.1326501436',
      field: 'entry.920237046',
      experience: 'entry.546503452',
      qualification: 'entry.496770682',
      cv: 'entry.785927732',
    },
    globaverse: {
      usage: 'entry.317497475',
      device: 'entry.817944523',
      useFor: 'entry.789415721',
    },
    bloomconnect: {
      business: 'entry.1213543199',
      sector: 'entry.1264519317',
      age: 'entry.647515315',
      support: 'entry.21666199',
      officeHours: 'entry.1572931893',
    },
    heardFrom: 'entry.231053523',
    member: 'entry.1755688212',
    exhibit: 'entry.2136149891',
    updates: 'entry.1830129484',
    confirmation: 'entry.1828655232',
  },
};

const EVENT_START = new Date('2026-11-14T08:30:00+01:00');
const STORAGE_KEY = 'bloomcon-reg';
const TRACKS = ['jobfest', 'globaverse', 'bloomconnect'];

function blankForm() {
  return {
    name: '', email: '', phone: '', gender: '', age: '', persona: '', org: '',
    morning: [], afternoon: '',
    jobfest: { situation: '', field: '', experience: '', qualification: '', cv: '' },
    globaverse: { usage: '', device: '', useFor: '' },
    bloomconnect: { business: '', sector: '', age: '', support: [], officeHours: '' },
    heardFrom: '', member: '', exhibit: '', updates: [], confirmed: false,
  };
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function save(record) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private browsing or blocked storage: the ticket still shows for this visit.
  }
}

function ticketCode() {
  const alphabet = 'ACDEFGHJKLMNPQRTUVWXY3469';
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return 'BLM-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

function downloadFile(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('alpine:init', () => {
  Alpine.data('site', () => ({
    navLinks: NAV_LINKS,
    phases: PHASES,
    filters: FILTERS,
    programs: PROGRAMS,
    heroPetals: HERO_PETALS,
    schedule: SCHEDULE,
    audiences: AUDIENCES,
    partnerTiers: PARTNER_TIERS,
    faqs: FAQS,
    gallery: GALLERY,
    reg: REG,

    stepLabels: { about: 'About you', day: 'Your day', track: 'Your track', finish: 'Almost done' },

    filter: 'all',
    selected: [],
    mobileNav: false,
    faqOpen: 0,
    detail: null,
    detailOpen: false,
    detailFrom: null,
    photoIndex: null,
    toasts: [],
    countdown: { days: '–', hours: '–', minutes: '–', seconds: '–' },

    regOpen: false,
    step: 0,
    done: false,
    saving: false,
    saveError: '',
    errors: {},
    form: blankForm(),
    myReg: null,
    qrSvg: '',

    init() {
      this.tick();
      setInterval(() => this.tick(), 1000);

      const saved = loadSaved();
      if (saved) this.setMine(saved);

      // Once a step has shown errors, clear each one as soon as it's answered
      this.$watch('form', () => { if (Object.keys(this.errors).length) this.validate(); });
    },

    /* ---------- Helpers ---------- */

    byId(id) {
      return PROGRAMS.find((p) => p.id === id) ?? PROGRAMS[0];
    },
    has(id) {
      return this.selected.includes(id);
    },
    visible(phase) {
      return this.filter === 'all' || this.filter === phase;
    },
    toast(text) {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, text });
      setTimeout(() => { this.toasts = this.toasts.filter((t) => t.id !== id); }, 4200);
    },
    tick() {
      const ms = Math.max(EVENT_START - Date.now(), 0);
      const pad = (n) => String(n).padStart(2, '0');
      this.countdown = {
        days: String(Math.floor(ms / 864e5)),
        hours: pad(Math.floor(ms / 36e5) % 24),
        minutes: pad(Math.floor(ms / 6e4) % 60),
        seconds: pad(Math.floor(ms / 1e3) % 60),
      };
    },
    toggleFaq(i) {
      this.faqOpen = this.faqOpen === i ? null : i;
    },

    /* ---------- Photos ---------- */

    // Every photo has a -800 and a -1600 version; some originals are smaller than 1600 wide
    photoSrc(name, width = 800) {
      return `assets/img/gallery/${name}-${width}.webp`;
    },
    photoSrcset(name) {
      const full = PHOTOS.find((p) => p.photo === name)?.w ?? 1600;
      return `${this.photoSrc(name, 800)} ${Math.min(800, full)}w, ${this.photoSrc(name, 1600)} ${full}w`;
    },
    get photo() {
      return this.photoIndex === null ? null : GALLERY[this.photoIndex];
    },
    openPhoto(i) {
      this.photoIndex = i;
      this.$refs.lightbox.showModal();
    },
    closePhoto() {
      this.$refs.lightbox.close();
      this.photoIndex = null;
    },
    stepPhoto(by) {
      this.photoIndex = (this.photoIndex + by + GALLERY.length) % GALLERY.length;
    },

    /* ---------- Programme selection ---------- */

    // quiet: skip the "track swapped" toast
    toggle(id, event, quiet = false) {
      if (this.has(id)) {
        this.selected = this.selected.filter((x) => x !== id);
        return;
      }

      if (TRACKS.includes(id)) {
        const previous = this.selected.find((x) => TRACKS.includes(x));
        if (previous) {
          this.selected = this.selected.filter((x) => x !== previous);
          if (!quiet) this.toast(`Afternoon tracks run at the same time, so ${this.byId(previous).name} was swapped for ${this.byId(id).name}.`);
        }
      }
      this.selected = [...this.selected, id];

      const button = event?.currentTarget;
      if (button) {
        const r = button.getBoundingClientRect();
        const rgb = getComputedStyle(button).getPropertyValue('--c').trim() || '22 56 40';
        Motion.burst(r.left + r.width / 2, r.top + r.height / 2, `rgb(${rgb})`);
      }
      this.$nextTick(() => Motion.bump(this.$refs.tray));
    },

    setFilter(phase) {
      if (phase === this.filter) return;
      const play = Motion.flipCards();
      this.filter = phase;
      this.$nextTick(play);
    },

    jumpTo(id) {
      if (this.filter !== 'all') this.setFilter('all');
      this.$nextTick(() => document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' }));
    },

    /* ---------- Programme detail dialog ---------- */

    openDetail(program, fromEl) {
      const dialog = this.$refs.detail;
      this.detail = program;
      this.detailOpen = true;
      this.detailFrom = fromEl.closest('.prog-card');
      dialog.showModal();
      // Wait for the dialog to show the new programme before measuring it for the animation
      this.$nextTick(() => Motion.dialogIn(dialog.firstElementChild, this.detailFrom));
    },

    closeDetail() {
      const dialog = this.$refs.detail;
      if (!this.detailOpen) return;
      Motion.dialogOut(dialog.firstElementChild, this.detailFrom, () => {
        dialog.close();
        this.detailOpen = false;
      });
    },

    /* ---------- Registration flow (mirrors the Google Form's sections) ---------- */

    // The programme behind the chosen afternoon answer: a track id, 'trade-fair', or null
    get trackProgram() {
      return REG.afternoon.find((o) => o.value === this.form.afternoon)?.program ?? null;
    },
    get steps() {
      return TRACKS.includes(this.trackProgram) ? ['about', 'day', 'track', 'finish'] : ['about', 'day', 'finish'];
    },
    get current() {
      return this.steps[Math.min(this.step, this.steps.length - 1)];
    },

    openRegister({ exhibitor = false } = {}) {
      this.mobileNav = false;

      if (this.myReg) {
        if (exhibitor) this.toast('You’re already registered. To ask about a Trade Fair booth, email bizncareershubgl@gmail.com.');
        return this.openTicket();
      }

      // Carry over anything picked on the programme cards
      const f = this.form;
      f.morning = REG.morning.filter((o) => this.has(o.program)).map((o) => o.value);
      const track = REG.afternoon.find((o) => o.program && this.has(o.program) && TRACKS.includes(o.program))
        ?? (this.has('trade-fair') ? REG.afternoon.find((o) => o.program === 'trade-fair') : null);
      if (track && !f.afternoon) f.afternoon = track.value;
      if (exhibitor) f.exhibit = REG.exhibit[0];

      this.done = false;
      this.step = 0;
      this.errors = {};
      this.saveError = '';
      this.regOpen = true;
    },

    openTicket() {
      this.done = true;
      this.regOpen = true;
      this.renderQr();
    },

    closeRegister() {
      this.regOpen = false;
    },

    goTo(name) {
      const i = this.steps.indexOf(name);
      if (i < 0) return;
      this.step = i;
      this.errors = {};
      this.scrollTop();
    },

    back() {
      if (this.step === 0) return;
      this.step--;
      this.errors = {};
      this.scrollTop();
    },

    scrollTop() {
      this.$nextTick(() => { this.$refs.regBody.scrollTop = 0; });
    },

    validate() {
      const e = {};
      const f = this.form;
      const need = (value, key, message) => { if (!value || (Array.isArray(value) && !value.length)) e[key] = message; };

      if (this.current === 'about') {
        if (f.name.trim().length < 2) e.name = 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'Enter an email address like name@example.com.';
        if ((f.phone.match(/\d/g) || []).length < 10) e.phone = 'Enter a phone number with at least 10 digits.';
        need(f.age, 'age', 'Choose your age range.');
        need(f.persona, 'persona', 'Choose the option that fits you best.');
        need(f.org.trim(), 'org', 'Enter your organisation and job title, or “None”.');
      }

      if (this.current === 'day') {
        need(f.morning, 'morning', 'Choose at least one morning session.');
        need(f.afternoon, 'afternoon', 'Choose an afternoon option.');
      }

      if (this.current === 'track') {
        if (this.trackProgram === 'jobfest') {
          need(f.jobfest.situation, 'jfSituation', 'Choose your current situation.');
          need(f.jobfest.field, 'jfField', 'Choose the field you are looking for work in.');
          need(f.jobfest.experience, 'jfExperience', 'Choose your years of experience.');
          need(f.jobfest.qualification, 'jfQualification', 'Choose your highest qualification.');
        }
        if (this.trackProgram === 'globaverse') {
          need(f.globaverse.usage, 'gvUsage', 'Choose how often you use AI tools.');
          need(f.globaverse.device, 'gvDevice', 'Tell us whether you’ll bring a device.');
          need(f.globaverse.useFor.trim(), 'gvUseFor', 'Tell us what you would most likely use AI for.');
        }
        if (this.trackProgram === 'bloomconnect') {
          need(f.bloomconnect.business.trim(), 'bcBusiness', 'Enter your business name.');
          need(f.bloomconnect.sector, 'bcSector', 'Choose your business sector.');
          need(f.bloomconnect.age, 'bcAge', 'Choose how long your business has been running.');
          need(f.bloomconnect.support, 'bcSupport', 'Choose at least one kind of support.');
          need(f.bloomconnect.officeHours, 'bcOfficeHours', 'Choose an office-hours option.');
        }
      }

      if (this.current === 'finish') {
        need(f.heardFrom, 'heardFrom', 'Tell us how you heard about BLOOMCON 2.0.');
        if (!f.confirmed) e.confirmed = 'Tick the box to confirm.';
      }

      this.errors = e;
      return Object.keys(e).length === 0;
    },

    next() {
      if (!this.validate()) {
        this.$nextTick(() => this.$refs.regBody.querySelector('.bad, [aria-invalid="true"]')?.focus());
        return;
      }
      if (this.current === 'finish') return this.submit();
      this.step++;
      this.scrollTop();
    },

    // The answers, in the shape Google Forms accepts
    formBody() {
      const f = this.form;
      const E = GOOGLE_FORM.entries;
      const body = new URLSearchParams();
      const add = (entry, value) => {
        for (const v of [].concat(value)) if (v && String(v).trim()) body.append(entry, String(v).trim());
      };

      add(E.name, f.name);
      add(E.email, f.email);
      add(E.phone, f.phone);
      add(E.gender, f.gender);
      add(E.age, f.age);
      add(E.persona, f.persona);
      add(E.org, f.org);
      add(E.morning, f.morning);
      add(E.afternoon, f.afternoon);

      const sections = [GOOGLE_FORM.sections.about, GOOGLE_FORM.sections.day];
      const track = this.trackProgram;
      if (TRACKS.includes(track)) {
        for (const [key, entry] of Object.entries(E[track])) add(entry, f[track][key]);
        sections.push(GOOGLE_FORM.sections[track]);
      }
      sections.push(GOOGLE_FORM.sections.finish);

      add(E.heardFrom, f.heardFrom);
      add(E.member, f.member);
      add(E.exhibit, f.exhibit);
      add(E.updates, f.updates);
      if (f.confirmed) add(E.confirmation, REG.confirmation);

      body.append('pageHistory', sections.join(','));
      body.append('fvv', '1');
      return body;
    },

    async submit() {
      this.saving = true;
      this.saveError = '';

      try {
        // Google doesn't let other sites read its reply, so "no-cors": the request is sent,
        // and an exception here means the connection itself failed.
        await fetch(GOOGLE_FORM.action, { method: 'POST', mode: 'no-cors', body: this.formBody() });
      } catch {
        this.saveError = 'Your registration didn’t go through because the connection dropped. Check your connection and select Complete registration again.';
        this.saving = false;
        return;
      }

      const f = this.form;
      const programmes = ['bloom-stage',
        ...REG.morning.filter((o) => f.morning.includes(o.value)).map((o) => o.program),
        ...(this.trackProgram ? [this.trackProgram] : []),
        'bloom-fund'];
      const record = {
        code: ticketCode(),
        name: f.name.trim(),
        phone: f.phone.trim(),
        programmes: [...new Set(programmes)],
        exhibitor: f.exhibit === REG.exhibit[0],
        createdAt: new Date().toISOString(),
      };

      save(record);
      this.setMine(record);
      this.form = blankForm();
      this.done = true;
      this.saving = false;
      this.scrollTop();
      this.$nextTick(() => Motion.ticket(this.$refs.ticket));
    },

    setMine(record) {
      this.myReg = record;
      this.selected = [...record.programmes];
      this.renderQr();
    },

    renderQr() {
      if (!this.myReg || typeof qrcode === 'undefined') return;
      const qr = qrcode(0, 'M');
      qr.addData(`BLOOMCON2.0|${this.myReg.code}|${this.myReg.name}`);
      qr.make();
      this.qrSvg = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    },

    downloadIcs() {
      const r = this.myReg;
      const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const programmes = (r?.programmes ?? []).map((id) => this.byId(id).name).join('\\, ');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BLOOMCON//EN', 'BEGIN:VEVENT',
        `UID:${r?.code ?? 'bloomcon'}@bloomcon`, `DTSTAMP:${stamp}`,
        'DTSTART:20261114T073000Z', 'DTEND:20261114T160000Z', 'SUMMARY:BLOOMCON 2.0',
        'LOCATION:The Elevation Church\\, Greater Lekki\\, Lagos',
        `DESCRIPTION:Ticket ${r?.code ?? ''}. Programmes: ${programmes}`,
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      downloadFile('bloomcon-2026.ics', ics, 'text/calendar');
    },
  }));
});
