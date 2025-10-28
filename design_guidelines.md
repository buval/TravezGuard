# Travez Travel App - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium travel platforms like Airbnb, Booking.com, and Google Travel to create an immersive, visually-rich experience that inspires wanderlust and simplifies trip planning.

**Key Design Principles**:
- Mobile-first, app-like interface optimized for touch interactions
- Visual storytelling through destination imagery
- Effortless navigation with clear information hierarchy
- Inspire exploration while maintaining functional clarity

## Typography System

**Font Family**: Inter (primary) via Google Fonts CDN for excellent mobile readability
- Display headlines: 600-700 weight
- Body text: 400 weight
- UI elements/buttons: 500-600 weight

**Type Scale**:
- Hero headlines: text-4xl to text-5xl (mobile) / text-6xl (desktop)
- Section titles: text-2xl to text-3xl
- Card titles: text-lg to text-xl
- Body text: text-base
- Small labels/metadata: text-sm
- Micro text (dates, tags): text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12 (mobile) / py-16 to py-20 (desktop)
- Card gaps: gap-4 to gap-6
- Margins: m-2, m-4, m-8

**Container Strategy**:
- Full-width sections with inner max-w-7xl for content
- Card grids: max-w-6xl
- Content reading: max-w-4xl

**Grid Patterns**:
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns for trip cards (md:grid-cols-2)
- Desktop: 3 columns for featured destinations (lg:grid-cols-3)

## Component Library

### Navigation
**Mobile Bottom Tab Bar**:
- Fixed bottom navigation with 4-5 primary icons (Home, Explore, Trips, Profile)
- Active state with icon fill and subtle indicator
- Safe area padding for modern mobile devices (pb-safe)

**Top Header Bar**:
- Minimal, translucent overlay on scrollable pages
- Left: Logo or back button
- Right: Search icon, user avatar/login button
- Height: h-16
- Sticky positioning with backdrop blur

### Home Page Components

**Hero Section** (viewport height: min-h-[60vh] on mobile, min-h-[70vh] on desktop):
- Full-bleed destination hero image with gradient overlay
- Centered headline and search CTA
- Search bar with rounded-full styling, elevated with shadow-lg
- Blur background for any buttons/search overlay (backdrop-blur-md)

**Featured Destinations Grid**:
- Card-based layout with 2-3 columns responsive
- Each card: Aspect ratio 3:2 or 4:3, rounded-2xl corners
- Overlay gradient on images for text legibility
- Destination name, country, brief tagline
- Hover: subtle scale transform (hover:scale-105 transition-transform)

**Popular Trips Section**:
- Horizontal scrollable carousel on mobile (snap-scroll)
- Grid on tablet/desktop
- Trip cards with destination image, duration, highlights
- Compact metadata (dates, number of activities)

### Trip Details Page

**Hero Image Banner**:
- Destination showcase image, aspect-[16/9] or full-width
- Rounded bottom corners (rounded-b-3xl) for modern app feel
- Overlaid trip metadata (dates, location) with blur background container

**Information Sections**:
- Segmented cards with rounded-2xl, p-6
- Icon + label pairs for quick facts (duration, activities, budget)
- Expandable "About Destination" with show more/less

**Action Buttons**:
- Primary CTA: Full-width on mobile, rounded-full, py-4, font-semibold
- Secondary actions in horizontal button group

### Itinerary Builder

**Timeline View**:
- Vertical timeline with connecting lines
- Day headers with date badges (rounded-full, px-4, py-2)
- Activity cards nested under each day
- Add activity button at each day segment

**Activity Cards**:
- Compact horizontal layout: Icon/image thumbnail + details
- Time, title, location in hierarchy
- Drag handle icon for reordering (touch-friendly hit area)
- Swipe actions for delete/edit on mobile

**Day-by-Day Tabs**:
- Pill-style tabs (rounded-full) for switching days
- Horizontal scroll container on mobile
- Active state with filled background

### Authentication Screens

**Guest Mode Indicator**:
- Subtle banner or modal prompt for sign-up benefits
- "Save your trips" CTA with icon
- Dismissible, non-intrusive

**Login/Signup Modal**:
- Centered modal overlay with backdrop blur
- Rounded-3xl container, max-w-md
- Social login buttons (Google, GitHub) with icons
- Email/password form fields with proper spacing (space-y-4)

## Interactive Elements

### Cards
**Destination Cards**:
- Image container with rounded-2xl, overflow-hidden
- Padding around content: p-4
- Shadow elevation: shadow-md, hover:shadow-xl
- Favorite/bookmark icon in top-right corner

**Trip Summary Cards**:
- Split layout: Image left (1/3 width) + content right (2/3)
- Or stacked on mobile: Image top, content bottom
- Status badges (upcoming, completed) with rounded-full

### Buttons
**Primary Actions**:
- Rounded-full for major CTAs
- py-3 px-6 for comfortable touch targets (min 44px height)
- Font weight: font-semibold
- Icon + text combinations where appropriate

**Icon Buttons**:
- Circular (rounded-full), w-10 h-10 minimum
- Centered flex layout for icon alignment
- Active states without hover effects (mobile-first)

### Form Inputs
**Search Bar**:
- Rounded-full with icon prefix
- Generous padding: py-3 px-6
- Placeholder text with helpful examples
- Clear button (X) when active

**Date Pickers & Selectors**:
- Native mobile inputs where possible
- Custom calendar with large touch targets
- Range selection with visual start/end indicators

## Images Strategy

**Required Images**:

1. **Home Page Hero**: Wide landscape shot of iconic travel destination (mountains, beaches, cityscape) - full viewport width, min-h-[60vh]

2. **Featured Destination Cards**: 6-9 high-quality destination images representing diverse locations (beaches, mountains, cities, cultural sites) - aspect ratio 3:2, rounded-2xl

3. **Trip Details Hero**: Destination-specific hero image matching the selected trip - aspect-[16/9], full-width

4. **Itinerary Activity Thumbnails**: Small square/circular thumbnails for activities (restaurants, landmarks, experiences) - 48x48px or 64x64px

5. **Popular Trips Carousel**: 4-6 trip preview images with varied destinations - aspect ratio 4:3, rounded-2xl

**Image Treatment**:
- All images with subtle gradient overlays for text legibility
- Use object-cover for consistent aspect ratios
- Lazy loading for performance
- Blur placeholder while loading

## Mobile-Specific Considerations

**Touch Targets**:
- Minimum 44x44px for all interactive elements
- Generous spacing between clickable items (gap-4 minimum)

**Gestures**:
- Horizontal swipe for carousels and day navigation
- Pull-to-refresh on main lists
- Swipe actions on itinerary items

**Safe Areas**:
- Bottom padding for tab bar and iOS home indicator
- Top padding for status bar and notch

**Loading States**:
- Skeleton screens matching final layout
- Shimmer effect on placeholder cards
- Inline spinners for action feedback

## Accessibility

- Semantic HTML throughout (nav, main, article, section)
- ARIA labels for icon-only buttons
- Focus indicators with visible outlines
- Touch target sizes meeting WCAG AA (44x44px minimum)
- Alt text for all destination and activity images
- Form labels always visible, not just placeholders

## Performance Optimizations

- Progressive image loading with blur-up technique
- Intersection Observer for lazy loading images
- Minimize animations to essential transitions only
- Use transform and opacity for smooth animations
- Preload critical destination images