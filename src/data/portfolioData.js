/**
 * Portfolio Data Configuration for Martins
 * 
 * Edit this file to update your personal details, real project links,
 * SIWES institution name, and contact details.
 */

export const personalData = {
  name: "Martins",
  surname: "", // Optional: add last name if desired
  handle: "martinssqeel-maker",
  role: "Frontend Engineer & UI Developer",
  status: "Available for engineering roles & select collaborations",
  availableForHire: true,
  email: "martinssqeel@gmail.com",
  github: "https://github.com/martinssqeel-maker",
  whatsapp: "", // Optional: add your WhatsApp link e.g. "https://wa.me/234XXXXXXXXXX"
  twitter: "", // Optional: e.g. "https://twitter.com/yourhandle"
  linkedin: "", // Optional: e.g. "https://linkedin.com/in/yourprofile"
  location: "Nigeria",
  
  hero: {
    eyebrow: "Frontend Engineering · UI Architecture · Web Performance",
    headline: "Building high-performance interfaces and refined web products.",
    description:
      "I am a frontend developer who treats interface engineering as craft. I focus on clean component architectures, responsive systems, and fast, accessible web experiences that feel natural to use.",
    primaryCta: "Explore Selected Work",
    secondaryCta: "Get in Touch",
  },

  about: {
    headline: "Engineering clean, deliberate digital experiences.",
    lead: "I'm Martins, a frontend developer passionate about the intersection of technical discipline, design precision, and human-friendly software.",
    paragraphs: [
      "My approach to engineering is straightforward: write readable, purposeful code, eliminate unnecessary complexity, and respect the end user's device and time. I prioritize responsive layout stability, semantic markup, and predictable state management over short-lived trends.",
      "Through both focused individual project builds and practical industrial training (SIWES), I have honed my ability to translate functional requirements into polished, intuitive interfaces. Whether structuring complex component trees or obsessing over subtle micro-interactions, I build with longevity and performance in mind."
    ],
    principles: [
      {
        number: "01",
        title: "Design-to-Code Fidelity",
        description: "Interfaces should match their design intention down to typography, proportional spacing, and clear visual hierarchy."
      },
      {
        number: "02",
        title: "Performance by Default",
        description: "Lightweight bundles, zero layout shift, fast initial paint, and snappy interactions across all device classes."
      },
      {
        number: "03",
        title: "Accessibility & Semantics",
        description: "Building with semantic HTML, keyboard navigability, and clear contrast so every user can access the experience."
      },
      {
        number: "04",
        title: "Maintainable Architecture",
        description: "Modular components, sensible naming conventions, and clean state boundaries that remain easy to extend."
      }
    ]
  },

  skills: [
    {
      category: "Frontend & Client Architecture",
      description: "Core technologies used daily to build production web interfaces",
      items: [
        { name: "React", level: "Advanced", note: "Component patterns, hooks, state flow" },
        { name: "JavaScript (ESNext)", level: "Advanced", note: "Modern syntax, async/await, DOM APIs" },
        { name: "HTML5 & Semantic Web", level: "Advanced", note: "Accessible structure, SEO & metadata" },
        { name: "CSS3 & Modern Layouts", level: "Advanced", note: "Flexbox, CSS Grid, custom properties" },
        { name: "Tailwind CSS", level: "Advanced", note: "Design systems, utility architecture" },
        { name: "Responsive Engineering", level: "Advanced", note: "Fluid typography, mobile-first design" },
        { name: "Web Performance", level: "Proficient", note: "Core Web Vitals, asset optimization" }
      ]
    },
    {
      category: "Programming & Logic",
      description: "Computational thinking, data handling, and algorithmic problem-solving",
      items: [
        { name: "JavaScript / TypeScript", level: "Advanced", note: "Type safety & scalable codebases" },
        { name: "Python", level: "Proficient", note: "Data processing, scripting & logic" },
        { name: "Object-Oriented & Functional", level: "Proficient", note: "Clean patterns & paradigm flexibility" },
        { name: "Data Structures & Algorithms", level: "Proficient", note: "Algorithmic thinking & efficiency" }
      ]
    },
    {
      category: "Backend & Data Systems",
      description: "Server communication, API integration, and relational data querying",
      items: [
        { name: "RESTful API Integration", level: "Advanced", note: "Async fetching, caching, error states" },
        { name: "Node.js & Express", level: "Proficient", note: "HTTP servers, middleware, basic APIs" },
        { name: "SQL & Relational DBs", level: "Proficient", note: "Schema comprehension, queries, joins" },
        { name: "HTTP Protocols & Auth", level: "Proficient", note: "Headers, tokens, security basics" }
      ]
    },
    {
      category: "Tooling & Workflow",
      description: "Development environment, version control, and delivery ecosystem",
      items: [
        { name: "Git & GitHub", level: "Advanced", note: "Branching, commits, pull requests" },
        { name: "Vite & Build Tooling", level: "Advanced", note: "Fast HMR, production bundling" },
        { name: "npm & Package Ecosystem", level: "Advanced", note: "Dependency auditing & scripts" },
        { name: "Chrome DevTools", level: "Advanced", note: "Network, memory & performance inspection" },
        { name: "Linux & Bash Terminal", level: "Proficient", note: "CLI workflows, scripting & navigation" }
      ]
    },
    {
      category: "Design & UX Principles",
      description: "Visual precision, usability standards, and interactive details",
      items: [
        { name: "Figma to Code", level: "Advanced", note: "Pixel-accurate implementation" },
        { name: "Typography & Hierarchy", level: "Advanced", note: "Scale, rhythm, legibility" },
        { name: "WCAG Accessibility", level: "Proficient", note: "Color contrast, screen-reader support" },
        { name: "Design Systems", level: "Proficient", note: "Reusable tokens, component consistency" }
      ]
    }
  ],

  projects: [
    {
      id: "pulse-workspace",
      featured: true,
      tag: "Featured Case Study",
      title: "Pulse — Developer Task & Sprint Workspace",
      tagline: "A keyboard-first productivity interface designed for focused developers.",
      role: "Lead Frontend Engineer & UI Designer",
      period: "2026",
      problem:
        "Mainstream project management tools are bogged down with slow load times, bloated notification panels, and cumbersome mouse interactions that pull developers out of their flow state.",
      solution:
        "Engineered a lightweight, keyboard-navigable task workspace featuring instant state synchronization, sprint breakdown metrics, local persistence, and zero visual clutter.",
      highlights: [
        "Instant command-style task management with zero latency",
        "Interactive sprint velocity & completion metric calculations",
        "High-contrast dark mode engineered for prolonged reading comfort",
        "Persistent client-side storage architecture with smooth state transitions"
      ],
      technologies: ["React", "JavaScript (ESNext)", "Tailwind CSS", "Vite", "LocalStorage API"],
      liveUrl: "https://pulse-workspace.preview", // User can replace with real deployment URL
      githubUrl: "https://github.com/martinssqeel-maker/pulse-workspace",
      hasLiveDemo: true,
      metrics: [
        { label: "Bundle Size", value: "< 45 kB" },
        { label: "Interaction Latency", value: "< 16 ms" },
        { label: "Accessibility Score", value: "100" }
      ]
    },
    {
      id: "lumina-ui",
      featured: false,
      tag: "UI Architecture",
      title: "Lumina — Accessible Component & Design System",
      tagline: "A collection of accessible, headless-inspired UI primitives built with clean React.",
      role: "Component Architect",
      period: "2025 – 2026",
      problem:
        "Many teams struggle with heavy UI libraries that ship excess JavaScript and impose inflexible opinionated styling that breaks custom designs.",
      solution:
        "Designed and published an accessible, lightweight design system featuring composable primitives, full keyboard navigation, and WCAG AA color compliance.",
      highlights: [
        "Accessible dialogs, comboboxes, and tabs with full ARIA semantics",
        "Predictable focus management and escape key dismiss patterns",
        "Zero external dependencies outside React core"
      ],
      technologies: ["React", "CSS Variables", "Tailwind CSS", "ARIA / a11y"],
      liveUrl: "https://lumina-ui.preview",
      githubUrl: "https://github.com/martinssqeel-maker/lumina-ui",
      hasLiveDemo: true,
      metrics: [
        { label: "Dependencies", value: "0" },
        { label: "WCAG Compliance", value: "AA" }
      ]
    },
    {
      id: "apex-metrics",
      featured: false,
      tag: "Data Visualization",
      title: "Apex — Currency & Market Intelligence Interface",
      tagline: "Clean financial overview delivering live conversion rates and exchange volatility data.",
      role: "Frontend Developer",
      period: "2025",
      problem:
        "Standard financial websites are filled with distracting advertisements and chaotic layouts that make quick currency calculation slow and error-prone.",
      solution:
        "Built a minimal, responsive market dashboard that streams exchange rates, performs instant calculations, and visualizes 30-day volatility trends cleanly.",
      highlights: [
        "Live exchange calculation with debounced input handling",
        "Custom SVG rate-trend visualizations without heavy charting libraries",
        "Resilient error boundaries and graceful offline fallback"
      ],
      technologies: ["React", "REST API", "SVG Data Charts", "Tailwind CSS"],
      liveUrl: "https://apex-metrics.preview",
      githubUrl: "https://github.com/martinssqeel-maker/apex-metrics",
      hasLiveDemo: true,
      metrics: [
        { label: "API Response", value: "< 200 ms" },
        { label: "Chart Size", value: "Pure SVG" }
      ]
    }
  ],

  experience: [
    {
      period: "Practical Industrial Training (SIWES)",
      role: "Frontend Engineering Intern / Practical Trainee",
      organization: "Industrial Software & Technology Practicum (SIWES)",
      location: "Nigeria",
      summary:
        "Participated in the Students Industrial Work Experience Scheme (SIWES), gaining hands-on engineering experience in web software development, team code reviews, and interface implementation.",
      contributions: [
        "Assisted in developing and maintaining responsive client-facing web interfaces using modern HTML5, CSS3, and JavaScript.",
        "Collaborated with senior software developers to debug layout defects and optimize cross-browser rendering.",
        "Applied Git version control best practices for feature branching, code reviews, and resolving merge conflicts.",
        "Conducted accessibility and responsive viewport testing across mobile, tablet, and desktop environments."
      ],
      skillsApplied: ["HTML5 / CSS3", "JavaScript", "Git & GitHub", "Responsive Design", "Cross-Browser Debugging"]
    },
    {
      period: "Self-Directed Engineering & Product Building",
      role: "Independent Software Builder",
      organization: "Personal Projects & Open-Source Contributions",
      location: "Remote",
      summary:
        "Dedicated deliberate time to deep-dive into modern frontend frameworks, component architecture, and high-performance user interfaces.",
      contributions: [
        "Engineered modular React web applications with clean separation between UI presentation and business logic.",
        "Implemented keyboard accessibility, focus trapping, and responsive typography scales.",
        "Built responsive web products with strict performance budgets and minimal bundle overhead."
      ],
      skillsApplied: ["React", "Tailwind CSS", "Vite", "Component Architecture", "Performance Optimization"]
    },
    {
      period: "Foundations & Computer Science Practicum",
      role: "Technical Foundations",
      organization: "Academic & Practical Study",
      location: "Nigeria",
      summary:
        "Mastered core computational thinking, algorithmic logic, database fundamentals, and web standards.",
      contributions: [
        "Studied relational database principles, SQL syntax, and normalized schema design.",
        "Explored Python programming for algorithmic problem solving and scripting.",
        "Built foundational understanding of client-server network protocols and browser rendering lifecycles."
      ],
      skillsApplied: ["Algorithms", "Python", "SQL", "Web Protocols", "Computer Science Principles"]
    }
  ]
};
