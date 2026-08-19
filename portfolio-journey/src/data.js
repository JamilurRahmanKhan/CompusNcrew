const PROJECT_SEEDS = [
  ['Fintech', 'Ledger', 'Wealth intelligence for modern investors.', 'Strategy · Product design · Engineering', 'Turned complex portfolio data into a clear daily decision system.'],
  ['Fintech', 'Current', 'A calmer way to manage business cash flow.', 'Research · Product design · Frontend', 'Reduced the time teams spend reconciling and forecasting cash.'],
  ['Fintech', 'Vault', 'Secure treasury operations without the friction.', 'Brand · Experience · Platform', 'Made high-trust financial workflows feel direct and understandable.'],
  ['Fintech', 'Meridian', 'Cross-border payments built for modern teams.', 'Product strategy · UX · Engineering', 'Connected fragmented payment steps into one confident flow.'],
  ['Health', 'Pulse', 'Care coordination that feels human.', 'Service design · Mobile · Platform', 'Created one calm care journey for clinicians, patients, and families.'],
  ['Health', 'Kin', 'Family health, organized around real life.', 'Research · Product · Mobile', 'Helped households understand care tasks without clinical complexity.'],
  ['Health', 'Sage', 'Clinical decisions with context at the right moment.', 'Systems design · AI UX · Engineering', 'Brought relevant evidence into the care workflow without adding noise.'],
  ['Health', 'Luma', 'A more supportive path through mental wellness.', 'Brand · Service design · Product', 'Made ongoing support feel private, warm, and easy to return to.'],
  ['Commerce', 'Northstar', 'A global storefront built to convert.', 'Commerce strategy · UX · Frontend', 'Simplified the route from product discovery to purchase.'],
  ['Commerce', 'Parcel', 'Delivery operations customers can actually follow.', 'Experience strategy · Platform · Data', 'Turned logistics events into clear, useful customer communication.'],
  ['Commerce', 'Foundry', 'Wholesale buying without the spreadsheet maze.', 'Research · Product design · Engineering', 'Connected catalogs, buyers, and approvals in one workspace.'],
  ['Commerce', 'Morrow', 'A thoughtful home marketplace with room to browse.', 'Brand · Content · Commerce', 'Balanced editorial discovery with a fast, reliable checkout.'],
  ['Platforms', 'Atlas', 'Field operations mapped from plan to completion.', 'Systems design · Web app · Mobile', 'Gave distributed teams one shared picture of active work.'],
  ['Platforms', 'Relay', 'Customer support that keeps its context.', 'Product strategy · AI UX · Engineering', 'Reduced handoff friction across people, channels, and automation.'],
  ['Platforms', 'Harbor', 'Compliance work made visible and manageable.', 'Information architecture · UX · Platform', 'Turned recurring evidence collection into an accountable system.'],
  ['Platforms', 'Signal', 'Live intelligence for teams making fast decisions.', 'Data design · Product · Frontend', 'Made changing operational data legible at a glance.'],
  ['AI systems', 'Orbit', 'Autonomous operations, clearly controlled.', 'Systems design · AI UX · Engineering', 'Helped teams understand, supervise, and improve automation.'],
  ['AI systems', 'Mosaic', 'Knowledge that assembles around the question.', 'Research · Interaction · AI engineering', 'Connected scattered organizational knowledge through a focused interface.'],
  ['AI systems', 'Vector', 'Planning tools that reason alongside the team.', 'Product strategy · Prototyping · Platform', 'Made assisted planning inspectable, editable, and collaborative.'],
  ['AI systems', 'Beacon', 'Early warnings without alert fatigue.', 'Service design · Data · Machine learning', 'Prioritized signals so operators can act before issues compound.'],
];

const CATEGORY_COLORS = {
  Fintech: 0xcaa36b,
  Health: 0xd5d0c1,
  Commerce: 0xb67d50,
  Platforms: 0x8b9b73,
  'AI systems': 0x687883,
};

export const PROJECTS = PROJECT_SEEDS.map(([category, title, description, role, outcome], index) => ({
  number: String(index + 1).padStart(2, '0'),
  category,
  title,
  description,
  role,
  outcome,
  color: CATEGORY_COLORS[category],
  curveT: 0.075 + index * (0.82 / 19),
  side: Math.floor(index / 2) % 2 === 0 ? -1 : 1,
  district: Math.floor(index / 4),
}));

export const DISTRICTS = [
  { number: 'I', title: 'Capital', range: '01–04' },
  { number: 'II', title: 'Care', range: '05–08' },
  { number: 'III', title: 'Exchange', range: '09–12' },
  { number: 'IV', title: 'Systems', range: '13–16' },
  { number: 'V', title: 'Intelligence', range: '17–20' },
];

export const COLORS = {
  background: 0x111315,
  ground: 0x5f8145,
  groundDark: 0x3a5230,
  terrain: 0x4c6b38,
  road: 0x303235,
  roadEdge: 0xa99f8f,
  shoulder: 0x6e695f,
  roadMark: 0xe6dcc8,
  orange: 0xdc7431,
  orangeDark: 0xa84c1d,
  cream: 0xf4ead6,
  glass: 0x22272a,
  tree: 0x536435,
  treeLight: 0x71814b,
  trunk: 0x654731,
};

// A long, open route with broad curves rather than a compressed switchback.
export const ROAD_POINTS = [
  [-112, -102], [-102, -88], [-78, -80], [-56, -87], [-36, -78],
  [-26, -58], [-35, -40], [-58, -29], [-74, -10], [-69, 10],
  [-47, 24], [-18, 18], [2, 28], [8, 49], [-7, 66],
  [-31, 72], [-46, 89], [-37, 108], [-13, 118], [13, 111],
  [29, 94], [51, 89], [70, 101], [82, 122], [104, 132],
  [124, 123], [133, 102], [126, 82], [105, 70], [84, 74],
  [70, 60], [74, 40], [95, 28], [117, 15], [124, -7],
  [113, -27], [88, -32], [68, -47], [66, -69], [82, -88],
  [105, -96], [126, -88],
];

export const WORLD_BOUNDS = { minX: -135, maxX: 142, minZ: -116, maxZ: 145 };
