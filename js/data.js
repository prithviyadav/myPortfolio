/**
 * Every fact on the site lives here, sourced from the resume.
 * Sections render from these tables, so updating the resume means
 * editing data - never markup.
 *
 * Link policy: only URLs verified reachable are marked live.
 */

export const PROFILE = {
  name: "Prithvi Yadav",
  role: "Software Development Engineer",
  tagline: "Backend systems. Real users on the other end. Shipped, not theorised.",
  location: "Bengaluru, India",
  email: "prithvi.y24@gmail.com",
  phone: "+91-7042744824",
  linkedin: "https://www.linkedin.com/in/prithvi-yadav-590742232/",
  github: "https://github.com/prithviyadav",
  githubAlt: "https://github.com/prithviyadav-cpu",
  youtube: "https://www.youtube.com/channel/UCWfvh7lUU5YUCNSKgBddB2Q",
  summary:
    "Software Engineer with 1+ years across backend microservices and mobile. End-to-end ownership: design, scoping, implementation, deployment, and post-release monitoring.",
};

export const STATS = [
  { value: "1000+", label: "Problems solved" },
  { value: "Expert", label: "Codeforces" },
  { value: "4★", label: "CodeChef" },
  { value: "145", label: "Global rank, Starters 114" },
];

/** Skills grouped as loadouts. */
export const ARSENAL = [
  {
    tier: "PRIMARY",
    name: "Languages",
    accent: "cyan",
    items: [
      "Go",
      "Java",
      "Python",
      "TypeScript",
      "JavaScript",
      "C++",
      "SQL",
    ],
  },
  {
    tier: "BACKEND",
    name: "Frameworks",
    accent: "pink",
    items: [
      "Spring Boot",
      "Gin",
      "GORM",
      "gRPC",
      "Node.js",
      "React.js",
      "Microservices",
    ],
  },
  {
    tier: "DATA",
    name: "Stores & Streams",
    accent: "cyan",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Kafka",
      "AWS SQS",
      "S3",
    ],
  },
  {
    tier: "OPS",
    name: "Infrastructure",
    accent: "pink",
    items: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "GitHub Actions",
    ],
  },
];

/** Career as a campaign log. Newest first. */
export const CAMPAIGN = [
  {
    org: "Aspora",
    role: "Software Development Engineer",
    period: "Nov 2025 - Present",
    place: "Bengaluru, India",
    status: "ACTIVE",
    accent: "cyan",
    brief:
      "Fintech rails for NRI banking - CRM, remittance, delivery, and the security layer under them.",
    objectives: [
      "Built an internal CRM admin panel from scratch spanning 3 backend microservices, unifying 10+ admin actions (account freeze/unfreeze, card block/unblock, document approve/reject, delivery tracking) into one interface - removing engineering dependency for ops.",
      "Extended the CRM with 2 MFA modes (Login and Step-up, per-form config-driven), scope-based access control, and workflow lifecycle management for ops ticket queues - securing 100% of sensitive admin operations.",
      "Developed a delivery microservice from scratch shipping physical items (welcome kits, cards) across 2 international regions, with a vendor-agnostic architecture that plugs in new carriers with minimal effort.",
      "Delivered an end-to-end outward remittance flow for NRI customers, from mobile-initiated draft requests through CRM ticket lifecycle to ops processing.",
      "Contributed to the NRI banking onboarding pipeline: integrated third-party digital signature and notary providers, added guardian-minor account support and 2 region-specific document templates, drove UAT closure across releases.",
      "Introduced AES-SIV field-level encryption at the ORM layer across 9 database tables, securing PII at rest - transparent to service code, zero application-layer changes.",
      "Shipped compliance work: auto-splitting transfers over the £1M UK FPS limit into compliant chunks with reconciliation, plus notification batching that eliminated dropped alerts under rate limits.",
    ],
  },
  {
    org: "Gameskraft",
    role: "Software Development Engineer",
    period: "Jan 2025 - Nov 2025",
    place: "Bengaluru, India",
    status: "CLEARED",
    accent: "pink",
    brief:
      "Gaming platform at scale - adoption, moderation, ratings, and crash surgery.",
    objectives: [
      "Spearheaded a full-stack, cross-platform In-App Update system from concept to production, accelerating new version adoption by 40% through configurable soft and hard nudges.",
      "Integrated a Google Gemini AI model for display name moderation - false positives down 70%, violation detection up 90%, onboarding drop-offs cut 25%.",
      "Engineered an iOS in-app rating prompt with an FCM-based Node.js trigger, lifting App Store rating from 3.2 to 4.1.",
      "Resolved a critical Lottie rendering crash causing over 5% of all ANRs, shipping a native Android (Java) patch that improved crash-free rate by 2.2%.",
    ],
  },
  {
    org: "NCFL - National Cyber Forensics Lab",
    role: "Software Engineer Intern",
    period: "May 2024 - Jun 2024",
    place: "Delhi, India",
    status: "CLEARED",
    accent: "cyan",
    brief: "Forensic tooling for law enforcement evidence collection.",
    objectives: [
      "Created a WhatsApp Data Extractor in Node.js and Python, automating evidence collection for law enforcement and reducing operational cost by 99%.",
      "Accelerated digital forensic investigation timelines by 50% by streamlining extraction of chats, call logs, and media from Android.",
    ],
  },
];

/**
 * Builds. `live` is set only where a deployment returned 200.
 * `repo` verified to exist on GitHub.
 */
export const BUILDS = [
  {
    name: "Runner.io",
    kind: "Cloud-Based IDE Platform",
    accent: "cyan",
    image: "images/covers/runner.svg",
    blurb:
      "A scalable online IDE that spins up containerised environments for Rust, Go, and Python on Kubernetes. Socket.io carries low-latency execution feedback so code runs and answers instantly.",
    stack: ["Next.js", "Node.js", "Kubernetes", "Socket.io", "TypeScript", "React"],
    repo: "https://github.com/prithviyadav/runner.io",
    live: null,
  },
  {
    name: "LipReader.io",
    kind: "Deep Learning Lip-Reading",
    accent: "pink",
    image: "images/covers/lipreader.svg",
    blurb:
      "CNN + LSTM model transcribing spoken words from visual lip movement alone. 95.2% accuracy on the GRID corpus (sentence-level, overlapped split) - past human lip-reader performance.",
    stack: ["Python", "TensorFlow", "Keras", "OpenCV"],
    repo: "https://github.com/prithviyadav/lipReader",
    live: null,
  },
  {
    name: "Problist",
    kind: "Competitive Programming Tracker",
    accent: "cyan",
    image: "images/covers/problist.svg",
    blurb:
      "A tracker for the 1000+ problem grind - organising practice sets across judges so progress stays measurable instead of vibes-based.",
    stack: ["TypeScript", "Next.js", "Vercel"],
    repo: "https://github.com/prithviyadav/problist",
    live: "https://problist.vercel.app",
  },
  {
    name: "VoiceBot",
    kind: "Conversational Voice Interface",
    accent: "pink",
    image: "images/covers/voicebot.svg",
    blurb:
      "A voice-driven conversational interface - speech in, response out, deployed and running live.",
    stack: ["TypeScript", "Next.js", "Web Speech API"],
    repo: "https://github.com/prithviyadav-cpu/VoiceBot",
    live: "https://voice-bot-six-jet.vercel.app",
  },
  {
    name: "FindFlat.io",
    kind: "Housing Discovery",
    accent: "cyan",
    image: "images/covers/findflat.svg",
    blurb:
      "Flat-hunting without the spreadsheet chaos - listings, filtering, and discovery in one place.",
    stack: ["JavaScript", "Node.js", "MongoDB"],
    repo: "https://github.com/prithviyadav/findflat.io",
    live: null,
  },
  {
    name: "Quiz.io",
    kind: "Realtime Quiz Engine",
    accent: "pink",
    image: "images/covers/quiz.svg",
    blurb:
      "A quiz platform built for competition - timed rounds, scoring, and the pressure that makes trivia actually fun.",
    stack: ["TypeScript", "React", "Node.js"],
    repo: "https://github.com/prithviyadav/quiz.io",
    live: null,
  },
];

export const EDUCATION = [
  {
    school: "Netaji Subhas University of Technology (NSUT), Delhi",
    detail: "B.Tech, Computer Science and Engineering (AI)",
    period: "2021 - 2025",
    score: "CGPA 8.12",
  },
  {
    school: "Bhai Paramanand Vidya Mandir, Delhi",
    detail: "Class 12 (CBSE) - School Topper",
    period: "2021",
    score: "99.8%",
  },
];

export const ACHIEVEMENTS = [
  "Expert on Codeforces.",
  "4-star rated on CodeChef, Global Rank 145 at Starters 114.",
  "1000+ problems solved across LeetCode, InterviewBit, and GeeksforGeeks.",
];
