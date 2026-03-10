# Taaza — Premium Arabic Fusion Restaurant Website

The official website for **Taaza**, a premium Arabic fusion restaurant located in Indore, India. The site delivers an immersive, luxury dining experience online — featuring a scroll-driven frame animation hero, an interactive full-menu modal, live table reservations via Firestore, and a refined design system built for high-end hospitality.

---

## Table of Contents

- [About the Restaurant](#about-the-restaurant)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Sections](#pages--sections)
- [Design System](#design-system)
- [External Integrations](#external-integrations)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## About the Restaurant

| | |
|---|---|
| **Name** | Taaza |
| **Cuisine** | Premium Arabic Fusion |
| **Location** | Shop No. LG-4, Exotica Lower Ground Floor, Shalimar Township, AB Road, Indore, MP 452010 |
| **Email** | reserve@taazaindore.in |
| **Hours** | Mon–Thu 12:00–22:30 · Fri–Sun 12:00–23:30 |
| **Delivery** | Available on Zomato and Swiggy |

Taaza ("fresh" in Arabic) blends ancient Levantine culinary traditions with contemporary technique, served in an atmosphere of understated luxury.

---

## Tech Stack

| Category | Package | Version |
|---|---|---|
| Framework | Next.js | 16.x |
| UI Library | React + React DOM | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 | ^4 |
| Animation | Framer Motion | ^12 |
| Backend / DB | Firebase (Firestore) | ^12 |
| Icons | Lucide React | ^0.577 |
| Image CDN | Cloudinary | — |

**Fonts** (loaded via `@font-face` in `globals.css`):
- **Cormorant Garamond** (300–700) — headlines, quotes, menu body
- **Cinzel** (400, 600) — labels, section markers, display caps
- **Inter** (300–600) — body text, UI copy, navigation

---

## Project Structure

```
taaza-web/
├── public/
│   └── social_media_and_delivery_partner/   # Zomato, Swiggy logos; social icons
├── scripts/
│   ├── upload-hero-slides.mts               # One-time: upload hero frames + save Firestore metadata
│   └── upload-all-frames.mts               # Bulk: upload all animation frames to Cloudinary
└── src/
    ├── app/
    │   ├── globals.css                      # Design tokens, font-faces, utility classes
    │   ├── layout.tsx                       # Root HTML layout (metadata, fonts)
    │   └── page.tsx                         # Single-page composition (all sections)
    ├── components/
    │   ├── PrimaryNavigation.tsx            # Fixed header with mobile drawer nav
    │   ├── ExplodedHero.tsx                 # Scroll-driven frame animation hero
    │   ├── ExperienceSection.tsx            # Bento grid with parallax images + story
    │   ├── MenuSection.tsx                  # Featured 6-item menu grid
    │   ├── MenuBookModal.tsx                # Animated 4-page full menu modal
    │   ├── TestimonialsSection.tsx          # Paginated 30-review carousel
    │   ├── ReservationSection.tsx           # Table booking form → Firestore
    │   └── SiteFooter.tsx                   # Footer with map, links, social icons
    └── lib/
        ├── cloudinary.ts                    # Server-side signed upload helper
        └── firebase.ts                      # Firestore singleton initializer
```

---

## Pages & Sections

The website is a **single-page application**. All sections live on one scrollable page and are composed in `src/app/page.tsx`.

### 1. Navigation — `PrimaryNavigation`

A fixed header that sits over every section.

- Logo wordmark ("TAAZA · Arabic Fusion") scrolls to top on click
- Desktop links: **Experience**, **Menu**, **Story**, **Reserve** — each smooth-scrolls to the corresponding section
- **"Book Table"** CTA button
- Mobile: hamburger icon opens a full-screen overlay drawer with a circular clip-path reveal animation
- Background transitions from transparent gradient to a solid frosted-glass blur once the user scrolls past 60 px

---

### 2. Hero — `ExplodedHero`

The signature feature of the site. A **300vh** scroll container that plays a frame-by-frame animation as the user scrolls.

- **4 slides**, each with 90–154 sequential PNG frames hosted on Cloudinary
- Frame URLs are constructed dynamically: `res.cloudinary.com/{cloud}/image/upload/f_auto,q_auto,w_1920/{folder}/ezgif-frame-{n}.png`
- Slide metadata (folder name, frame count, display text) is fetched from the Firestore `hero_slides` collection at runtime
- Frames are rendered on an HTML `<canvas>` for performance
- First 15 frames per slide preload immediately; remaining frames load in the background
- A full-screen loader with a progress bar (0–100%) is shown until enough frames are ready
- **Slides**: Taaza Burger · Taaza Cold Coffee · Kofta Al Aseel · Mezze Platter

---

### 3. Experience — `ExperienceSection`

An asymmetric **bento grid** that showcases the restaurant's atmosphere.

- Three high-quality images (interior, chef plating, terrace) with parallax scroll offsets
- Story copy: *"Born from ancient spice routes"*
- Floating pull-quote from Chef Ibrahim Al-Rashid
- Embedded 5-star testimonial card overlay
- Gold border rings, staggered entrance animations

---

### 4. Menu — `MenuSection` + `MenuBookModal`

**MenuSection** shows a grid of 6 featured items:

| Item | Category | Price |
|---|---|---|
| Al-Aseel Kofta | Grilled Mains | ₹680 |
| Mezze Royale | Sharing Starters | ₹520 |
| Shawarma Wreath | Wood-fire Rotisserie | ₹750 |
| Saffron Biryani | Rice & Grains | ₹620 |
| Labneh & Truffle Flatbread | From the Oven | ₹430 |
| Knafeh Soufflé | Sweet Finales | ₹380 |

Cards have colour-coded tags (Signature, For Two, Best Seller, etc.), asymmetric corner radiuses, and hover lift + shimmer effects.

**"View Full Menu"** opens **MenuBookModal** — a 4-page animated menu book:

| Page | Chapter |
|---|---|
| 1 | Starters & Soups |
| 2 | Signature Mains |
| 3 | Rice & From the Oven |
| 4 | Sweet Finales |

24+ items total. Prev/next navigation with dot indicators, spring-physics open/close animation, page slide transitions.

---

### 5. Testimonials — `TestimonialsSection`

A paginated carousel of **30 guest reviews** across 5 slides.

- Stats overlay: **200+ Five-Star Reviews** · **4.9 Average Rating** · **5 Years of Excellence** · **40+ Menu Creations**
- 3–6 cards per slide (responsive)
- Each card: 5-star rating, quote, author name, initials avatar, asymmetric border-radius
- Arrow + dot navigation; direction-aware slide enter/exit animation

---

### 6. Reservation — `ReservationSection`

A two-column table booking form that writes directly to Firestore.

**Left panel**: Opening hours, address, phone, email, and a Chef's pull-quote.

**Right panel — form fields**:

| Field | Notes |
|---|---|
| Name | Required |
| Email | Required, validated |
| Phone | Required |
| Date | Constrained to today → +7 days |
| Time | Free text |
| Guests | Dropdown: 2–8+ |
| Occasion | Anniversary, Birthday, Business Lunch, Date Night, + more |
| Notes | Optional textarea |

On submit, a document is written to the Firestore `reservation` collection with `status: "pending"` and a server timestamp. The form shows an inline success state and a "Make Another Reservation" reset button.

---

### 7. Footer — `SiteFooter`

- Brand block: address, phone, email
- Navigation columns: **Discover** · **Experience** · **Connect**
- **Order Online**: Zomato and Swiggy direct links
- Embedded Google Maps iframe (Taaza Indore location)
- Social icons: Instagram, Zomato, Swiggy
- Bottom bar: copyright, tagline *"Crafted with passion. Served with love."*

---

## Design System

Defined in `src/app/globals.css` as CSS custom properties.

### Colour Tokens

| Token | Value | Usage |
|---|---|---|
| `--gold` | `#C9A84C` | Primary accent (borders, CTAs, highlights) |
| `--gold-light` | `#E8C97A` | Hover states, labels |
| `--gold-dark` | `#8B6914` | Pressed states |
| `--dark-obsidian` | `#05040A` | Page background |
| `--dark-mid` | `#0C0B14` | Card backgrounds |
| `--text-primary` | `#F5F0E8` | Main body text |

### Utility Classes

| Class | Effect |
|---|---|
| `.glass-surface` | 75% dark glass + 12 px backdrop blur + 180% saturation |
| `.gold-rule` | 4 rem gold gradient horizontal divider |
| `.flourish` | Italic serif in gold — used for decorative sub-labels |
| `.btn-gold-outline` | Gold bordered button; animated fill on hover |
| `.headline-xl/lg/md` | Responsive fluid headline scale with `clamp()` |

### Visual Effects

- **Grain overlay**: Fixed SVG fractal noise at 3.5% opacity for film-grain texture
- **Scanline overlay**: Repeating 4 px bands at 3% opacity
- **Parallax**: Hero images use `useTransform()` with scroll progress
- **Asymmetric corners**: Border-radius combinations like `2rem 0.5rem` for organic card shapes
- **Corner glows**: Radial gold gradients at 8–13% opacity

---

## External Integrations

### Cloudinary

Used for hosting and serving all hero animation frames and restaurant photography.

- Cloud name: `dpvab3v9f`
- Frame URL pattern: `https://res.cloudinary.com/dpvab3v9f/image/upload/f_auto,q_auto,w_1920/{folder}/ezgif-frame-{padded}.{ext}`
- `f_auto`: auto-selects AVIF or WebP per browser
- `q_auto`: optimal quality/size balance
- The `src/lib/cloudinary.ts` helper provides a **server-side** signed upload function used by the migration scripts

### Firebase / Firestore

Used for two real-time data operations:

| Collection | Written by | Read by | Purpose |
|---|---|---|---|
| `hero_slides` | Migration scripts | `ExplodedHero` | Frame animation config per slide |
| `reservation` | `ReservationSection` form | Admin / back-office | Guest table booking records |

`hero_slides` documents contain: `cloudinaryFolder`, `totalFrames`, `firstFrame`, `ext`, `fit`, `order`.

`reservation` documents contain: `name`, `email`, `phone`, `date`, `time`, `guests`, `occasion`, `notes`, `status`, `createdAt`.

---

## Environment Variables

Create a `.env.local` file in the `taaza-web/` directory:

```env
# Cloudinary — used by migration scripts (server-side only)
CLOUDINARY_CLOUD_NAME=dpvab3v9f
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# Firebase — used by the browser client
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-project>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
```

> **Note**: `NEXT_PUBLIC_` variables are exposed to the browser. Do **not** expose `CLOUDINARY_API_KEY` or `CLOUDINARY_API_SECRET` client-side.

---

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

```bash
# Type-check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
npm start
```

---

## Scripts

These are one-time data migration scripts in `scripts/`. They require all Cloudinary and Firebase environment variables to be set.

### `upload-hero-slides.mts`

Uploads one representative frame per slide to Cloudinary and writes the corresponding metadata document to Firestore `hero_slides`.

```bash
npx tsx scripts/upload-hero-slides.mts
```

Run this once when setting up a new environment to populate the Firestore documents that the hero animation reads.

### `upload-all-frames.mts`

Uploads every animation frame from local `public/` sub-folders to Cloudinary in batches of 5.

```bash
npx tsx scripts/upload-all-frames.mts
```

| Slide | Frames | Cloudinary folder |
|---|---|---|
| food-1 | 4–93 (90 frames) | `taaza/frames/food-1` |
| food-2 | 1–127 (127 frames) | `taaza/frames/food-2` |
| food-3 | 1–129 (129 frames) | `taaza/frames/food-3` |
| drink-1 | 1–154 (154 frames) | `taaza/frames/drink-1` |

The script skips frames that already exist on Cloudinary (idempotent), retries up to 3 times on failure, and writes the final metadata to Firestore after each slide completes.

---

## Deployment

The project is configured for **Vercel** via `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

**Steps**:

1. Push the repository to GitHub / GitLab.
2. Import the project in the [Vercel dashboard](https://vercel.com/new).
3. Add all environment variables from the [Environment Variables](#environment-variables) section in the Vercel project settings.
4. Deploy. Vercel will run `npm install` then `npm run build` automatically on every push to the main branch.

> Next.js image optimization is pre-configured to accept remote images from `res.cloudinary.com` (see `next.config.ts`). No additional configuration is required for production image delivery.
