# Design Tokens — Loyalty & Rewards App

Minimal white/black/gray theme. Elegant, clean, no clutter.

![Color Palette](./color_palette_1771756073594.png)

---

## Color System

### Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-white` | `#FFFFFF` | Main app background |
| `bg-off-white` | `#FAFAFA` | Page-level background |
| `bg-surface` | `#F5F5F5` | Cards, panels, modals |
| `bg-subtle` | `#EEEEEE` | Hover states on list rows, zebra stripes |

### Borders & Dividers

| Token | Hex | Usage |
|-------|-----|-------|
| `border-light` | `#E5E5E5` | Default card/input borders |
| `border-mid` | `#D4D4D4` | Table dividers, stronger separators |
| `border-strong` | `#A3A3A3` | Focus rings, emphasized borders |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#111111` | Headings, labels, all important text |
| `text-secondary` | `#525252` | Subtext, descriptions, captions |
| `text-muted` | `#A3A3A3` | Placeholders, disabled labels |
| `text-disabled` | `#D4D4D4` | Truly inactive elements |

### Action Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `action-primary` | `#111111` | Primary buttons, active nav items |
| `action-primary-hover` | `#333333` | Hover state on primary buttons |
| `action-destructive` | `#DC2626` | Delete, deactivate, error state |
| `action-success` | `#16A34A` | Success badges, confirmation messages |
| `action-warning` | `#D97706` | Low stock alerts, warnings |

### Overlays

| Token | Value | Usage |
|-------|-------|-------|
| `overlay-dark` | `rgba(0,0,0,0.50)` | Modal backdrop |
| `overlay-light` | `rgba(0,0,0,0.08)` | Hover overlay on image cards |

---

## Typography

**Font family:** `Inter` (Google Fonts) — clean, modern, legible on both 24" and 15.6" displays.

| Scale | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | `12px` | 400 | Timestamps, fine print |
| `text-sm` | `14px` | 400 | Table data, form labels |
| `text-base` | `16px` | 400 | Body text, descriptions |
| `text-lg` | `18px` | 500 | Card titles, section headers |
| `text-xl` | `20px` | 600 | Page sub-headers |
| `text-2xl` | `24px` | 700 | Page titles |
| `text-4xl` | `36px` | 800 | Customer points display (kiosk) |
| `text-6xl` | `60px` | 900 | Hero points balance on customer screen |

---

## Spacing & Radius

Using Tailwind defaults — no changes needed. Key conventions:

| Usage | Value |
|-------|-------|
| Card padding | `p-6` (24px) |
| Section gap | `gap-6` (24px) |
| Inline gap | `gap-3` (12px) |
| Card border-radius | `rounded-xl` (12px) |
| Button border-radius | `rounded-lg` (8px) |
| Input border-radius | `rounded-md` (6px) |
| Badge border-radius | `rounded-full` |

---

## Shadows

```css
/* Soft card shadow — default */
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);

/* Card hover shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06);

/* Modal shadow */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.20);
```

In Tailwind: use `shadow-sm` (default cards), `shadow-md` (hover), `shadow-xl` (modals).

---

## Tailwind Config

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{vue,js}', './electron/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-surface': '#F5F5F5',
        'bg-subtle': '#EEEEEE',
        // Borders
        'border-light': '#E5E5E5',
        'border-mid': '#D4D4D4',
        'border-strong': '#A3A3A3',
        // Text
        'text-primary': '#111111',
        'text-secondary': '#525252',
        'text-muted': '#A3A3A3',
        // Actions
        'action-primary': '#111111',
        'action-destructive': '#DC2626',
        'action-success': '#16A34A',
        'action-warning': '#D97706',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'modal': '0 20px 60px rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
}
```

---

## Component Patterns

### Primary Button
```
bg: #111111  |  text: #FFFFFF  |  hover bg: #333333
rounded-lg  |  px-5 py-2.5  |  font-medium text-sm
```

### Secondary / Ghost Button
```
bg: transparent  |  text: #111111  |  border: #E5E5E5
hover bg: #F5F5F5  |  rounded-lg  |  px-5 py-2.5
```

### Danger Button
```
bg: #DC2626  |  text: #FFFFFF  |  hover bg: #B91C1C
```

### Card
```
bg: #FFFFFF  |  border: 1px #E5E5E5  |  rounded-xl
shadow-card  |  hover: shadow-card-hover  |  p-6
```

### Input Field
```
bg: #FFFFFF  |  border: 1px #D4D4D4  |  rounded-md
focus border: #111111  |  px-3 py-2  |  text-sm
placeholder: #A3A3A3
```

### Status Badges
```
Active:   bg #F0FDF4  text #16A34A  (green tint)
Inactive: bg #F5F5F5  text #525252  (gray)
Warning:  bg #FFFBEB  text #D97706  (amber tint)
Error:    bg #FEF2F2  text #DC2626  (red tint)
```
