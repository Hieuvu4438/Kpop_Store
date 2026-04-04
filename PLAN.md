# Implementation Plan: K-Pop Digital Music Store (v2 — Revised)

## Requirements Restatement

Build a **static K-Pop digital music storefront** (no backend) using HTML, CSS, **Bootstrap 5 (CDN, mandatory)**, and Vanilla JS. The visual style follows the **Editorial + Bento Box + Soft Neo-Brutalism** aesthetic from `sample_style.jpg` / `STYLE_DESIGN.md` — cream background, black accents, pill buttons, thin borders, large typography, no shadows. All data lives in a static `products.json`. Cart uses `localStorage`. Payment is a hardcoded QR code with fake 5-second verification. Includes a static chat widget and Google Maps embed.

**Hard constraints:** Bootstrap CDN required. No JS frameworks, no backend, no database, no server-side code, no APIs, no third-party JS libraries. Static hosting (GitHub Pages, Vercel). Simple enough for teammates to maintain.

---

## What Changed vs. v1

| Aspect | v1 (Old) | v2 (New) |
|--------|----------|----------|
| **CSS Framework** | Pure custom CSS | **Bootstrap 5 CDN (mandatory)** |
| **Color Scheme** | Dark (#0D0D0D) + neon pink/purple | **Cream (#F5F1E8) + ink black (#111)** |
| **Style** | Neon K-Pop glow, drop shadows | **Editorial + Bento Box + Soft Neo-Brutalism** |
| **Typography** | Bebas Neue + Inter (sans-serif) | **Display/Serif heading + geometric sans body** |
| **Cards** | Shadow + glow on hover | **1px black borders, no shadows, large border-radius** |
| **Buttons** | Solid pink buttons | **Pill-shaped (outline & filled, black/white)** |
| **Grid** | CSS Grid (custom only) | **Bootstrap grid + CSS Grid for bento** |
| **Layout** | Standard vertical flow | **Bento Box multi-size grid** |
| **Card Layout** | Simple card (image + title + price + icon button) | **Full card: image, badge, artist, title, price, quantity selector, Add to Cart button** (from `image.png` reference) |

---

## Design System (from STYLE_DESIGN.md + sample_style.jpg)

### Color Palette
- **Background (main):** Cream/Off-white `#F5F1E8` — NEVER pure white `#FFFFFF`
- **Foreground (text, borders, blocks):** Ink black `#111111`
- **Accent/Highlight:** Pure white `#FFFFFF` for tags/pills on dark elements
- **Subtle gray:** For secondary text, dividers

### Typography
- **Heading font:** Display serif or slab-serif — large, uppercase, editorial feel
  - Options: DM Serif Display, Playfair Display, or similar (Google Fonts)
  - Note from STYLE_DESIGN.md: "Font nay khong phai san-serif"
- **Body font:** Geometric sans-serif — Inter, DM Sans, or Satoshi
  - Small size, wide letter-spacing for elegance
- **Graphic typography:** Pill-shaped borders wrapping keywords in headings (e.g. `( LIFE )`)

### Layout Rules
- **Bento Box grid** using CSS Grid + Bootstrap grid
- **Border-radius:** `24px`-`32px` for boxes, `9999px` for pills/tags
- **Borders:** Thin 1px black (`border: 1px solid #111`) everywhere — primary depth tool
- **Shadows:** Almost NONE — depth via borders and color contrast only
- **Spacing:** Uniform gap between bento boxes, generous inner padding ("breathing room")

### Components
- **Pill Buttons:** Two variants — Outline (cream bg, 1px black border) & Filled (black bg, white text)
- **Thin Borders:** 1px black dividers/separators everywhere
- **Floating Tags:** Rotated pill labels for visual interest
- **Imagery:** Desaturated, low-key tones, masked into rounded containers

---

## Product Card Layout (from image.png reference)

The product card follows the layout structure shown in `image.png`, but styled in our Editorial/Bento/Neo-Brutalism theme (NOT the pink/white style from the image):

```
+----------------------------------+
|  [Album Cover Image]             |
|    [Badge: "Album" / "Single"]   |
|                                  |
+----------------------------------+
|  Artist Name                     |
|  Album/Song Title                |
|  Price (VND)                     |
|                                  |
|  [ - ]  [ qty ]  [ + ]          |
|  [    Add to Cart    ]           |
+----------------------------------+
```

**Key elements:**
1. **Cover image** with category/type badge overlay (top-left)
2. **Artist name** (small, uppercase, muted)
3. **Title** (bold, prominent)
4. **Price** displayed clearly
5. **Quantity selector** — minus / number / plus buttons in a row
6. **"Add to Cart" button** — full-width pill button

**Important:** Only the LAYOUT is borrowed from `image.png`. The STYLE (colors, borders, fonts, radius) follows our cream/black Editorial theme.

---

## Project Structure

```
bootstrap-commercial/
├── index.html              # Trang chu — Hero bento + Product grid
├── product.html            # Trang chi tiet san pham
├── cart.html               # Trang gio hang
├── checkout.html           # Trang thanh toan QR
├── success.html            # Trang thanh cong + download/player
├── css/
│   ├── style.css           # Theme override on top of Bootstrap
│   ├── components.css      # Custom components (cards, pills, toast, chat, player)
│   └── responsive.css      # Bento-specific responsive tweaks
├── js/
│   ├── products.js         # Fetch & render products, filter/search
│   ├── cart.js             # localStorage cart CRUD, badge update, quantity
│   ├── checkout.js         # QR display, fake verification, unlock flow
│   ├── chat.js             # Chat widget logic
│   └── player.js           # Audio player for purchased songs
├── data/
│   └── products.json       # Static product catalog
├── assets/
│   ├── images/             # Album covers, QR code, logo, icons, favicon
│   └── audio/              # Sample audio clips (preview)
├── BUSINESS_CASE.md
├── GUIDELINE.md
├── STYLE_DESIGN.md
├── sample_style.jpg
├── image.png
└── PLAN.md
```

---

## Implementation Phases

### Phase 1: Foundation Rewrite
**Complexity: MEDIUM | Rewrite: `css/style.css`, all HTML `<head>` sections**

1. Add **Bootstrap 5 CSS + JS CDN** to all HTML pages
2. Replace Google Fonts import: DM Serif Display (heading) + Inter (body)
3. Rewrite CSS variables:
   - `--bg-cream: #F5F1E8`, `--ink: #111111`, `--white: #FFFFFF`
   - `--radius-box: 24px`, `--radius-pill: 9999px`
   - `--border: 1px solid #111111`
   - `--font-heading`, `--font-body`
4. Reset overrides: kill Bootstrap's default shadows, set cream bg on body
5. Restyle **header** as Bootstrap `navbar` with pill-shaped nav links
6. Restyle **footer** — thin top border, cream/black, Bootstrap grid

**Deliverable:** All pages share new cream/black shell with Bootstrap loaded.

---

### Phase 2: Component Restyling
**Complexity: MEDIUM | Rewrite: `css/components.css`, `css/responsive.css`**

1. **Product cards** — cream bg, 1px black border, `border-radius: 24px`, NO shadow. Full layout from `image.png`: cover + badge + artist + title + price + quantity selector + Add to Cart pill
2. **Pill buttons/tags** — `border-radius: 9999px`. Outline variant (1px black border, cream bg) + Filled variant (black bg, white text)
3. **Toast notifications** — cream bg, 1px black border, black text
4. **Chat widget** — cream/black theme, pill-shaped input, thin borders
5. **Cart items** — thin bordered rows, clean layout
6. **QR section** — bordered bento box, clean typography
7. **Audio player** — minimal, thin borders, cream bg
8. **Responsive** — Bootstrap handles breakpoints; add bento column collapse rules

**Deliverable:** All components restyled to match Editorial/Bento aesthetic.

---

### Phase 3: Homepage Bento Layout
**Complexity: MEDIUM | Rewrite: `index.html`, `js/products.js`**

1. **Hero section** — large editorial heading (serif, uppercase), pill-wrapped keyword, floating rotated tags, stats bento boxes (like sample_style.jpg)
2. **Filter bar** — pill-shaped filter buttons (outline = inactive, filled = active)
3. **Product grid** — Bootstrap `row`/`col` with bento-size cards. Cards use the `image.png` layout (cover, badge, artist, title, price, qty selector, add-to-cart)
4. **Map section** — bento box with large border-radius, thin border
5. Update `js/products.js` to generate new card markup with quantity selector
6. Update `js/cart.js` to support quantity (addToCart increments qty, not duplicates)

**Deliverable:** Homepage fully matches Editorial/Bento style with new card layout.

---

### Phase 4: Inner Pages Restyle
**Complexity: MEDIUM | Rewrite: `product.html`, `cart.html`, `checkout.html`, `success.html`**

1. **Product detail** (`product.html`) — Bootstrap 2-column grid, editorial typography, pill format tags, large cover in bordered box
2. **Cart** (`cart.html`) — table/list layout with qty adjustment (- / qty / +), cream/black theme, bordered summary box
3. **Checkout** (`checkout.html`) — QR in bento box, order summary, pill confirm button
4. **Success** (`success.html`) — download items in bordered rows, player widgets in cream/black style
5. All pages: consistent navbar + footer

**Deliverable:** All inner pages match the theme.

---

### Phase 5: Polish & Finishing
**Complexity: LOW | All files**

1. Ensure ~92% match with `sample_style.jpg` aesthetic
2. Floating/rotated pill tags for visual interest
3. Uniform spacing/gaps across all bento boxes
4. Loading states, empty states styled in theme
5. Favicon update (cream/black), meta tags
6. Verify all Bootstrap + custom CSS plays well together
7. Test on mobile — bento collapses cleanly

**Deliverable:** Production-ready static site.

---

## Dependencies Between Phases

```
Phase 1 (Foundation Rewrite)
  └── Phase 2 (Component Restyling)
        └── Phase 3 (Homepage Bento + New Cards)
              └── Phase 4 (Inner Pages Restyle)
                    └── Phase 5 (Polish)
```

All phases are sequential since each builds on the previous theme/component work.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bootstrap defaults clash with editorial style | MEDIUM | Override aggressively in `style.css` — kill shadows, change radius, recolor |
| Display serif fonts may render poorly at small sizes | LOW | Use serif for headings only, sans for body |
| Bento layout complex on mobile | MEDIUM | Collapse to single column via Bootstrap breakpoints |
| Quantity selector adds cart complexity | LOW | Small change to `cart.js` — store qty per item |
| Rewriting all files is destructive | LOW | Current code is v1 prototype — full rewrite is expected |

---

## JS Logic Changes (minimal)

The business logic in JS stays the same. Only changes:
- **`cart.js`**: Add quantity support — `addToCart` increments qty if item exists, new `updateQuantity(id, delta)` function
- **`products.js`**: New card HTML template with qty selector and Bootstrap classes
- **`chat.js`**: No logic change, just re-inject with new styles
- **`checkout.js`**: No logic change
- **`player.js`**: No logic change

---

## Summary

| Phase | Complexity | Key Output |
|-------|-----------|------------|
| 1. Foundation Rewrite | MEDIUM | Bootstrap CDN + cream/black theme shell |
| 2. Component Restyling | MEDIUM | All components in Editorial/Neo-Brutalism style |
| 3. Homepage Bento + Cards | MEDIUM | Bento hero + product grid with image.png card layout |
| 4. Inner Pages Restyle | MEDIUM | Product detail, cart (with qty), checkout, success |
| 5. Polish & Finishing | LOW | ~92% match with sample, responsive, meta |
