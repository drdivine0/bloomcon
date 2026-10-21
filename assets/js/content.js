/*
 * Site content. Edit text here: index.html renders it through Alpine templates,
 * so each programme, schedule row and FAQ is written once.
 *
 * Programme `icon` values are icon ids from the sprite at the top of index.html (#i-NAME);
 * `photo` names an image in assets/img/gallery (see GALLERY below).
 */

const NAV_LINKS = [
  { label: 'Programmes', href: '#programmes' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Exhibit', href: '#exhibit' },
  { label: 'Partners', href: '#partners' },
  { label: 'FAQ', href: '#faq' },
];

// Each phase has a colour, set by the matching .tone-* class in styles.css
const PHASES = {
  foundation: 'Foundation',
  pathway: 'Pathway',
  proof: 'Proof',
  marketplace: 'Marketplace',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'foundation', label: 'Morning' },
  { id: 'pathway', label: 'Afternoon tracks' },
  { id: 'proof', label: 'Closing' },
  { id: 'marketplace', label: 'Marketplace' },
];

const PROGRAMS = [
  {
    id: 'bloom-stage',
    photo: 'hall-wide',
    name: 'Bloom Stage',
    tagline: 'Purpose. Work. Life. Marketplace.',
    phase: 'foundation',
    time: '8:30 – 9:00 AM',
    place: 'Main Hall',
    icon: 'sunrise',
    summary: 'The day opens here for the whole Main Hall, with a welcome, a moment of community reflection and the BCMG leadership keynote.',
    highlights: ['Welcome and community reflection', 'MC introduction', 'BCMG leadership keynote'],
    note: 'Arrive early. Main Hall seats are first come, first served.',
  },
  {
    id: 'playbook',
    photo: 'cash-flow-talk',
    name: 'The Playbook',
    tagline: 'A Sustainable Performance Conference',
    phase: 'foundation',
    time: '9:00 – 11:30 AM',
    place: 'Main Hall',
    icon: 'target',
    summary: 'Why do people who give 100GB at interview deliver 10GB at work? Leaders and HR heads on execution, and practical skills to take back to your desk.',
    highlights: ['State of Performance keynote', '“100GB to 10GB” executive panel', 'Practical skills segment with NECA, CIPM and an employer partner'],
  },
  {
    id: 'wellx',
    photo: 'speaker-on-stage',
    name: 'WellX',
    tagline: 'Thrive at Work. Thrive in Life.',
    phase: 'foundation',
    time: '11:30 AM – 12:30 PM',
    place: 'Main Hall and Wellness Zone',
    icon: 'heart-pulse',
    summary: 'Wellbeing, addressed directly. Get moving, then hear an honest, unscripted conversation about mental and physical health at work.',
    highlights: ['Move & Groove movement segment', 'Hot Seat: an unscripted Q&A on health at work'],
    note: 'Wear comfortable shoes for Move & Groove.',
  },
  {
    id: 'jobfest',
    photo: 'audience-taking-notes',
    name: 'JobFest & Career Hub',
    tagline: 'Get a Job. Build a Career.',
    phase: 'pathway',
    time: '1:30 – 3:30 PM',
    place: 'Breakout room',
    icon: 'briefcase',
    summary: 'For anyone looking for work. Hear where the jobs are, learn how to get hired, then sit real interviews with employers.',
    highlights: ['State of Jobs Report', 'How to Get Hired session', '80 minutes of live employer interviews'],
    note: 'Bring printed copies of your CV.',
  },
  {
    id: 'globaverse',
    photo: 'attendee-with-notebook',
    name: 'Globaverse',
    tagline: 'Winning in the Age of AI',
    phase: 'pathway',
    time: '1:30 – 3:30 PM',
    place: 'Breakout room',
    icon: 'sparkles',
    summary: 'For professionals and business owners who want to work smarter with AI. See how teams are adopting it, then use an AI tool yourself.',
    highlights: ['Keynote and panel on AI adoption', '85-minute hands-on workshop where every attendee uses an AI tool'],
    note: 'Bring a charged laptop or smartphone. Seats are limited.',
  },
  {
    id: 'bloomconnect',
    photo: 'panel-conversation',
    name: 'BloomConnect',
    tagline: 'Market. Connect. Fund.',
    phase: 'pathway',
    time: '1:30 – 3:30 PM',
    place: 'Breakout room',
    icon: 'handshake',
    summary: 'For businesses ready for funding. Learn how to access finance, then meet funders and accelerator partners one on one.',
    highlights: ['Access-to-finance keynote', 'Accelerator Spotlight fireside chat', '80 minutes of one-on-one office hours'],
    note: 'Office hours are for verified businesses. Seats are limited.',
  },
  {
    id: 'bloom-fund',
    photo: 'award-presentation',
    name: 'The Bloom Fund',
    tagline: 'Where readiness becomes funding',
    phase: 'proof',
    time: '3:30 – 4:00 PM',
    place: 'Main Hall',
    icon: 'sprout',
    summary: 'The day closes with proof: ten graduates of the NMSME ASCEND Accelerator are recognised and funded live on stage.',
    highlights: ['Live funding for 10 ASCEND graduates', 'Pitchathon announcement'],
  },
  {
    id: 'trade-fair',
    photo: 'crowd-in-the-hall',
    name: 'Trade Fair & Exhibition',
    tagline: 'The shared marketplace',
    phase: 'marketplace',
    time: '9:00 AM – 5:00 PM',
    place: 'Exhibition space',
    icon: 'store',
    summary: 'The one space every attendee walks through. Shop from local businesses and brands, or apply for a booth and sell to the crowd.',
    highlights: ['Open from 9:00 AM to 5:00 PM', 'Booths for traders, small businesses and brands, from ₦50,000'],
  },
];

// The six programmes told petal by petal in the hero ("Six ways to grow"), in scroll order.
// angle is the petal it opens (0 = top, clockwise); colour matches that petal.
const HERO_PETALS = [
  { id: 'bloom-stage', angle: 0, colour: 'pill-salmon' },
  { id: 'playbook', angle: 60, colour: 'pill-mint' },
  { id: 'wellx', angle: 120, colour: 'pill-mustard' },
  { id: 'jobfest', angle: 180, colour: 'pill-salmon' },
  { id: 'globaverse', angle: 240, colour: 'pill-mint' },
  { id: 'bloomconnect', angle: 300, colour: 'pill-mustard' },
];

// A row either lists programme ids (shown as linked slots) or has a plain title
const SCHEDULE = [
  { time: '8:30 AM', programs: ['bloom-stage'] },
  { time: '9:00 AM', programs: ['playbook', 'trade-fair'] },
  { time: '11:30 AM', programs: ['wellx'] },
  { time: '12:30 PM', title: 'Networking break', note: 'Food, the Wellness Zone and the Trade Fair.' },
  { time: '1:30 PM', programs: ['jobfest', 'globaverse', 'bloomconnect'], note: 'Three tracks at the same time. Choose one.' },
  { time: '3:30 PM', programs: ['bloom-fund'] },
  { time: '4:00 PM', title: 'Main Hall closes', note: 'The Trade Fair stays open until 5:00 PM.' },
];

const AUDIENCES = [
  { icon: 'briefcase', title: 'Professionals', text: 'Perform better at work and plan your next career move.' },
  { icon: 'users', title: 'HR leaders', text: 'Build teams that deliver. Bring your team with a group booking.' },
  { icon: 'store', title: 'Entrepreneurs', text: 'Find customers, funding partners and practical support.' },
  { icon: 'target', title: 'Job seekers', text: 'Meet employers and interview on the day. Bring printed CVs.' },
  { icon: 'sparkles', title: 'Freelancers', text: 'Get hands-on with AI tools that save you hours every week.' },
  { icon: 'sprout', title: 'Students and corps members', text: 'See the world of work up close and plan what comes next.' },
];

const PARTNER_TIERS = [
  { name: 'Title Partner', text: 'One organisation with day-wide, top-tier brand ownership' },
  { name: 'Zone Partner', text: 'A credible fit for one of the six experience zones' },
  { name: 'Supporting Partner', text: 'Exhibition-level exposure across the full day' },
  { name: 'Programmatic Funding Partner', text: 'Development funders and accelerators backing a named component' },
  { name: 'Exclusive Telecom Partner', text: 'A single telecom brand with full network and SIM category exclusivity' },
];

const FAQS = [
  { q: 'Is BLOOMCON 2.0 really free?', a: 'Yes. Entry is free, but please register so we can plan seating and send you the programme.' },
  { q: 'Do I have to attend the whole day?', a: 'No. Come for the sessions you want. Main Hall seats are first come, first served, so arrive early for the morning.' },
  { q: 'Can I attend more than one afternoon track?', a: 'JobFest, Globaverse and BloomConnect run at the same time, so choose one when you register. You can still visit the Trade Fair.' },
  { q: 'I’m looking for a job. What should I bring?', a: 'Printed copies of your CV. Employers will be interviewing at JobFest.' },
  { q: 'Can my company bring a team?', a: 'Yes. Ask each person to register with their own details, so everyone gets their own confirmation.' },
  { q: 'How do I get a booth at the Trade Fair?', a: 'Booths start from ₦50,000. Choose “Yes, please contact me” to the exhibiting question when you register, and the Trade Fair team will get in touch with the details.' },
  { q: 'Can I change my programmes after registering?', a: 'Yes. Email bizncareershubgl@gmail.com or send a WhatsApp message to 0813 019 8616 with your name and the change.' },
  { q: 'Do I need to be a member of The Elevation Church?', a: 'No. BLOOMCON is open to everyone.' },
  { q: 'Where can I get more information?', a: 'Email bizncareershubgl@gmail.com, or send a WhatsApp message to 0813 019 8616.' },
];

// Photos from past BCMG gatherings. Each has a -800 and a -1600 version in assets/img/gallery;
// w and h are the full-size version's real dimensions (some originals were smaller than 1600).
const GALLERY = [
  { photo: 'hall-wide', w: 1600, h: 900, alt: 'The full hall standing together on stage and in the aisles' },
  { photo: 'speaker-on-stage', w: 1200, h: 1600, alt: 'A speaker in a brown kaftan addressing the hall' },
  { photo: 'audience-taking-notes', w: 800, h: 600, alt: 'Attendees listening closely and taking notes' },
  { photo: 'cash-flow-talk', w: 1600, h: 1200, alt: 'A speaker presenting on cash flow discipline' },
  { photo: 'award-presentation', w: 640, h: 853, alt: 'A guest receiving a gift on stage' },
  { photo: 'attendee-with-notebook', w: 1200, h: 1600, alt: 'Attendees writing in notebooks during a session' },
  { photo: 'panel-conversation', w: 1280, h: 720, alt: 'Three panellists in conversation on stage' },
  { photo: 'guest-listening', w: 1200, h: 1600, alt: 'Guests in the front rows following a talk' },
  { photo: 'ascend-cohort', w: 1600, h: 900, alt: 'The NMSME ASCEND cohort gathered in front of the stage' },
  { photo: 'audience-writing', w: 1199, h: 1600, alt: 'An attendee writing notes in the audience' },
  { photo: 'speakers-line-up', w: 1600, h: 899, alt: 'Speakers and hosts standing together on stage' },
  { photo: 'award-handshake', w: 640, h: 853, alt: 'Two guests smiling during an award moment' },
  { photo: 'speaker-and-screen', w: 640, h: 853, alt: 'A speaker on stage in front of a large screen' },
  { photo: 'crowd-in-the-hall', w: 1600, h: 900, alt: 'A packed hall of attendees' },
  { photo: 'audience-listening', w: 640, h: 853, alt: 'Young professionals listening in the audience' },
];

const STEERING_PARTNERS = [
  { name: 'BCMG, Business & Career Ministry Group', logo: 'bcmg' },
  { name: 'lifePointe Greater Lekki', logo: 'lifepointe-greater-lekki' },
  { name: 'The Elevation Church, Greater Lekki', logo: 'elevation-greater-lekki' },
  { name: 'The Elevation Church, Ibeju-Lekki', logo: 'elevation-ibeju-lekki' },
];

// Registration questions and choices, copied word for word from the Google Form.
// Google only accepts an answer that matches one of its choices exactly, so edit both together.
const REG = {
  genders: ['Female', 'Male', 'Prefer not to say'],
  ageRanges: ['18–24', '25–34', '35–44', '45–54', '55+'],
  personas: ['Career professional (employed)', 'Job seeker', 'Business owner / Entrepreneur', 'Executive / Senior leader', 'HR / People professional', 'Freelancer', 'Student / NYSC'],
  morning: [
    { value: 'The Playbook (9:00 AM)', program: 'playbook' },
    { value: 'WellX Live (11:30 AM)', program: 'wellx' },
  ],
  afternoon: [
    { value: 'JobFest — jobs, careers and interviews', program: 'jobfest' },
    { value: 'Globaverse — AI workshop', program: 'globaverse' },
    { value: 'BloomConnect — for business owners', program: 'bloomconnect' },
    { value: 'Trade Fair & Exhibition only', program: 'trade-fair' },
    { value: 'Not sure yet', program: null },
  ],
  jobfest: {
    situations: ['Unemployed and looking', 'Employed, looking for a better role', 'Fresh graduate / NYSC', 'Student — looking for internship'],
    fields: ['Admin / Office support', 'Banking / Finance / Accounting', 'Customer service', 'Engineering', 'Healthcare', 'HR / People', 'Hospitality / Food', 'ICT / Tech', 'Legal', 'Logistics / Supply chain', 'Marketing / Sales / Media', 'Oil & Gas / Energy', 'Teaching / Education', 'Other'],
    experience: ['None yet', 'Under 2 years', '2–5 years', '6–10 years', 'Over 10 years'],
    qualifications: ['SSCE', 'OND / NCE', 'HND / BSc', 'Master’s or higher', 'Professional certification only'],
  },
  globaverse: {
    usage: ['Never used one', 'Occasionally', 'Weekly', 'Every day'],
    devices: ['Yes, a laptop', 'Only my phone', 'No device'],
  },
  bloomconnect: {
    sectors: ['Agriculture / Agro-processing', 'Beauty / Fashion', 'Construction / Real estate', 'Creative / Media', 'Education', 'Fintech / Tech', 'Food & Drinks', 'Health / Wellness', 'Logistics', 'Manufacturing', 'Professional services', 'Retail / Trading', 'Other'],
    ages: ['Idea stage', 'Under 1 year', '1–3 years', 'Over 3 years'],
    support: ['Access to finance / funding', 'Joining an accelerator programme', 'Getting investment-ready', 'New customers and partnerships'],
    officeHours: ['Yes — Accelerator fit (which programme suits my business)', 'Yes — Investment readiness (getting ready for investors)', 'No, I will just attend the sessions'],
  },
  heardFrom: ['Church announcement', 'WhatsApp', 'Instagram', 'LinkedIn', 'Facebook / X', 'Friend or colleague'],
  member: ['Yes — Greater Lekki', 'Yes — another expression', 'No'],
  exhibit: ['Yes, please contact me', 'No, I will visit as a guest'],
  updates: ['Tell me about future Playbook events', 'Tell me about future WellX events'],
  confirmation: 'I understand entry is FREE but registration is mandatory, and I agree to be contacted by email or WhatsApp about BLOOMCON 2.0. I also understand that photos and videos will be taken at the event.',
};
