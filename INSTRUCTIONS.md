# Know The Score NYC — Landing Page Build Instructions

## Overview

**Know The Score NYC** is a weekly Substack newsletter by journalist **Isabel Togoh** where she interviews native and non-native New Yorkers about what makes the city great — in their favorite NYC spots. This landing page serves as a visual, map-driven hub linked from Instagram that showcases every interview location and connects visitors to the full Q&As on Substack.

**Live Substack:** https://knowthescorenyc.substack.com
**Google Maps List:** https://maps.app.goo.gl/cjq4xsBkyLYTWZRe6
**Logo:** See `/assets/logo.png` in this repo

---

## 1. Design System

### Brand Colors (extracted from logo)

| Token | Hex | Usage |
|-------|-----|-------|
| `--blue-primary` | `#2B3990` | Headlines, nav, CTA buttons, map UI |
| `--blue-dark` | `#1A237E` | "NYC" text, footer, dark accents |
| `--red-primary` | `#E53935` | Apple icon, map pins, highlights, hover states |
| `--red-light` | `#FF6F61` | Coral/pink shadow accent, secondary buttons |
| `--cream` | `#FFF8F0` | Page background (warm, not stark white) |
| `--white` | `#FFFFFF` | Cards, overlays, map popups |
| `--text-dark` | `#1A1A2E` | Body text |

### Typography

- **Display / Headings:** A playful script or rounded display font that echoes the logo. Options:
  - [Pacifico](https://fonts.google.com/specimen/Pacifico) (closest to logo script)
  - [Lobster](https://fonts.google.com/specimen/Lobster) (alternative)
  - Or use the actual logo font if Isabel has it
- **Body / UI:** Clean sans-serif — `Inter`, `DM Sans`, or `Space Grotesk` from Google Fonts
- **Quotes:** Italic version of the body font, slightly larger

### Design Principles

- **Responsive** — Must look great on both mobile (Instagram traffic) AND desktop. Two-column layout on desktop (map + sidebar), stacked on mobile
- **Map-centric** — The map is the hero, not buried below the fold
- **Warm and human** — Matches the "Humans of New York" vibe; real stories, real places
- **Minimal chrome** — Let the content breathe; the map + quotes do the talking
- **Apple motif** — Use the red apple from the logo as the map pin icon
- **Playful energy** — Animated loading state with dancing NYC quotes sets the tone

### NYC Character — Making It Feel Like New York

Beyond the logo colors, the site should *feel* like walking through the city. Here are design elements to weave in:

**Subway-inspired UI:**
- Use **subway line circles** (colored dots like ①②③) as section dividers or bullet points
- The navigation tabs could look like subway line indicators
- Map pin clusters could reference subway line colors for different boroughs
- Consider subtle MTA Helvetica vibes in the UI elements (not the body text — keep that warm)

**The Anthora Cup:**
- The classic blue-and-white "WE ARE HAPPY TO SERVE YOU" Greek deli coffee cup is *the* NYC icon
- Use it as a decorative element, maybe in the footer or as a loading spinner

**Street-level textures:**
- Subtle brick pattern or brownstone texture as an accent background (very faint, not overwhelming)
- Fire escape silhouette as a decorative border or divider
- Water tower silhouettes in the footer skyline

**Bodega energy:**
- The "Get Interviewed" form could be styled like a bodega receipt or deli counter ticket
- Hand-drawn / marker-style elements scattered around (like a deli chalkboard)

**NYC sounds (optional micro-interactions):**
- Subtle "ding" sound on pin click (like a subway door chime)
- Keep these optional/off by default — don't annoy people

**Borough pride:**
- Color-code pins or cards by borough (Manhattan = blue, Brooklyn = red, Queens = orange, etc.)
- Show a small borough tag on each interview card

**The classics:**
- Yellow taxi accent color (`#F7C948`) as an occasional highlight
- Street sign green (`#006B3F`) for directional elements
- Crosswalk stripe pattern as a section divider

**Map style:**
- Consider using [Stamen Watercolor](http://maps.stamen.com/watercolor/) or [CartoDB Voyager](https://carto.com/basemaps/) tiles instead of plain OpenStreetMap — they look more artistic and match the hand-drawn logo vibe
- Or a warm-toned custom MapBox style if we want to go premium

---

## 2. Site Architecture

```
/ (home)
├── Loading Animation (dancing NYC quotes)
├── Hero section (logo + tagline + CTA)
├── Interactive Map (full-width, the main feature)
├── Interview Gallery (scrollable quote cards)
├── About section (Isabel's mission + subscribe)
├── "Get Interviewed" tab/section (request form)
├── Footer (links, social, Substack)
│
/admin (Decap CMS — Isabel's content management)
```

### Section Details

#### 2.0 Loading Animation — "Dancing NYC Quotes"

When the page first loads, before the map renders, show a **playful animated splash** with iconic NYC sayings flying, bouncing, and dancing across the screen in the logo's script font. Think kinetic typography — words appearing at different sizes, angles, and speeds, drifting across the viewport.

**Example quotes to rotate through:**
- "I'm walkin' here!"
- "If you can make it here..."
- "The city never sleeps"
- "Fuhgeddaboudit"
- "Only in New York"
- "It's a New York thing"
- "The Big Apple"
- "Hey, I'm from New York, I will kill you"
- "Start spreadin' the news"
- "Next stop..."
- "Stand clear of the closing doors"
- "Showtime!"
- "What's good?"

**Animation behavior:**
- Quotes appear in the script font (Pacifico) in varying sizes (24px–72px)
- Colors alternate between `--blue-primary`, `--red-primary`, and `--red-light`
- Each quote floats/drifts from a random edge, bouncing or curving across the screen
- Some rotate slightly, some pulse, some fade in/out
- Duration: ~2-3 seconds, then gracefully fades into the hero + map
- Should feel alive, kinetic, and distinctly NYC
- On subsequent visits (or if the user has visited before), can skip or shorten the animation
- Must work smoothly on mobile AND desktop

**Implementation:** CSS animations + lightweight JS. No heavy libraries. Use `@keyframes` with randomized `animation-delay` and `transform` properties.

#### 2.1 Hero Section
- **Logo** centered, large
- **Tagline:** "Real New Yorkers. Real stories. Real places." (or similar — Isabel can customize)
- **Subtitle:** "A weekly interview series by Isabel Togoh"
- **CTA button:** "Explore the Map" (scrolls to map) + "Read on Substack" (external link)
- Clean, minimal — just enough to orient the visitor before the map

#### 2.2 Interactive Map (THE STAR)
- **Full-width map** of NYC using [Leaflet.js](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/) tiles (free, no API key)
- **Custom map pins** — Use the red apple from the logo as the pin icon (create a small 32x32 or 40x40 PNG)
- **Default view:** Centered on Manhattan (~40.7580, -73.9855), zoom level ~12 to show all boroughs
- **On pin click:** Open a popup/card showing:
  - Interviewee name
  - Their quote (the headline from the interview)
  - Place name + type (e.g., "Union Square Park — Park")
  - Small photo if available
  - "Read the full interview →" link to Substack post
- **Cluster pins** if they overlap using [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)

**Responsive layout:**
- **Desktop (>1024px):** Map takes up ~65% of the width on the left, with a scrollable sidebar on the right showing interview cards. Clicking a card flies to its pin on the map. Clicking a pin highlights its card in the sidebar.
- **Tablet (768–1024px):** Map full-width on top (~60vh), cards below in a 2-column grid
- **Mobile (<768px):** Map nearly full-screen with a draggable bottom sheet. Tapping a pin slides up the bottom sheet with interview details. Swipe down to dismiss.

#### 2.3 Interview Gallery
- **Horizontal scrollable** (mobile) or **grid** (desktop) of quote cards
- Each card shows:
  - Pull quote (the interview headline)
  - Interviewee name + one-line bio
  - Date published
  - Link to full Substack post
- Sorted by most recent first
- Clicking a card could also highlight the corresponding pin on the map

#### 2.4 "Get Interviewed" Section / Tab

A section (or floating tab on the side of the page) where New Yorkers can submit themselves to be interviewed.

**Form fields:**
- Name
- Neighborhood you live in
- How long have you lived in NYC?
- What's your favorite spot in the city?
- Why should Isabel interview you? (short textarea)
- Email or Instagram handle (for Isabel to reach out)

**Design:**
- Styled like a classic NYC deli counter ticket or a bodega receipt
- Or: a postcard you're sending to Isabel
- Submit button says something fun like "Send it!" or "Let's talk!"

**Backend:**
- Use [Netlify Forms](https://docs.netlify.com/forms/setup/) — free, zero config
- Isabel gets email notifications for each submission
- She can review submissions in the Netlify dashboard

#### 2.5 About Section
- Short paragraph from Isabel about the newsletter mission
- Her photo (optional)
- **Subscribe CTA** — embed Substack subscribe form or link to Substack
- Link to the Google Maps list for people who want it in Maps

#### 2.5 Footer
- Links: Substack, Instagram, Google Maps List
- "© 2026 Isabel Togoh"
- Small logo

---

## 3. Content Management (Decap CMS)

### Why Decap CMS (formerly Netlify CMS)
- **Free** and open source
- **Git-based** — content stored as files in the repo (no database needed)
- **Visual editor** — Isabel logs in at `yoursite.com/admin` and sees a friendly form
- **Netlify Identity** — handles login (email + password, free for up to 5 users)

### CMS Schema — Interviews Collection

Each interview is a JSON (or Markdown) file in `/content/interviews/`. Isabel fills out a simple form:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Interviewee's name |
| `quote` | String | Yes | The headline quote from the interview |
| `bio` | String | Yes | One-line bio (e.g., "NYC tour guide and writer") |
| `date` | Date | Yes | Publish date |
| `substackUrl` | String | Yes | Link to the full Substack post |
| `placeName` | String | Yes | Name of the place (e.g., "Union Square Park") |
| `placeType` | String | No | Type of place (e.g., "Park", "Restaurant", "Coffee Shop") |
| `latitude` | Number | Yes | Latitude of the place |
| `longitude` | Number | Yes | Longitude of the place |
| `neighborhood` | String | No | NYC neighborhood (e.g., "Gramercy", "Bed-Stuy") |
| `photo` | Image | No | Photo of interviewee (optional) |

### How Isabel Adds a New Interview

1. Go to `knowthescorenyc.netlify.app/admin` (or custom domain `/admin`)
2. Log in with her email/password
3. Click "New Interview"
4. Fill out the form (name, quote, place, paste Substack link)
5. For lat/lng: She can Google the place name and copy coordinates, OR we can add a map picker widget
6. Click "Publish"
7. Netlify auto-rebuilds the site in ~30 seconds
8. New pin appears on the map

### Helpful: Lat/Lng Lookup
To make it easy for Isabel, we should either:
- Add a geocoding search to the CMS (type an address, auto-fill lat/lng)
- OR provide a simple guide: "Google the place name, right-click on Google Maps, click the coordinates to copy"

---

## 4. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Static HTML/CSS/JS (vanilla) or **Eleventy (11ty)** | Simple, fast, free. Eleventy reads the content files and generates static HTML |
| **Map** | Leaflet.js + OpenStreetMap tiles | Free, no API key, great mobile support |
| **CMS** | Decap CMS (formerly Netlify CMS) | Free, visual editor, git-based |
| **Hosting** | Netlify (free tier) | Auto-deploy from git, free SSL, Identity service |
| **Auth** | Netlify Identity | Free for 5 users, handles Isabel's login |
| **Domain** | Custom domain (optional) | e.g., `knowthescorenyc.com` — connect via Netlify DNS |
| **Fonts** | Google Fonts | Free — Pacifico + Inter |

### Recommended: Use Eleventy (11ty)

[Eleventy](https://www.11ty.dev/) is a dead-simple static site generator. It:
- Reads JSON/Markdown files from `/content/interviews/`
- Generates the HTML pages at build time
- Works perfectly with Decap CMS and Netlify
- No React, no build complexity — just templates + data

---

## 5. Seed Data — Existing Interviews + Locations

### From Google Maps List (9 places as of March 2026)

| Place | Type | Approx. Location |
|-------|------|-------------------|
| Franklin Furnace Archive, Inc. | Arts organization | Long Island City / Brooklyn |
| LeFrak Center at Lakeside | Ice skating rink | Prospect Park, Brooklyn |
| Union Square Park | Park | Union Square, Manhattan |
| Bethesda Terrace | Historical landmark | Central Park, Manhattan |
| Campos Community Garden | Community garden | East Village, Manhattan |
| Brooklyn Heights Promenade | Park | Brooklyn Heights, Brooklyn |
| Sogno Toscano Market & Wine Bar | Market / Wine bar | Chelsea, Manhattan |
| Gramercy Park | Park | Gramercy, Manhattan |
| Un Posto Italiano | Restaurant | Brooklyn |

### Published Interviews (from Substack archive)

| Date | Interviewee | Quote (Headline) | Substack URL |
|------|-------------|-------------------|--------------|
| Feb 17, 2026 | Eden Seiferheld | "Not to be dramatic, but I feel like the city has given me everything." | `knowthescorenyc.substack.com/p/not-to-be-dramatic-but-i-feel-like` |
| Jan 11, 2026 | Lulu Akingbade | "The city's given me more confidence, maturity and knowing how to handle myself." | `knowthescorenyc.substack.com/p/the-citys-given-me-more-confidence` |
| Dec 4, 2025 | Claire Akkan | "I want to be the kind of New Yorker who gives more than I get." | `knowthescorenyc.substack.com/p/i-want-to-be-the-kind-of-new-yorker` |
| Nov 14, 2025 | Barella Roberson | "The city itself is cold in a lot of ways. The people are soft." | `knowthescorenyc.substack.com/p/the-city-itself-is-cold-in-a-lot` |
| Oct 31, 2025 | Martha Wilson | "We go out four nights a week. Why not? We're in New York." | `knowthescorenyc.substack.com/p/we-go-out-four-nights-a-week-why` |
| Sep 18, 2025 | Robert Galinsky | "No matter when you show up, you should have been here 10 years ago." | `knowthescorenyc.substack.com/p/no-matter-when-you-show-up-you-should` |

> **Note:** There are likely more interviews in the archive. Isabel should populate the full list via the CMS once it's live. The Substack URLs above are estimated slugs — verify before seeding.

---

## 6. Deployment Plan

### Step-by-step

1. **Initialize git repo** in this directory
2. **Scaffold the Eleventy project** with the folder structure below
3. **Build the site** — templates, map, styling, CMS config
4. **Push to GitHub** (create repo `knowthescorenyc`)
5. **Connect to Netlify** — link the GitHub repo
6. **Enable Netlify Identity** — invite Isabel as a user
7. **Configure Decap CMS** — point to the GitHub repo
8. **Seed initial content** — add the interviews from the table above
9. **Test the admin flow** — log in, add an interview, verify it shows on the map
10. **Optional: Custom domain** — buy/connect `knowthescorenyc.com` or similar

### Folder Structure

```
knowthescorenyc/
├── .eleventy.js                 # Eleventy config
├── package.json
├── netlify.toml                 # Netlify build settings
├── src/
│   ├── _data/
│   │   └── interviews.json      # Can also use individual .md files
│   ├── _includes/
│   │   ├── base.njk             # Base HTML layout
│   │   ├── hero.njk             # Hero section partial
│   │   ├── map.njk              # Map section partial
│   │   ├── gallery.njk          # Interview cards partial
│   │   └── footer.njk           # Footer partial
│   ├── admin/
│   │   ├── index.html           # Decap CMS entry point
│   │   └── config.yml           # CMS collection schema
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css        # All styles
│   │   ├── js/
│   │   │   └── map.js           # Leaflet map initialization
│   │   └── images/
│   │       ├── logo.png         # The Know The Score NYC logo
│   │       └── apple-pin.png    # Red apple map pin icon
│   ├── content/
│   │   └── interviews/          # Individual interview .md files (CMS writes here)
│   │       ├── eden-seiferheld.md
│   │       ├── claire-akkan.md
│   │       └── ...
│   └── index.njk                # Home page template
└── README.md
```

---

## 7. Key Implementation Notes

### Map Implementation
```js
// Pseudocode for map.js
const map = L.map('map').setView([40.7580, -73.9855], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom apple pin icon
const appleIcon = L.icon({
  iconUrl: '/assets/images/apple-pin.png',
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40]
});

// Load interviews and add pins
interviews.forEach(interview => {
  L.marker([interview.lat, interview.lng], { icon: appleIcon })
    .addTo(map)
    .bindPopup(`
      <h3>${interview.name}</h3>
      <p class="quote">"${interview.quote}"</p>
      <p class="place">${interview.placeName}</p>
      <a href="${interview.substackUrl}" target="_blank">Read the full interview →</a>
    `);
});
```

### Decap CMS Config
```yaml
# src/admin/config.yml
backend:
  name: git-gateway
  branch: main

media_folder: "src/assets/images/uploads"
public_folder: "/assets/images/uploads"

collections:
  - name: "interviews"
    label: "Interviews"
    folder: "src/content/interviews"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Name", name: "name", widget: "string" }
      - { label: "Quote", name: "quote", widget: "string" }
      - { label: "Bio", name: "bio", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Substack URL", name: "substackUrl", widget: "string" }
      - { label: "Place Name", name: "placeName", widget: "string" }
      - { label: "Place Type", name: "placeType", widget: "string", required: false }
      - { label: "Latitude", name: "latitude", widget: "number", value_type: "float" }
      - { label: "Longitude", name: "longitude", widget: "number", value_type: "float" }
      - { label: "Neighborhood", name: "neighborhood", widget: "string", required: false }
      - { label: "Photo", name: "photo", widget: "image", required: false }
```

### Netlify Config
```toml
# netlify.toml
[build]
  command = "npx @11ty/eleventy"
  publish = "_site"

[build.environment]
  NODE_VERSION = "18"
```

---

## 8. Nice-to-Haves / Future Ideas

- **Filter pins by neighborhood** — dropdown or tags on the map
- **Search** — find interviews by person name or neighborhood
- **"Suggest a spot"** — form for visitors to submit their own favorite places
- **Instagram embed** — show Isabel's latest posts
- **Analytics** — Netlify Analytics or simple Plausible (privacy-friendly)
- **SEO** — Open Graph tags so the link looks great when shared on Instagram/Twitter
- **Custom domain** — `knowthescorenyc.com` or `map.knowthescorenyc.com`
- **Dark map style** — Use a custom tile layer like CartoDB Dark for a moodier NYC feel
- **Walking routes** — Connect interview spots into suggested walking tours by neighborhood

---

## 9. For Isabel — How It Works Day-to-Day

1. Publish your interview on Substack as usual
2. Open `yoursite.com/admin` and log in
3. Click "New Interview"
4. Fill in: name, quote, bio, place name, lat/lng, Substack link
5. Click Publish
6. Wait ~30 seconds for the site to rebuild
7. The new pin appears on the map automatically
8. Share the site link on Instagram!

---

*Built with love for Know The Score NYC. 🍎*
