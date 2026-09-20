/**
 * Personal Portfolio Configuration for Martins Moses
 *
 * Central configuration for professional positioning, real shipped products,
 * and builder journey experience.
 */

export const personalData = {
  name: "Martins Moses",
  shortName: "Martins",
  handle: "Martinssqeel",
  role: "Frontend Developer & Web Product Builder",
  status: "Open to software roles, freelance work & collaborations",
  availableForHire: true,
  email: "martinssqeel@gmail.com",
  github: "https://github.com/martinssqeel-maker",

  // Custom domain placeholder (unconfirmed - left editable for when custom domain is acquired)
  domain: "",

  whatsapp: "", // e.g. "https://wa.me/234XXXXXXXXXX"
  twitter: "",
  linkedin: "",

  location: "Nigeria",

  hero: {
    eyebrow: "Frontend Development · Web Products · Client Delivery",
    headline: "I build web products that work for real people.",
    description:
      "I am Martins Moses — a frontend developer who turns ideas into fully deployed, functional web products that real people use every day.",
    primaryCta: "Explore Live Products",
    secondaryCta: "Get in Touch",
  },

  about: {
    headline: "Grounded in shipping products, not hype.",
    lead: "I am Martins Moses — a frontend developer who turns ideas into fully deployed, functional web products that real people use every day.",
    paragraphs: [
      "My work is driven by practical delivery: clean HTML, CSS, and modern JavaScript, then component-driven React applications that ship to production. I focus on products people actually use — from VTU and data-selling platforms to client e-commerce storefronts.",
      "Through freelance client work and continuous self-directed building, I have developed a disciplined approach to responsive layouts, cross-device compatibility, and version control with Git. I write readable code, ship live URLs, and keep refining every release.",
    ],
    principles: [
      {
        number: "01",
        title: "Real-World Utility",
        description:
          "Focusing on applications that solve actual day-to-day needs, such as mobile data recharging and client commerce storefronts.",
      },
      {
        number: "02",
        title: "Mobile-First for Every User",
        description:
          "Engineering interfaces that load smoothly and respond gracefully on budget smartphones and fluctuating network speeds.",
      },
      {
        number: "03",
        title: "Clean Code & Modern Standards",
        description:
          "Adhering to semantic HTML, modular CSS/Tailwind, and predictable React state management with clear organization.",
      },
      {
        number: "04",
        title: "Ship, Learn, Iterate",
        description:
          "Pairing frontend craft in React and JavaScript with continuous delivery, live deployments, and disciplined Git version control.",
      },
    ],
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
        { name: "Responsive Web Design", level: "Strong Working Knowledge", note: "Mobile-first viewports, touch-friendly navigation" },
      ],
    },
    {
      category: "Frameworks & Client Architecture",
      description: "Component-driven tools for structuring dynamic user interfaces",
      items: [
        { name: "React", level: "Actively Building", note: "Functional components, useState, useEffect, props flow" },
        { name: "Vite", level: "Working Knowledge", note: "Fast build tooling, local dev server, module bundling" },
        { name: "Web APIs & Fetch", level: "Working Knowledge", note: "Consuming JSON endpoints, handling loading & error states" },
      ],
    },
    {
      category: "Programming & Foundations",
      description: "Core logic, scripting, and algorithmic problem-solving",
      items: [
        { name: "Python", level: "Learning & Practicing", note: "Core syntax, functions, basic data handling and scripts" },
        { name: "Problem Solving & Logic", level: "Active Practice", note: "Conditionals, iterative loops, data formatting" },
      ],
    },
    {
      category: "Developer Tools & Environment",
      description: "Everyday workflow and version control tools",
      items: [
        { name: "VS Code", level: "Primary IDE", note: "Extensions, debugging, integrated terminal, fast editing" },
        { name: "Git & GitHub", level: "Working Knowledge", note: "Repository tracking, commits, branches, pushing code" },
        { name: "Chrome DevTools", level: "Working Knowledge", note: "Inspecting elements, mobile emulation, console debugging" },
        { name: "Command Line / Bash", level: "Working Knowledge", note: "CLI navigation, npm scripts, file operations" },
      ],
    },
  ],

  projects: [
    {
      id: "zapdata",
      featured: true,
      tag: "Live Product",
      title: "Zapdata — VTU & Data Selling Platform",
      tagline:
        "A live web platform for purchasing mobile data bundles and airtime across Nigerian telecom networks.",
      role: "Frontend Developer & Creator",
      period: "Live Product",
      problem:
        "Purchasing mobile data through slow USSD codes or bloated banking apps is cumbersome and frequently leads to failed transactions. Everyday users need a fast, transparent way to buy affordable SME and direct data bundles with instant feedback.",
      solution:
        "Engineered Zapdata with a clean, responsive purchase interface. Implemented automatic network carrier detection based on phone number prefixes (MTN, Airtel, Glo, 9mobile), dynamic package selection, instant price calculation, and a seamless checkout experience — fully deployed for real users.",
      highlights: [
        "Automatic carrier prefix detection: instantly identifies MTN, Airtel, Glo, and 9mobile numbers",
        "Dynamic plan catalog: SME, Corporate, and Direct data bundles with real pricing and validity periods",
        "Mobile-first responsive checkout designed for quick one-handed phone use",
        "Live production deployment serving real customers daily",
      ],
      technologies: ["React", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 / CSS3", "LocalStorage API"],
      liveUrl: "https://www.zapdata.com.ng/",
      githubUrl: "",
      hasLiveDemo: true,
      features: [
        { label: "Carrier Coverage", value: "MTN, Airtel, Glo, 9mobile" },
        { label: "Phone Carrier Detection", value: "Real-time prefix algorithm" },
        { label: "Status", value: "Live in production" },
      ],
    },
    {
      id: "suleman-fashion",
      featured: false,
      tag: "Client Delivery",
      title: "Suleman Fashion Store — E-Commerce Platform",
      tagline:
        "A fully deployed e-commerce storefront for a fashion brand, built end-to-end as freelance client work.",
      role: "Frontend Developer — Freelance",
      period: "Client Delivery",
      problem:
        "Independent fashion brands need a modern, conversion-ready web storefront to present collections, handle product browsing, and drive inquiries — without expensive SaaS lock-in.",
      solution:
        "Delivered Suleman Fashion Store as a polished e-commerce interface with product catalog browsing, collection presentation, and a mobile-first shopping experience, deployed live for the client.",
      highlights: [
        "Curated product catalog with collection-focused browsing",
        "Mobile-first storefront optimized for conversion on phones",
        "Clean visual hierarchy highlighting garments and brand identity",
        "Fully live client delivery on Netlify",
      ],
      technologies: ["React", "HTML5", "CSS3", "JavaScript", "Netlify"],
      liveUrl: "https://helpful-lebkuchen-2ce9af.netlify.app/",
      githubUrl: "",
      hasLiveDemo: true,
      features: [
        { label: "Engagement Type", value: "Freelance client delivery" },
        { label: "Deployment", value: "Live on Netlify" },
      ],
    },
  ],

  experience: [
    {
      period: "2024 — Present",
      role: "Freelance Frontend Developer",
      organization: "Independent Client & Product Work",
      institution: null,
      location: "Nigeria",
      summary:
        "Delivering production frontend work for clients and personal products — from e-commerce storefronts to live VTU platforms — with a focus on responsive UI, clean React architecture, and shipped deployments.",
      contributions: [
        "Built and shipped Suleman Fashion Store, a live e-commerce storefront for a fashion client.",
        "Created and maintain Zapdata, a production VTU and data-selling platform used by real customers.",
        "Delivered mobile-first interfaces with semantic HTML, modern CSS/Tailwind, and React components.",
        "Managed end-to-end delivery: design translation, implementation, deployment, and iteration.",
      ],
      skillsApplied: ["React", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Netlify", "Git & GitHub"],
    },
    {
      period: "2023 — Present",
      role: "Self-Directed Developer",
      organization: "Continuous Building & Technical Growth",
      institution: null,
      location: "Nigeria",
      summary:
        "Building a strong technical foundation through continuous project work, deliberate practice, and shipping real products rather than tutorial-only learning.",
      contributions: [
        "Practiced modern frontend fundamentals daily: HTML, CSS, JavaScript, and React.",
        "Shipped multiple live products and prototypes to production hosting environments.",
        "Strengthened Git/GitHub workflow, debugging with DevTools, and component-driven architecture.",
        "Expanded problem-solving skills with Python scripting and algorithmic practice.",
      ],
      skillsApplied: ["React", "JavaScript", "Python", "VS Code", "Git & GitHub", "Chrome DevTools"],
    },
  ],
};
