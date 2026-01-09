# River Guide

A Progressive Web App for planning multi-day rafting trips in the Western United States.

**Live site:** [rivers.saltyfox.xyz](https://rivers.saltyfox.xyz)

River Guide provides detailed information for 31 wilderness rivers including permit requirements, lottery deadlines, rapids, camps, flow conditions, and trip planning details. The site works offline once loaded, making it useful for pre-trip planning in remote areas.

---

## Contributing

The easiest way to contribute is by adding or improving river content. Each river is a markdown file in `content/rivers/` with YAML frontmatter for structured data.

### Adding a New River

1. Create a new file: `content/rivers/your-river-name.md`
2. Add the required frontmatter (see template below)
3. Write the river description and any special considerations
4. Submit a pull request

### River File Template

```yaml
---
name: "River Name"
slug: "river-name"
state: "State"
region: "Pacific Northwest"  # or Southwest, Rocky Mountains, etc.

miles: 40
class: "III-IV"
classMax: 4
daysMin: 3
daysMax: 4

putIn:
  name: "Put-in Name"
  lat: 42.6523
  lon: -123.5847
takeOut:
  name: "Take-out Name"
  lat: 42.4234
  lon: -124.0847

permit:
  required: true
  system: "Recreation.gov Lottery"  # or "Self-issue", "First-come", "None"
  agency: "BLM"
  url: "https://www.recreation.gov/permits/..."
  lotteryWindow:
    open: "01-01"
    close: "01-31"
  resultsDate: "02-15"
  controlSeason:
    start: "05-15"
    end: "10-15"

gauges:
  - id: "14359000"  # USGS gauge ID
    name: "Gauge Name"
    primary: true

flows:
  unit: "cfs"
  minimum: 1500
  optimal:
    low: 2500
    high: 5000
  maximum: 8000
  season: "May-Oct"

ratings:
  permitDifficulty: 4      # 1-5 scale
  amazingness: 4
  popularity: 4
  technicalDifficulty: 3
  familyFriendly: 4

tags:
  - wilderness
  - fishing
  - wildlife

rapids:
  - mile: 7.5
    name: "Rapid Name"
    class: "IV"
    description: "Description of the rapid and how to run it."

camps:
  - name: "Camp Name"
    mile: 5.0
    features: ["beach", "swimming"]

shuttles:
  - name: "Shuttle Company"
    location: "City, State"
    phone: "(555) 555-5555"

dangers:
  - type: "wood"
    description: "Description of hazard."

featured: false
lastUpdated: "2025-01-08"
---

Write a compelling overview of the river here. Describe what makes it special, 
the character of the canyon, and what boaters can expect.

## When to Go

Describe optimal seasons and conditions.

## Permit Strategy

Tips for getting permits if applicable.

## Special Considerations

Use emoji bullets for important safety and planning notes:
- 🌊 **Rapid name** - Description
- 🐻 **Wildlife** - Description
```

---

## Project Structure

```
river-guide/
├── content/
│   └── rivers/           # River markdown files
├── src/
│   ├── lib/
│   │   ├── components/   # Svelte components
│   │   ├── data/         # Static data (gauge mappings)
│   │   └── utils/        # Utility functions
│   └── routes/           # SvelteKit pages
│       ├── rivers/       # River detail pages
│       ├── flows/        # Flow dashboard (placeholder)
│       ├── permits/      # Permit calendar (placeholder)
│       └── trip-reports/ # Trip reports (placeholder)
├── static/               # Static assets (favicon, images)
└── build/                # Generated static site
```

---

## Tech Stack

- **SvelteKit** with static adapter for pre-rendered pages
- **Tailwind CSS v4** for styling
- **vite-plugin-pwa** for offline support
- **gray-matter** + **marked** for markdown processing
- **lucide-svelte** for icons

---

## Development

### Prerequisites

- Node.js 18+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/river-guide.git
cd river-guide

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs at http://localhost:5173

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Other Commands

```bash
npm run check      # Type-check the project
npm run lint       # Run linter
npm run format     # Format code with Prettier
```
