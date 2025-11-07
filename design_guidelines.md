# SmartAssist.ai Design Guidelines

## Design Approach

**System:** Modern SaaS hybrid inspired by Linear's clarity + Notion's approachability + Apple HIG's simplicity

**Rationale:** SmartAssist.ai is a utility-focused diagnostic platform requiring clear information hierarchy, intuitive troubleshooting flows, and trust-building design. Users need efficiency and clarity when dealing with appliance issues.

## Typography

**Font Families:**
- Primary: Inter (all weights via Google Fonts)
- Monospace: JetBrains Mono (for error codes, model numbers)

**Hierarchy:**
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles: text-xl, font-semibold
- Body Text: text-base, font-normal
- Captions/Meta: text-sm, font-medium
- Error Codes: text-sm, font-mono

## Layout System

**Spacing Scale:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Tight spacing: gap-2, p-4
- Standard: gap-4, p-6, p-8
- Generous: gap-8, p-12, p-16
- Section separation: py-20, py-24

**Grid System:**
- Desktop: max-w-7xl container with 12-column grid
- Cards/Items: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard: Two-column layout (sidebar + main content)

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with backdrop-blur effect
- Logo left, main nav center, user profile/CTA right
- Height: h-16
- Padding: px-6

**Sidebar (Dashboard):**
- Fixed left sidebar, w-64
- Collapsible on mobile
- Navigation items with icons (Heroicons)
- Active state with subtle background accent

### Cards & Containers

**Device Cards:**
- Rounded corners: rounded-xl
- Border: border with subtle shadow
- Padding: p-6
- Hover: subtle lift with shadow-lg transition
- Layout: Image/icon top, title, meta info, action button

**Diagnostic Result Cards:**
- Two-part layout: Problem summary + Solution steps
- Step numbers in circles with connecting lines
- Expandable sections for detailed information
- Status indicators (success, warning, error)

**Chat Interface:**
- Full-height container with fixed input at bottom
- Messages: max-w-2xl, alternating alignment (user right, AI left)
- AI messages: subtle background, rounded-2xl
- User messages: primary accent, rounded-2xl
- Avatar icons for both

### Forms & Inputs

**Input Fields:**
- Height: h-12
- Rounded: rounded-lg
- Border: border-2 with focus ring
- Padding: px-4
- Labels: text-sm, font-medium, mb-2

**Upload Areas:**
- Dashed border: border-2 border-dashed
- Large drop zone: min-h-48
- Center-aligned icon + text
- Drag-over state with background change

**Buttons:**
- Primary CTA: px-6 py-3, rounded-lg, font-semibold
- Secondary: outline style with border-2
- Icon buttons: p-2, rounded-full for actions
- Loading states with spinner

### Technician Cards
- Horizontal layout on desktop (photo left, info center, booking right)
- Vertical stack on mobile
- Rating stars with count
- Availability badge (green = available, yellow = limited)
- Service tags as pills: px-3 py-1, rounded-full, text-xs

### Dashboard Widgets
- Stat cards: Large number display with icon, trend indicator
- Recent activity timeline with icons and timestamps
- Quick action buttons grid: 2x2 on mobile, 4 columns on desktop

### Modals & Overlays
- Centered: max-w-2xl
- Backdrop: backdrop-blur-sm with dark overlay
- Content padding: p-8
- Close button: top-right, p-2

## Page Layouts

### Landing Page
**Hero Section:**
- Full-width with gradient background treatment
- Large hero image showing app interface mockup on devices
- Height: min-h-screen with centered content
- Headline + subheadline + dual CTA (primary + secondary)
- Trust indicators below CTAs (user count, rating)

**Features Grid:**
- 3-column grid on desktop
- Icon-driven cards with title, description
- Alternating layout for feature showcase sections (image left/right)

**How It Works:**
- 3-4 step process with large numbered circles
- Visual flow with connecting lines or arrows
- Screenshots/illustrations for each step

**Social Proof:**
- Testimonials in 2-column grid
- Customer photos, company logos
- Star ratings prominently displayed

**Technician Network Section:**
- Grid of sample technician cards
- "Join as a Technician" CTA

**Footer:**
- 4-column layout: About, Product, Resources, Legal
- Newsletter signup form
- Social media icons
- Trust badges (security, payment methods)

### Dashboard (Post-Login)
**Layout:**
- Left sidebar navigation (w-64)
- Main content area with top bar
- Grid of device cards or diagnostic history
- Quick stats row at top: 3-4 metric cards

### Chat/Diagnostic Flow
**Single-column focus:**
- max-w-3xl centered
- Chat messages scroll area
- Fixed input at bottom with image upload option
- Progress indicator if multi-step diagnosis

### Device Library
**Grid view default:**
- 3-column card grid
- Filter sidebar (collapsible)
- Search bar at top
- Add device button (prominent, floating action)

### Technician Booking
**Two-step flow:**
1. Search/Filter: Map view or list view toggle, filter chips
2. Details + Schedule: Selected technician card, calendar picker, time slots

## Images

**Hero Image:** 
- Large, high-quality mockup showing the app interface on multiple devices (phone, tablet, desktop)
- Placement: Right side of hero section (60% width on desktop)
- Style: Modern, clean device mockups with subtle shadows

**Feature Section Images:**
- Screenshot of chat interface showing AI conversation
- Visual diagnostic example (phone camera capturing appliance with overlay)
- Dashboard view showing device library
- Technician profile/booking interface
- Placement: Alternating left/right alongside feature descriptions

**Device Library Placeholder:**
- Generic appliance icons/illustrations when no photo uploaded
- Consistent illustration style across all device types

**Technician Photos:**
- Professional headshots, circular crop
- Consistent sizing: w-16 h-16 on cards, w-24 h-24 on detail view

## Animations

Use sparingly:
- Card hover: subtle scale and shadow transition (200ms)
- Page transitions: fade-in for route changes
- Chat messages: slide-in from bottom
- Loading states: subtle pulse on skeleton screens
- NO scroll-triggered animations

## Accessibility

- All interactive elements: min touch target 44x44px
- Form inputs: Proper labels, error states with icons and text
- Color contrast: Ensure WCAG AA compliance
- Focus indicators: Visible ring on all focusable elements
- Icons: Always paired with text or proper aria-labels