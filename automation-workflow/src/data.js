export const stages = [
  { id: "trigger", short: "Trigger", label: "Campaign request received", payload: "Campaign brief loaded" },
  { id: "plan", short: "Plan", label: "Brand rules and audience mapped", payload: "Brand context attached" },
  { id: "create", short: "Create", label: "AI copy and visual assets generated", payload: "12 creative assets created" },
  { id: "approve", short: "Approve", label: "Human review completed", payload: "Campaign package approved" },
  { id: "publish", short: "Publish", label: "Posts adapted and published", payload: "4 social posts delivered" },
  { id: "engage", short: "Engage", label: "Audience activity classified", payload: "Replies and sentiment captured" },
  { id: "report", short: "Results", label: "Campaign output assembled", payload: "Results returned to the next brief" },
];

export const workflowNodes = [
  { id: "schedule", stage: 0, name: "Schedule Trigger", kind: "Trigger", color: 0x8b5cf6, position: [-14, 0, 4], input: "Weekdays · 09:00", action: "Starts the campaign automatically", output: "New workflow run", description: "A scheduled trigger starts the social campaign without a manual handoff." },
  { id: "content-queue", stage: 0, name: "Content Queue", kind: "Source", color: 0x10b981, position: [-9.5, 0, 4], input: "Approved campaign topic", action: "Reads the next item from the calendar", output: "Topic + audience + due date", description: "The next campaign topic, audience, offer and due date are loaded from the content calendar." },
  { id: "brand-context", stage: 1, name: "Brand Context", kind: "Context", color: 0x6366f1, position: [-5, 0, 4], input: "Topic + brand library", action: "Maps voice, audience and campaign rules", output: "Structured creative brief", description: "Brand voice, campaign goals and audience context are mapped into one reliable brief." },
  { id: "copywriter", stage: 2, name: "AI Copywriter", kind: "AI creation", color: 0x8b5cf6, position: [0, 0, 7.2], input: "Structured creative brief", action: "Generates channel-aware captions", output: "4 caption variants", description: "AI drafts hooks, captions, calls to action and hashtags for each social channel." },
  { id: "visual-generator", stage: 2, name: "Visual Generator", kind: "AI creation", color: 0xec4899, position: [0, 0, .8], input: "Creative direction", action: "Creates the campaign artwork", output: "8 visual assets", description: "The visual branch generates correctly sized campaign artwork for feeds, stories and previews." },
  { id: "approval", stage: 3, name: "Human Approval", kind: "Review", color: 0xf97316, position: [5, 0, 4], input: "Copy + visual package", action: "Requests review in the approval inbox", output: "Human-approved campaign", description: "A person reviews the complete package before anything is published. Rejected work returns for revision." },
  { id: "router", stage: 4, name: "Channel Router", kind: "Routing", color: 0x06b6d4, position: [10, 0, 4], input: "Approved campaign", action: "Adapts payloads by channel", output: "4 channel-ready posts", description: "The router branches the approved campaign and applies each platform's format rules." },
  { id: "instagram", stage: 4, name: "Instagram", kind: "Channel", color: 0xe1306c, position: [15, 0, 9], input: "Caption + 4:5 artwork", action: "Publishes feed and story assets", output: "Instagram post live", description: "The Instagram branch publishes the optimized image, caption, hashtags and story variant." },
  { id: "linkedin", stage: 4, name: "LinkedIn", kind: "Channel", color: 0x0a66c2, position: [15, 0, 5.7], input: "Professional caption + image", action: "Publishes the company update", output: "LinkedIn update live", description: "The LinkedIn branch adapts the message for a professional audience and publishes it." },
  { id: "facebook", stage: 4, name: "Facebook", kind: "Channel", color: 0x1877f2, position: [15, 0, 2.3], input: "Caption + campaign artwork", action: "Publishes to the business page", output: "Facebook post live", description: "The Facebook branch distributes the campaign to the connected business page." },
  { id: "x", stage: 4, name: "X / Twitter", kind: "Channel", color: 0x334155, position: [15, 0, -1], input: "Short copy + image", action: "Publishes the short-form update", output: "X post live", description: "The short-form branch compresses the campaign into a concise, channel-ready post." },
  { id: "engagement", stage: 5, name: "Engagement Monitor", kind: "Listening", color: 0x14b8a6, position: [20, 0, 4], input: "Comments, replies and reactions", action: "Classifies and routes conversations", output: "Sentiment + reply tasks", description: "Live engagement signals are classified, summarized and escalated when a human response is needed." },
  { id: "analytics", stage: 6, name: "Performance Analytics", kind: "Insights", color: 0x3b82f6, position: [24.5, 0, 4], input: "Reach, clicks and conversions", action: "Compares channel performance", output: "Optimization recommendations", description: "Analytics converts channel signals into clear performance insights and recommendations." },
  { id: "campaign-output", stage: 6, name: "Campaign Results", kind: "Delivery", color: 0x7c3aed, position: [29, 0, 4], input: "Posts + assets + performance", action: "Assembles the campaign delivery report", output: "4 posts · 12 assets · insights", description: "The workflow finishes with a visible campaign package, published channel records and an optimization report." },
];

export const connections = [
  ["schedule", "content-queue"], ["content-queue", "brand-context"],
  ["brand-context", "copywriter"], ["brand-context", "visual-generator"],
  ["copywriter", "approval"], ["visual-generator", "approval"],
  ["approval", "router"], ["router", "instagram"], ["router", "linkedin"],
  ["router", "facebook"], ["router", "x"], ["instagram", "engagement"],
  ["linkedin", "engagement"], ["facebook", "engagement"], ["x", "engagement"],
  ["engagement", "analytics"], ["analytics", "campaign-output"],
  ["campaign-output", "brand-context", { feedback: true }],
];
