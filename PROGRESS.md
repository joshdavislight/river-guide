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
- [x] Create `src/lib/components/PermitBadge.svelte` (smart coloring for permit types + tooltips)
- [x] Create `src/lib/components/StarRating.svelte` (1-5 star display)
- [x] Create `src/lib/components/TableCell.svelte` (reusable table cell renderer)

### Calendar Components
- [x] Create `src/lib/components/RiverCalendar.svelte` (main orchestrator)
- [x] Create `src/lib/components/CalendarGrid.svelte` (12-month calendar table)
- [x] Create `src/lib/components/CalendarFilters.svelte` (search, permit, class, sort filters)
- [x] Create `src/lib/components/CalendarLegend.svelte` (color key legend)
- [x] Create `src/lib/components/CalendarPopup.svelte` (river detail modal)

### Widget Components
- [ ] Create `src/lib/components/PermitCalendarWidget.svelte` (deferred)
- [ ] Create `src/lib/components/FlowDashboardWidget.svelte` (deferred)

### Home Page
- [x] Build `src/routes/+page.svelte` with card grid, table view, AND calendar view
- [x] Add filtering/search UI (state, permit type, class)
- [x] Add view toggle (Cards / Table / Calendar)
- [x] Add sortable table columns with configurable visibility
- [x] Implement responsive grid layout
- [x] Move search to header with URL persistence

---

## Phase 3: Content Pipeline ✅

### Markdown Processing
- [x] Configure mdsvex in `svelte.config.js`
- [x] Create `src/lib/utils/rivers.ts` for processing frontmatter
- [x] Rivers loaded at build time via gray-matter
- [x] Install and configure `marked` for proper markdown-to-HTML conversion
- [x] Create `src/lib/utils/parseRiverSeasons.ts` for extracting season data from markdown

### Season Parsing System
- [x] Parse "When to Go" sections for optimal/good months
- [x] Parse "When NOT to Go" sections for avoid periods and caveats
- [x] Detect caveat severity levels (severe, moderate, minor)
- [x] Detect caveat types (crowds, heat, bugs, flow-window)
- [x] Handle month ranges (e.g., "July-August") and season words (e.g., "Spring")

### River Page Template
- [x] Build `src/routes/rivers/[slug]/+page.svelte`
- [x] Create `src/routes/rivers/[slug]/+page.server.ts` (load at build time, `prerender = true`)
- [x] Design sections: overview, rapids, camps, permits, shuttle, dangers
- [x] "At a Glance" info grid with icons

### River Content — ALL 31 RIVERS REVISED ✅
All river files moved to `-revised.md` naming convention with enhanced season sections:
- [x] `middle-fork-salmon.md` (original)
- [x] `grand-canyon-revised.md`
- [x] `rogue-river-revised.md`
- [x] `main-salmon-revised.md`
- [x] `selway-revised.md`
- [x] `yampa-river-revised.md`
- [x] `desolation-canyon-revised.md`
- [x] `san-juan-river-revised.md`
- [x] `hells-canyon-revised.md`
- [x] `gates-of-lodore-revised.md`
- [x] `smith-river-revised.md`
- [x] `salt-river-revised.md`
- [x] `rio-chama-revised.md`
- [x] `cataract-canyon-revised.md`
- [x] `westwater-canyon-revised.md`
- [x] `ruby-horsethief-revised.md`
- [x] `deschutes-river-revised.md`
- [x] `tuolumne-river-revised.md`
- [x] `owyhee-lower-revised.md`
- [x] `owyhee-middle-revised.md`
- [x] `john-day-river-revised.md`
- [x] `grande-ronde-revised.md`
- [x] `lower-salmon-revised.md`
- [x] `illinois-river-revised.md`
- [x] `north-fork-flathead-revised.md`
- [x] `middle-fork-flathead-revised.md`
- [x] `klamath-river-revised.md`
- [x] `dolores-river-revised.md`
- [x] `gunnison-gorge-revised.md`
- [x] `arkansas-browns-revised.md`

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
- [ ] Build `/permits` calendar page (separate from homepage calendar view)
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

**Layout:**
- [x] `TopoPattern.svelte`
- [x] `Header.svelte` (simplified for MVP)
- [x] `Footer.svelte`

**River Display:**
- [x] `RiverCard.svelte` (with lottery countdown badge)
- [x] `FlowIndicator.svelte`
- [x] `PermitBadge.svelte` (with smart coloring + tooltips)
- [x] `StarRating.svelte`
- [x] `TableCell.svelte` (reusable cell renderer)

**Calendar System:**
- [x] `RiverCalendar.svelte` (orchestrator with state management)
- [x] `CalendarGrid.svelte` (12-month grid with permit season brackets)
- [x] `CalendarFilters.svelte` (search, permit, class, sort dropdowns)
- [x] `CalendarLegend.svelte` (color key: optimal/good/avoid/off-season + caveats)
- [x] `CalendarPopup.svelte` (river detail modal with severity warnings)

**Deferred:**
- [ ] `PermitCalendarWidget.svelte`
- [ ] `FlowDashboardWidget.svelte`

### Utilities (`src/lib/utils/`)
- [x] `usgs.ts` — USGS API integration
- [x] `rivers.ts` — River markdown loader with `marked` parsing
- [x] `dates.ts` — Lottery/deadline date helpers
- [x] `parseRiverSeasons.ts` — Season extraction from markdown
- [x] `calendarHelpers.ts` — Calendar display logic
- [x] `riverHelpers.ts` — Permit business logic
- [x] `formatting.ts` — Generic text/number formatters

### Types (`src/lib/types/`)
- [x] `calendar.ts` — CalendarRiver, PermitFilterValue, ClassFilterValue, SortByValue

### Data (`src/lib/data/`)
- [x] `gauges.ts`

### Routes (`src/routes/`)
- [x] `+layout.svelte`
- [x] `+page.svelte` (home with cards + table + calendar views)
- [x] `+page.server.ts` (home data loading)
- [x] `rivers/[slug]/+page.svelte`
- [x] `rivers/[slug]/+page.server.ts`
- [x] `permits/+page.svelte` (placeholder with upcoming deadlines UI)
- [x] `flows/+page.svelte` (placeholder)
- [x] `trip-reports/+page.svelte` (placeholder)

### Static Assets
- [x] `static/favicon.svg`
- [x] `static/CNAME`

### Content
- [x] `content/rivers/` — 31 revised river markdown files
- [x] `content/rivers/old/` — Original river files archived

---

## Current Status

**Phase:** MVP Complete ✅  
**Last Updated:** 2026-01-09  
**Dev Server:** http://localhost:5173/  
**Next Step:** Test production build, deploy to GitHub Pages

---

## Recent Session Accomplishments

### Calendar View System
- [x] 12-month season calendar grid showing optimal/good/avoid/off-season status
- [x] Visual permit season brackets (amber for lottery, grey for standard permits)
- [x] Caveat indicators (dots) for crowds, heat, bugs, flow windows
- [x] Interactive cells that open detail popup on click
- [x] Filter by month (click month header to show only optimal/good rivers)
- [x] Legend showing all color meanings
- [x] Integrated as third view mode on homepage (Cards / Table / Calendar)

### Season Parsing Intelligence
- [x] Automatic extraction of "When to Go" sections from river markdown
- [x] Detection of optimal keywords (best, prime, peak, sweet spot)
- [x] Detection of good keywords (decent, runnable, manageable)
- [x] Month range parsing (e.g., "July-August", "May-September")
- [x] Season word parsing (e.g., "Spring", "Summer")
- [x] Caveat severity detection (severe, moderate, minor)
- [x] Caveat type detection (crowds, heat, bugs, flow-window)

### River Content Revisions
- [x] All 31 rivers enhanced with structured "When to Go" and "When NOT to Go" sections
- [x] Original files preserved in `old/` directory
- [x] Frontmatter includes `controlSeason.start` and `controlSeason.end` dates

### Code Architecture Improvements
- [x] `TableCell.svelte` — Extracted reusable table cell component
- [x] `src/lib/types/calendar.ts` — Centralized TypeScript types
- [x] `calendarHelpers.ts` — Display logic extracted from components
- [x] `riverHelpers.ts` — Business logic for permits and deadlines
- [x] `parseRiverSeasons.ts` — Markdown-to-season-data parser
- [x] `formatting.ts` — Generic formatters (slugify, formatFlow)

### Home Page Features
- [x] Three view modes: Cards, Table, Calendar
- [x] Card view with stylized mountain/river placeholder graphics
- [x] Table view with sortable columns + configurable column visibility
- [x] Calendar view with 12-month season grid
- [x] View toggle in header area
- [x] State and permit type filters
- [x] Search in header with URL persistence (`?q=...`)
- [x] "Lottery closing soon" amber badge (within 30 days)
- [x] Smart permit badge coloring (green for no-permit/self-issue)

### River Detail Pages
- [x] "At a Glance" grid with icons (location, length, class, days, permit, lottery, season, flow)
- [x] Proper markdown rendering with `marked` library
- [x] Rapids section with mile markers and class ratings
- [x] Camps section with features
- [x] Dangers section with warnings
- [x] Shuttle services section

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
- Three view modes: Cards (visual), Table (data-dense), Calendar (season planning)
- Lottery deadlines highlighted in amber when closing within 30 days
- Green permit badges for no-permit and self-issue rivers
- Search persisted in URL for shareability
- Navigation hidden for MVP simplicity
- `marked` library for proper markdown-to-HTML conversion
- Tailwind v4 uses CSS-based config (`@theme` block)
- Calendar shows permit season brackets to visualize controlled access periods
- Caveat system provides contextual warnings (crowds, heat, bugs, flow windows)

### Dependencies Added
- `marked` — Markdown to HTML parser
- `gray-matter` — YAML frontmatter parser
- `lucide-svelte` — Icon library
- `vite-plugin-pwa` — PWA support
- `mdsvex` — Svelte markdown preprocessor

### Architecture Patterns
- Components follow single responsibility principle
- Calendar split into orchestrator + 4 child components (<200 lines each)
- Business logic extracted to `src/lib/utils/riverHelpers.ts`
- Display logic extracted to `src/lib/utils/calendarHelpers.ts`
- TypeScript types centralized in `src/lib/types/`
- Config-driven table columns for easy modification
