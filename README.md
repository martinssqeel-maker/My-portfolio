# Martins — Personal Engineering Portfolio

A refined, high-performance personal portfolio built for **Martins** (`martinssqeel-maker`), featuring intentional typography, accessible interactions, interactive UI simulators, and a clear breakdown of practical training (SIWES) and technical competencies.

---

## ⚡ Tech Stack & Architecture

- **Core:** React 19 + Vite 8
- **Styling:** Tailwind CSS + Modern CSS Variables
- **Icons:** Custom SVG + Lucide React
- **Typography:** Plus Jakarta Sans & JetBrains Mono
- **Design Philosophy:** Human-designed, zero AI-template boilerplate, zero layout shift (CLS 0.00), high-contrast accessible dark palette.

---

## 🛠 Project Structure

```
├── public/
│   └── favicon.svg           # Custom geometric monogram favicon
├── src/
│   ├── assets/               # Local static assets (add profile.jpg here)
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky navigation with scroll-spy active state & mobile drawer
│   │   ├── Hero.jsx          # Confident headline, 1-click email copy & interactive spec console
│   │   ├── About.jsx         # Personal narrative, core tenets (01-04) & daily focus areas
│   │   ├── Skills.jsx        # Categorized technical taxonomy with filter pills
│   │   ├── Projects.jsx      # Visually dominant case study + editorial project cards
│   │   ├── InteractivePulseDemo.jsx  # Interactive live sprint simulator
│   │   ├── InteractiveLuminaDemo.jsx # Interactive accessible primitive tester
│   │   ├── InteractiveApexDemo.jsx   # Interactive live currency volatility calculator
│   │   ├── Experience.jsx    # SIWES practical industrial training & engineering journey
│   │   ├── Contact.jsx       # Direct email copy, verified GitHub, & validated message form
│   │   ├── Footer.jsx        # Minimalist copyright, back-to-top trigger & quick links
│   │   └── Icons.jsx         # Clean, standard SVG brand icons
│   ├── data/
│   │   └── portfolioData.js  # Centralized configuration for all personal data & projects
│   ├── App.jsx
│   ├── index.css             # Tailwind imports, custom scrollbars, accessibility tokens
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ How to Customize Your Real Data

All project content, links, bio text, and SIWES details are centralized in:

📁 `src/data/portfolioData.js`

You can update:
1. **Personal Details:** Full name, location, email, and social profiles.
2. **Projects:** Titles, descriptions, live deployment URLs, and GitHub links.
3. **SIWES Training:** Specific institution, company name, and time period.
4. **Skills:** Real tools, comfort levels, and implementation notes.

---

## 🚀 Development & Building

```bash
# Install dependencies
npm install

# Start local dev server (port 5173)
npm run dev

# Lint code for errors
npm run lint

# Compile optimized production bundle
npm run build
```
