/**
 * Personal Portfolio Configuration for Martins Moses
 * 
 * Central configuration file representing Martins Moses' real projects,
 * verified skills, and practical SIWES training journey.
 */

export const personalData = {
  name: "Martins Moses",
  shortName: "Martins",
  handle: "martinssqeel-maker",
  role: "Frontend Developer & Student Builder",
  status: "Open to software roles, SIWES continuation & collaborations",
  availableForHire: true,
  email: "martinssqeel@gmail.com",
  github: "https://github.com/martinssqeel-maker",
  
  // MANUAL ACTION REQUIRED: Provide your real WhatsApp and social URLs if desired
  whatsapp: "", // e.g. "https://wa.me/234XXXXXXXXXX"
  twitter: "",  // Optional: e.g. "https://x.com/yourhandle"
  linkedin: "", // Optional: e.g. "https://linkedin.com/in/yourhandle"
  
  location: "Nigeria",
  
  hero: {
    eyebrow: "Frontend Development · Practical Web Applications · SIWES Trained",
    headline: "Building practical web applications and accessible interfaces.",
    description:
      "I am a frontend developer and student who builds functional, real-world web tools—from VTU data portals to student marketplaces. I focus on responsive design, clean JavaScript/React architecture, and practical software that solves everyday problems.",
    primaryCta: "Explore Real Projects",
    secondaryCta: "Get in Touch",
  },

  about: {
    headline: "Grounded in practical building, not hype.",
    lead: "I'm Martins Moses, a developer focused on building functional, responsive web products that solve tangible problems for real users.",
    paragraphs: [
      "My development journey is driven by practical implementation: writing clean HTML, CSS, and modern JavaScript, then advancing into component-driven React applications. I believe the best way to master software engineering is to build real applications that real people can use, such as Zapdata (a VTU/data-selling portal) and Campus Marketplace (a peer exchange for students).",
      "Through structured academic study, self-directed building, and practical industrial training (SIWES), I have developed a disciplined approach to responsive layouts, cross-device compatibility, and version control with Git and VS Code. I focus on writing clean, readable code and continuously refining my capabilities."
    ],
    principles: [
      {
        number: "01",
        title: "Real-World Utility",
        description: "Focusing on applications that solve actual day-to-day needs, such as mobile data recharging and campus student commerce."
      },
      {
        number: "02",
        title: "Mobile-First for Every User",
        description: "Engineering interfaces that load smoothly and respond gracefully on budget smartphones and fluctuating network speeds."
      },
      {
        number: "03",
        title: "Clean Code & Modern Standards",
        description: "Adhering to semantic HTML, modular CSS/Tailwind, and predictable React state management with clear organization."
      },
      {
        number: "04",
        title: "Rapid Continuous Learning",
        description: "Pairing frontend craft in React and JavaScript with foundational scripting in Python and disciplined Git version control."
      }
    ]
  },

  skills: [
    {
      category: "Core Web Development",
      description: "Fundamental languages and technologies used daily to construct responsive web pages",
      items: [
        { name: "HTML5", level: "Strong Working Knowledge", note: "Semantic structure, accessible forms, meta tags" },
        { name: "CSS3", level: "Strong Working Knowledge", note: "Flexbox, CSS Grid, media queries, custom properties" },
        { name: "JavaScript (ES6+)", level: "Active Building", note: "DOM manipulation, event listeners, fetch/async, arrays & objects" },
        { name: "Tailwind CSS", level: "Working Knowledge", note: "Rapid utility styling, responsive layouts, consistent spacing" },
        { name: "Responsive Web Design", level: "Strong Working Knowledge", note: "Mobile-first viewports, touch-friendly navigation" }
      ]
    },
    {
      category: "Frameworks & Client Architecture",
      description: "Component-driven tools for structuring dynamic user interfaces",
      items: [
        { name: "React", level: "Actively Building", note: "Functional components, useState, useEffect, props flow" },
        { name: "Vite", level: "Working Knowledge", note: "Fast build tooling, local dev server, module bundling" },
        { name: "Web APIs & Fetch", level: "Working Knowledge", note: "Consuming JSON endpoints, handling loading & error states" }
      ]
    },
    {
      category: "Programming & Foundations",
      description: "Core logic, scripting, and algorithmic problem-solving",
      items: [
        { name: "Python", level: "Learning & Practicing", note: "Core syntax, functions, basic data handling and scripts" },
        { name: "Problem Solving & Logic", level: "Active Practice", note: "Conditionals, iterative loops, data formatting" }
      ]
    },
    {
      category: "Developer Tools & Environment",
      description: "Everyday workflow and version control tools",
      items: [
        { name: "VS Code", level: "Primary IDE", note: "Extensions, debugging, integrated terminal, fast editing" },
        { name: "Git & GitHub", level: "Working Knowledge", note: "Repository tracking, commits, branches, pushing code" },
        { name: "Chrome DevTools", level: "Working Knowledge", note: "Inspecting elements, mobile emulation, console debugging" },
        { name: "Command Line / Bash", level: "Working Knowledge", note: "CLI navigation, npm scripts, file operations" }
      ]
    }
  ],

  projects: [
    {
      id: "zapdata",
      featured: true,
      tag: "Flagship Real-World Project",
      title: "Zapdata — VTU & Airtime/Data-Selling Web Application",
      tagline: "A streamlined web platform for purchasing mobile data bundles and airtime across Nigerian telecom networks.",
      role: "Frontend Developer & Creator",
      period: "Active Project",
      problem:
        "Purchasing mobile data through slow USSD codes or bloated banking apps is cumbersome and frequently leads to failed transactions. Students and everyday users need a fast, transparent way to buy affordable SME and direct data bundles with instant feedback.",
      solution:
        "Engineered Zapdata with a clean, responsive purchase interface. Implemented automatic network carrier detection based on phone number prefixes (MTN, Airtel, Glo, 9mobile), dynamic package selection, instant price calculation, and a seamless checkout experience.",
      highlights: [
        "Automatic carrier prefix detection: instantly identifies MTN, Airtel, Glo, and 9mobile numbers",
        "Dynamic plan catalog: SME, Corporate, and Direct data bundles with real pricing and validity periods",
        "Mobile-first responsive checkout designed for quick one-handed phone use",
        "Interactive wallet balance and simulated order confirmation feedback"
      ],
      technologies: ["React", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 / CSS3", "LocalStorage API"],
      liveUrl: "https://zapdata.example.com", // [MANUAL ACTION REQUIRED: Provide live hosted URL if deployed]
      githubUrl: "https://github.com/martinssqeel-maker/zapdata", // [MANUAL ACTION REQUIRED: Confirm exact repo name]
      hasLiveDemo: true,
      features: [
        { label: "Carrier Coverage", value: "MTN, Airtel, Glo, 9mobile" },
        { label: "Phone Carrier Detection", value: "Real-time prefix algorithm" },
        { label: "Target Audience", value: "Students & mobile data consumers" }
      ]
    },
    {
      id: "campus-marketplace",
      featured: false,
      tag: "Student Community Platform",
      title: "Campus Marketplace — Student Peer-to-Peer Exchange",
      tagline: "A localized marketplace enabling university students to buy, sell, and exchange textbooks, dorm essentials, and calculators.",
      role: "Frontend Developer",
      period: "Active Project",
      problem:
        "University students constantly buy and sell textbooks, rechargeable fans, and calculators, but rely on chaotic WhatsApp class groups where listings quickly get buried and prices are inconsistent.",
      solution:
        "Built Campus Marketplace to provide an organized, searchable catalog of campus listings. Features category filtering, budget-friendly search, condition tags, hostel location markers, and a direct click-to-chat WhatsApp button with pre-populated message templates to contact student sellers instantly.",
      highlights: [
        "Structured category browsing for Textbooks, Electronics, Dorm Gear, and Student Services",
        "Campus location tags (Hostel blocks, Faculty quads, Campus gates)",
        "Direct 'Chat Seller on WhatsApp' integration with pre-filled greeting message",
        "Lightweight UI tailored for low-bandwidth campus network connections"
      ],
      technologies: ["React", "JavaScript", "Tailwind CSS", "Responsive Design"],
      liveUrl: "https://campus-market.example.com", // [MANUAL ACTION REQUIRED: Provide live URL if hosted]
      githubUrl: "https://github.com/martinssqeel-maker/campus-marketplace", // [MANUAL ACTION REQUIRED: Confirm repo name]
      hasLiveDemo: true,
      features: [
        { label: "Primary Use Case", value: "Student textbooks & hostel gear" },
        { label: "Seller Contact", value: "Direct WhatsApp click-to-chat" }
      ]
    },
    {
      id: "fashion-web",
      featured: false,
      tag: "E-Commerce / Lookbook Interface",
      title: "Fashion & Apparel Web Showcase",
      tagline: "A modern lookbook and apparel catalog designed for bespoke fashion collections and streetwear brands.",
      role: "Frontend Developer",
      period: "Active Project",
      problem:
        "Independent Nigerian fashion designers and streetwear brands need a modern, visually striking web showcase to present lookbook collections, fabric details, and sizing specifications without paying expensive SaaS e-commerce fees.",
      solution:
        "Created an editorial lookbook interface featuring collection switching, item detail drawers, color swatches, and sizing selectors with direct inquiry avenues.",
      highlights: [
        "Curated lookbook gallery with collection filtering (Streetwear, Contemporary)",
        "Interactive sizing and color palette selector",
        "Visual hierarchy highlighting garment details and fabric specifications",
        "Optimized image containers for smooth mobile scrolling"
      ],
      technologies: ["React", "HTML5", "CSS3", "JavaScript"],
      liveUrl: "https://fashion-showcase.example.com", // [MANUAL ACTION REQUIRED: Provide live URL if hosted]
      githubUrl: "https://github.com/martinssqeel-maker/fashion-web", // [MANUAL ACTION REQUIRED: Confirm repo name]
      hasLiveDemo: true,
      features: [
        { label: "Design Style", value: "Editorial & minimalist" },
        { label: "Key Interaction", value: "Collection filtering & sizing" }
      ]
    }
  ],

  experience: [
    {
      period: "Practical Industrial Training (SIWES)",
      role: "Frontend Engineering Intern / SIWES Trainee",
      organization: "[MANUAL ACTION REQUIRED: Your SIWES Company / IT Firm Name]",
      institution: "[MANUAL ACTION REQUIRED: Your University / Polytechnic Name]",
      location: "Nigeria",
      summary:
        "Completed the Students Industrial Work Experience Scheme (SIWES) practical training, gaining direct hands-on experience working on real-world software tasks, user interface debugging, and collaborative development.",
      contributions: [
        "Built and maintained responsive web layouts using semantic HTML5, modern CSS3, and JavaScript.",
        "Collaborated with senior developers to diagnose interface bugs and optimize viewport scaling for mobile devices.",
        "Applied Git version control fundamentals (branching, commits, pull requests) to manage daily codebase changes.",
        "Tested web pages across different mobile browsers to ensure consistent user experience under varying network speeds."
      ],
      skillsApplied: ["HTML5", "CSS3", "JavaScript", "Git & GitHub", "Responsive Design", "Cross-Browser Testing"]
    },
    {
      period: "Practical Product Development",
      role: "Independent Builder",
      organization: "Personal Software Projects (Zapdata & Campus Marketplace)",
      location: "Nigeria",
      summary:
        "Designed and implemented functional web applications from scratch, translating practical everyday user problems into working software products.",
      contributions: [
        "Architected Zapdata, implementing telecom carrier prefix auto-detection and data bundle selection.",
        "Developed Campus Marketplace, structuring student category filters and direct WhatsApp seller communication.",
        "Practiced clean component structuring in React and rapid layout development with Tailwind CSS."
      ],
      skillsApplied: ["React", "JavaScript", "Tailwind CSS", "UI Layouts", "State Management"]
    },
    {
      period: "Academic Study & Continuous Learning",
      role: "Student & Self-Taught Developer",
      organization: "Computer Science / Technical Studies",
      location: "Nigeria",
      summary:
        "Building a solid academic and technical foundation in computational thinking, programming logic, and modern web development standards.",
      contributions: [
        "Practicing Python programming for logic building, scripts, and algorithmic problem-solving.",
        "Studying software engineering fundamentals, database concepts, and internet protocols.",
        "Consistently tracking learning projects and version control on GitHub using VS Code."
      ],
      skillsApplied: ["Python", "Algorithms & Logic", "Web Fundamentals", "VS Code", "GitHub"]
    }
  ]
};
