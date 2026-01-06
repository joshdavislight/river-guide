# River Guide PWA — Progress Tracker

> A Progressive Web App for multi-day rafting rivers in the Western US  
> Domain: rivers.saltyfox.xyz

---

## Phase 1: Scaffold ✅

### Project Initialization
- [x] Initialize SvelteKit project with `npx sv create .`
- [x] Install dependencies from spec (adapter-static, tailwind, vite-plugin-pwa, mdsvex, etc.)
- [x] Configure `svelte.config.js` with static adapter
- [x] Configure `vite.config.js` with PWA plugin
- [x] Set up Tailwind v4 with design system colors (via CSS @theme)

### Design System Setup
- [x] Create `src/routes/layout.css` with Tailwind imports and CSS variables
- [x] Add Inter and JetBrains Mono fonts
- [x] Set up color palette (slate dark theme, sky accents, status colors)

### Core Structure
- [x] Create `src/lib/components/TopoPattern.svelte`
- [x] Set up basic routing structure (`/`, `/rivers/[slug]`, `/permits`, `/flows`, `/trip-reports`)
- [x] Create `content/rivers/` directory for markdown files
- [x] Create `static/` directory structure

### PWA Configuration
- [x] Add PWA favicon (SVG)
- [x] Configure manifest in vite.config.ts
- [x] Add `static/CNAME` for custom domain

---

## Phase 2: Core Components ✅

### Layout Components
- [x] Create `src/lib/components/Header.svelte` (logo + search, nav hidden for MVP)
- [x] Create `src/lib/components/Footer.svelte`
- [x] Create `src/routes/+layout.svelte` (integrate Header, Footer, TopoPattern)

### River Display Components
- [x] Create `src/lib/components/RiverCard.svelte` (thumbnail view with lottery countdown badge)
- [x] Create `src/lib/components/FlowIndicator.svelte` (status badge with pulse animation)
- [x] Create `src/lib/components/PermitBadge.svelte` (smart coloring for permit types)
- [x] Create `src/lib/components/StarRating.svelte` (1-5 star display)

### Widget Components
- [ ] Create `src/lib/components/PermitCalendarWidget.svelte` (deferred)
- [ ] Create `src/lib/components/FlowDashboardWidget.svelte` (deferred)

### Home Page
- [x] Build `src/routes/+page.svelte` with card grid and table view
- [x] Add filtering/search UI (state, permit type)
- [x] Add view toggle (Cards / Table)
- [x] Add sortable table columns
- [x] Implement responsive grid layout
- [x] Move search to header with URL persistence

---

## Phase 3: Content Pipeline ✅

### Markdown Processing
- [x] Configure mdsvex in `svelte.config.js`
- [x] Create `src/lib/utils/rivers.ts` for processing frontmatter
- [x] Rivers loaded at build time via gray-matter
- [x] Install and configure `marked` for proper markdown-to-HTML conversion

### River Page Template
- [x] Build `src/routes/rivers/[slug]/+page.svelte`
- [x] Create `src/routes/rivers/[slug]/+page.server.ts` (load at build time, `prerender = true`)
- [x] Design sections: overview, rapids, camps, permits, shuttle, dangers
- [x] "At a Glance" info grid with icons

### River Content — ALL 31 RIVERS COMPLETE ✅
- [x] `middle-fork-salmon.md`
- [x] `grand-canyon.md`
- [x] `rogue-river.md`
- [x] `main-salmon.md`
- [x] `selway.md`
- [x] `yampa-river.md`
- [x] `desolation-canyon.md`
- [x] `san-juan-river.md`
- [x] `hells-canyon.md`
- [x] `gates-of-lodore.md`
- [x] `smith-river.md`
- [x] `salt-river.md`
- [x] `rio-chama.md`
- [x] `cataract-canyon.md`
- [x] `westwater-canyon.md`
- [x] `ruby-horsethief.md`
- [x] `deschutes-river.md`
- [x] `tuolumne-river.md`
- [x] `owyhee-lower.md`
- [x] `owyhee-middle.md`
- [x] `john-day-river.md`
- [x] `grande-ronde.md`
- [x] `lower-salmon.md`
- [x] `illinois-river.md`
- [x] `north-fork-flathead.md`
- [x] `middle-fork-flathead.md`
- [x] `klamath-river.md`
- [x] `dolores-river.md`
- [x] `gunnison-gorge.md`
- [x] `chattooga-river.md`
- [x] `arkansas-browns-canyon.md`

---

## Phase 4: Integrations ✅

### USGS Flow Integration
- [x] Create `src/lib/utils/usgs.ts` with API functions
- [x] Create `src/lib/data/gauges.ts` for gauge mappings
- [x] Implement `getCurrentFlow()` function
- [x] Implement `getMultipleFlows()` function
- [x] Implement `getFlowStatus()` function

### Flow Dashboard
- [x] Build `src/routes/flows/+page.svelte` (placeholder)
- [ ] Display all rivers with current flow status (deferred)
- [ ] Add sorting/filtering by status (deferred)

### Date Utilities
- [x] Create `src/lib/utils/dates.ts`
- [x] Implement permit deadline calculations
- [x] Add lottery window helpers
- [x] `isLotteryOpen()`, `getNextOccurrence()`, `daysUntil()` functions

---

## Phase 5: Deployment ⬜

### GitHub Actions
- [x] Create `.github/workflows/deploy.yml`
- [ ] Test build process locally (`npm run build`)
- [ ] Verify `build/` directory output
- [ ] Verify all river pages are pre-rendered

### Custom Domain
- [x] Add `static/CNAME` with `rivers.saltyfox.xyz`
- [ ] Configure DNS CNAME record
- [ ] Enable HTTPS in GitHub Pages settings

### PWA Testing
- [ ] Test service worker registration
- [ ] Verify offline functionality
- [ ] Test USGS cache behavior

---

## Phase 6: Polish ⬜

### MVP Complete — Future Enhancements
- [ ] Re-enable navigation menu as pages are built
- [ ] Build full `/flows` dashboard with live USGS data
- [ ] Build `/permits` calendar page
- [ ] Build `/trip-reports` submission system
- [ ] Add page transitions
- [ ] Optimize images (lazy loading, srcset)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit

---

## File Checklist

### Config Files
- [x] `package.json`
- [x] `svelte.config.js`
- [x] `vite.config.ts`
- [x] Tailwind configured via CSS @theme (Tailwind v4)
- [x] `.github/workflows/deploy.yml`

### Components (`src/lib/components/`)
- [x] `TopoPattern.svelte`
- [x] `Header.svelte` (simplified for MVP)
- [x] `Footer.svelte`
- [x] `RiverCard.svelte` (with lottery countdown badge)
- [x] `FlowIndicator.svelte`
- [x] `PermitBadge.svelte` (with smart coloring)
- [x] `StarRating.svelte`
- [ ] `PermitCalendarWidget.svelte` (deferred)
- [ ] `FlowDashboardWidget.svelte` (deferred)

### Utilities (`src/lib/utils/`)
- [x] `usgs.ts`
- [x] `rivers.ts` (with `marked` for markdown parsing)
- [x] `dates.ts`

### Data (`src/lib/data/`)
- [x] `gauges.ts`

### Routes (`src/routes/`)
- [x] `+layout.svelte`
- [x] `+page.svelte` (home with cards + table views)
- [x] `+page.server.ts` (home data loading)
- [x] `rivers/[slug]/+page.svelte`
- [x] `rivers/[slug]/+page.server.ts`
- [x] `permits/+page.svelte` (placeholder)
- [x] `flows/+page.svelte` (placeholder)
- [x] `trip-reports/+page.svelte` (placeholder)

### Static Assets
- [x] `static/favicon.svg`
- [x] `static/CNAME`

---

## Current Status

**Phase:** MVP Complete ✅  
**Last Updated:** 2026-01-06  
**Dev Server:** http://localhost:5173/  
**Next Step:** Test production build, deploy to GitHub Pages

---

## Recent Session Accomplishments

### Home Page Features
- [x] Card view with stylized mountain/river placeholder graphics
- [x] Table view with sortable columns (Name, Location, Class, Miles, Days, Season, Permit, Deadline)
- [x] View toggle (Cards / Table) — defaults to table
- [x] State and permit type filters
- [x] Search moved to header with URL persistence (`?q=...`)
- [x] "Lottery closing soon" amber badge on cards (within 30 days)
- [x] Amber highlighting for lottery deadlines in table view
- [x] Season column showing optimal run times
- [x] Smart permit badge coloring (green for no-permit/self-issue)

### River Detail Pages
- [x] "At a Glance" grid with icons (location, length, class, days, permit, lottery, season, flow)
- [x] Proper markdown rendering with `marked` library
- [x] Rapids section with mile markers and class ratings
- [x] Camps section with features
- [x] Dangers section with warnings
- [x] Shuttle services section

### Header
- [x] Simplified for MVP (logo + search only)
- [x] Navigation hidden until other pages are built
- [x] Expandable search with URL sync

---

## Notes

### Testing Strategy
For this project, "tests" means validation checks rather than unit tests:
- Lighthouse PWA audit passes
- Offline mode works  
- All rivers render without errors
- USGS fetch handles failures gracefully
- Build completes with all pages pre-rendered

### Design Decisions
- Mobile-first responsive design
- Dark theme with slate backgrounds, sky-500 accent
- Table view as default (shows more rivers at once)
- Lottery deadlines highlighted in amber when closing within 30 days
- Green permit badges for no-permit and self-issue rivers
- Search persisted in URL for shareability
- Navigation hidden for MVP simplicity
- `marked` library for proper markdown-to-HTML conversion
- Tailwind v4 uses CSS-based config (`@theme` block)

### Dependencies Added
- `marked` — Markdown to HTML parser
- `gray-matter` — YAML frontmatter parser
- `lucide-svelte` — Icon library
- `vite-plugin-pwa` — PWA support
- `mdsvex` — Svelte markdown preprocessor
