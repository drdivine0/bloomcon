/*
 * BLOOMCON 2.0 page behaviour (Alpine.js component).
 *
 * Content (programmes, schedule, FAQs…) lives in content.js; index.html renders it
 * with Alpine templates bound to the properties below.
 */

// Where registrations are sent. Any endpoint that accepts a JSON POST works
// (for example Formspree, Basin, or your own API). Leave empty to keep
// registrations on the visitor's device only.
const FORM_ENDPOINT = '';

const EVENT_START = new Date('2026-11-14T08:30:00+01:00');
const STORAGE_KEY = 'bloomcon-reg';
const MORNING = ['bloom-stage', 'playbook', 'wellx'];
const TRACKS = ['jobfest', 'globaverse', 'bloomconnect'];

function blankForm() {
  return {
    name: '', email: '', phone: '', persona: '', org: '', group: false, groupSize: '', consent: false, exhibitor: false,
    jobfest: { field: '', years: '', cv: true },
    globaverse: { level: '', device: 'Laptop' },
    bloomconnect: { business: '', sector: '', cac: '', age: '1 to 3', need: 'Loan or credit' },
    booth: { business: '', sells: '', link: '' },
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
    if (record) localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    else localStorage.removeItem(STORAGE_KEY);
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

    hasBackend: Boolean(FORM_ENDPOINT),
    stepLabels: { programmes: 'Programmes', details: 'Your details', extra: 'Questions', review: 'Review' },

    filter: 'all',
    selected: [],
    mobileNav: false,
    faqOpen: 0,
    detail: null,
    detailOpen: false,
    detailFrom: null,
    toasts: [],
    countdown: { days: '–', hours: '–', minutes: '–', seconds: '–' },

    regOpen: false,
    step: 0,
    done: false,
    editing: false,
    saving: false,
    saveError: '',
    errors: {},
    confirmCancel: false,
    form: blankForm(),
    myReg: null,
    qrSvg: '',

    init() {
      this.tick();
      setInterval(() => this.tick(), 1000);

      const saved = loadSaved();
      if (saved) this.setMine(saved);
    },

    /* ---------- Helpers ---------- */

    byId(id) {
      return PROGRAMS.find((p) => p.id === id) ?? PROGRAMS[0];
    },
    byPhase(phase) {
      return PROGRAMS.filter((p) => p.phase === phase);
    },
    has(id) {
      return this.selected.includes(id);
    },
    visible(phase) {
      return this.filter === 'all' || this.filter === phase;
    },
    selectedPrograms() {
      return PROGRAMS.filter((p) => this.has(p.id));
    },
    toast(text) {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, text });
      setTimeout(() => { this.toasts = this.toasts.filter((t) => t.id !== id); }, 3600);
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
    // Places an element on the hero orbit: angle in degrees (0 = top, clockwise), radius in % of the box
    orbitPosition(angle, radius = 44) {
      const rad = (angle * Math.PI) / 180;
      return `left: ${50 + radius * Math.sin(rad)}%; top: ${50 - radius * Math.cos(rad)}%`;
    },
    toggleFaq(i) {
      this.faqOpen = this.faqOpen === i ? null : i;
    },

    /* ---------- Programme selection ---------- */

    // quiet: skip the "track swapped" toast (used inside the registration form, where the swap is visible)
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

    addAllMorning() {
      MORNING.forEach((id) => { if (!this.has(id)) this.selected = [...this.selected, id]; });
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

    /* ---------- Registration flow ---------- */

    get needsExtra() {
      return TRACKS.some((t) => this.has(t)) || this.form.exhibitor;
    },
    get steps() {
      return this.needsExtra ? ['programmes', 'details', 'extra', 'review'] : ['programmes', 'details', 'review'];
    },
    get current() {
      return this.steps[Math.min(this.step, this.steps.length - 1)];
    },

    openRegister({ exhibitor = false } = {}) {
      this.mobileNav = false;

      if (this.myReg) {
        if (!exhibitor) return this.openTicket();
        this.editRegistration();
        this.form.exhibitor = true;
        return;
      }

      if (exhibitor) {
        this.form.exhibitor = true;
        if (!this.has('trade-fair')) this.selected = [...this.selected, 'trade-fair'];
      } else if (!this.selected.length) {
        this.addAllMorning();
      }

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
      this.confirmCancel = false;
      if (!this.done) this.editing = false;
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

      if (this.current === 'programmes' && !this.selected.length && !f.exhibitor) {
        e.programmes = 'Choose at least one programme to continue.';
      }

      if (this.current === 'details') {
        if (f.name.length < 2) e.name = 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'Enter an email address like name@example.com.';
        if ((f.phone.match(/\d/g) || []).length < 10) e.phone = 'Enter a WhatsApp number with at least 10 digits.';
        if (!f.persona) e.persona = 'Choose the option that fits you best.';
        if (f.group && !(Number(f.groupSize) >= 5)) e.groupSize = 'Group bookings start at 5 people.';
      }

      if (this.current === 'extra') {
        if (this.has('jobfest')) {
          if (!f.jobfest.field) e.jfField = 'Tell us the field you want to work in.';
          if (!f.jobfest.years) e.jfYears = 'Choose your experience.';
        }
        if (this.has('globaverse') && !f.globaverse.level) e.gvLevel = 'Choose how often you use AI tools.';
        if (this.has('bloomconnect')) {
          if (!f.bloomconnect.business) e.bcName = 'Enter your business name.';
          if (!f.bloomconnect.sector) e.bcSector = 'Enter your sector.';
          if (!f.bloomconnect.cac) e.bcCac = 'Choose your CAC status.';
        }
        if (f.exhibitor) {
          if (!f.booth.business) e.exName = 'Enter your business or brand name.';
          if (!f.booth.sells) e.exSells = 'Tell us what you’ll sell or show.';
        }
      }

      if (this.current === 'review' && !f.consent) e.consent = 'Tick the box so we can send you the programme.';

      this.errors = e;
      return Object.keys(e).length === 0;
    },

    next() {
      if (!this.validate()) {
        this.$nextTick(() => this.$refs.regBody.querySelector('.bad')?.focus());
        return;
      }
      if (this.current === 'review') return this.submit();
      this.step++;
      this.scrollTop();
    },

    buildRecord() {
      const f = this.form;
      const answers = {};
      if (this.has('jobfest')) answers.jobfest = { ...f.jobfest };
      if (this.has('globaverse')) answers.globaverse = { ...f.globaverse };
      if (this.has('bloomconnect')) answers.bloomconnect = { ...f.bloomconnect };
      if (f.exhibitor) answers.booth = { ...f.booth };

      const now = new Date().toISOString();
      return {
        code: this.myReg?.code ?? ticketCode(),
        name: f.name,
        email: f.email,
        phone: f.phone,
        persona: f.persona,
        org: f.org,
        group: f.group,
        groupSize: f.group ? Number(f.groupSize) : 0,
        exhibitor: f.exhibitor,
        programmes: this.selectedPrograms().map((p) => p.id),
        answers,
        createdAt: this.myReg?.createdAt ?? now,
        updatedAt: now,
      };
    },

    async send(record) {
      if (!FORM_ENDPOINT) return;
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`);
    },

    async submit() {
      this.saving = true;
      this.saveError = '';
      const record = this.buildRecord();

      try {
        await this.send(record);
      } catch {
        this.saveError = 'Your registration didn’t save because the connection dropped. Check your connection and select Complete registration again.';
        this.saving = false;
        return;
      }

      save(record);
      this.setMine(record);
      this.done = true;
      this.editing = false;
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

    editRegistration() {
      const r = this.myReg;
      if (!r) return;
      const form = blankForm();
      Object.assign(form, {
        name: r.name, email: r.email, phone: r.phone, persona: r.persona, org: r.org ?? '',
        group: r.group, groupSize: r.groupSize || '', exhibitor: r.exhibitor, consent: true,
      });
      for (const key of ['jobfest', 'globaverse', 'bloomconnect', 'booth']) {
        if (r.answers?.[key]) form[key] = { ...form[key], ...r.answers[key] };
      }
      this.form = form;
      this.selected = [...r.programmes];
      this.editing = true;
      this.done = false;
      this.step = 0;
      this.errors = {};
      this.regOpen = true;
      this.scrollTop();
    },

    async cancelRegistration() {
      if (!this.confirmCancel) {
        this.confirmCancel = true;
        setTimeout(() => { this.confirmCancel = false; }, 4000);
        return;
      }

      try {
        await this.send({ ...this.myReg, cancelled: true, updatedAt: new Date().toISOString() });
      } catch {
        // The local ticket is still removed; organisers can reconcile from WhatsApp.
      }

      save(null);
      this.myReg = null;
      this.selected = [];
      this.form = blankForm();
      this.confirmCancel = false;
      this.regOpen = false;
      this.done = false;
      this.toast('Your registration is cancelled. You can register again any time.');
    },

    downloadIcs() {
      const r = this.myReg;
      const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const programmes = (r?.programmes ?? []).map((id) => this.byId(id).name).join('\\, ');
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BLOOMCON//EN', 'BEGIN:VEVENT',
        `UID:${r?.code ?? 'bloomcon'}@bloomcon`, `DTSTAMP:${stamp}`,
        'DTSTART:20261114T073000Z', 'DTEND:20261114T163000Z', 'SUMMARY:BLOOMCON 2.0',
        'LOCATION:The Elevation Church\\, Greater Lekki\\, Lagos',
        `DESCRIPTION:Ticket ${r?.code ?? ''}. Programmes: ${programmes}`,
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      downloadFile('bloomcon-2026.ics', ics, 'text/calendar');
    },
  }));
});
