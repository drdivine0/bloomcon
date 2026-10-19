/*
 * Site content. Edit text here: index.html renders it through Alpine templates,
 * so each programme, schedule row and FAQ is written once.
 *
 * Programme `icon` values are icon ids from the sprite at the top of index.html (#i-NAME).
 */

const NAV_LINKS = [
  { label: 'Programmes', href: '#programmes' },
  { label: 'Schedule', href: '#schedule' },
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
    name: 'JobFest & Career Hub',
    tagline: 'Get a Job. Build a Career.',
    phase: 'pathway',
    time: '1:00 – 3:30 PM',
    place: 'Breakout room',
    icon: 'briefcase',
    summary: 'For anyone looking for work. Hear where the jobs are, learn how to get hired, then sit real interviews with employers.',
    highlights: ['State of Jobs Report', 'How to Get Hired session', '80 minutes of live employer interviews'],
    note: 'Bring printed copies of your CV.',
  },
  {
    id: 'globaverse',
    name: 'Globaverse',
    tagline: 'Winning in the Age of AI',
    phase: 'pathway',
    time: '1:00 – 3:30 PM',
    place: 'Breakout room',
    icon: 'sparkles',
    summary: 'For professionals and business owners who want to work smarter with AI. See how teams are adopting it, then use an AI tool yourself.',
    highlights: ['Keynote and panel on AI adoption', '85-minute hands-on workshop where every attendee uses an AI tool'],
    note: 'Bring a charged laptop or smartphone. Seats are limited.',
  },
  {
    id: 'bloomconnect',
    name: 'BloomConnect',
    tagline: 'Market. Connect. Fund.',
    phase: 'pathway',
    time: '1:00 – 3:30 PM',
    place: 'Breakout room',
    icon: 'handshake',
    summary: 'For businesses ready for funding. Learn how to access finance, then meet funders and accelerator partners one on one.',
    highlights: ['Access-to-finance keynote', 'Accelerator Spotlight fireside chat', '80 minutes of one-on-one office hours'],
    note: 'Office hours are for verified businesses. Seats are limited.',
  },
  {
    id: 'bloom-fund',
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
    name: 'Trade Fair & Exhibition',
    tagline: 'The shared marketplace',
    phase: 'marketplace',
    time: '11:30 AM – 5:30 PM',
    place: 'Exhibition space',
    icon: 'store',
    summary: 'The one space every attendee walks through. Shop from local businesses and brands, or apply for a booth and sell to the crowd.',
    highlights: ['Open from 11:30 AM to 5:30 PM', 'Booths for traders, small businesses and brands'],
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
  { time: '9:00 AM', programs: ['playbook'] },
  { time: '11:30 AM', programs: ['wellx', 'trade-fair'] },
  { time: '12:30 PM', title: 'Networking', note: 'Food, the Wellness Zone and the Trade Fair.' },
  { time: '1:00 PM', programs: ['jobfest', 'globaverse', 'bloomconnect'], note: 'Three tracks at the same time. Choose one.' },
  { time: '3:30 PM', programs: ['bloom-fund'] },
  { time: '4:00 PM', title: 'Main Hall closes', note: 'The Trade Fair stays open until 5:30 PM.' },
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
  { q: 'Can my company bring a team?', a: 'Yes. Tick the group booking option when you register for a team of 5 or more and we’ll be in touch.' },
  { q: 'How do I get a booth at the Trade Fair?', a: 'Choose “Apply for a Trade Fair booth” when you register. We review every application and reply on WhatsApp. Please don’t pay anyone until you hear from the official number.' },
  { q: 'Can I change my programmes after registering?', a: 'Yes. Open “My ticket” at the top of this page and choose Edit registration.' },
  { q: 'Do I need to be a member of The Elevation Church?', a: 'No. BLOOMCON is open to everyone.' },
];
