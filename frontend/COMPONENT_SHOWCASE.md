# 🎨 Component Showcase - Women Self-Care Platform

## Color Palette Reference

### Primary Colors
```
Maroon:  #8B1538  ████  Deep maroon for headers & CTAs
Pink:    #E91E63  ████  Earthy pink for highlights
```

### Secondary Colors
```
Turmeric Yellow: #FACC15  ████  Icons & positive actions
Leaf Green:      #4CAF50  ████  Success states & wellness
Sky Blue:        #03A9F4  ████  Information & links
Orange:          #FF9800  ████  Warnings & alerts
```

### Neutral Colors
```
Off-white: #FDFBF7  ████  Background
Cream:     #FAF7F2  ████  Card backgrounds
Charcoal:  #3E3E3E  ████  Primary text
Brown:     #5D4E37  ████  Secondary text
```

## Typography Scale

```
Base Font Size: 16px
Line Height: 1.6

Headings:
H1: 3xl (30px) → 4xl (36px) on desktop
H2: 2xl (24px) → 3xl (30px) on desktop
H3: xl (20px) → 2xl (24px) on desktop
H4: lg (18px)
Body: base (16px)
Small: sm (14px)
Tiny: xs (12px)
```

## Button Variants

### Primary Button
```tsx
<Button className="btn-primary">
  Primary Action
</Button>
```
**Style**: Maroon background, white text, rounded-xl, shadow
**Use**: Main CTAs, important actions

### Secondary Button
```tsx
<Button className="btn-secondary">
  Secondary Action
</Button>
```
**Style**: Yellow background, dark text, rounded-xl, shadow
**Use**: Alternative actions, less emphasis

### Outline Button
```tsx
<Button className="btn-outline">
  Outline Action
</Button>
```
**Style**: Maroon border, maroon text, transparent background
**Use**: Cancel, less important actions

## Card Styles

### Standard Card
```tsx
<Card className="card-rural">
  <div className="p-6">
    Card Content
  </div>
</Card>
```
**Features**: White background, rounded-2xl, soft shadow, padding

### Gradient Card (Info)
```tsx
<Card className="bg-gradient-to-r from-primary-pink/10 to-primary-maroon/10 border-primary-pink/30">
  <div className="p-6">
    Important Info
  </div>
</Card>
```
**Use**: Highlighted information, appointments

### Gradient Card (Warning)
```tsx
<Card className="bg-gradient-to-r from-secondary-400/20 to-accent-orange/20 border-secondary-400/30">
  <div className="p-6">
    Action Needed
  </div>
</Card>
```
**Use**: Profile completion, pending tasks

## Badge Components

### Success Badge
```tsx
<span className="badge-success">
  Completed
</span>
```
**Style**: Green background, green text

### Warning Badge
```tsx
<span className="badge-warning">
  Pending
</span>
```
**Style**: Yellow background, yellow text

### Info Badge
```tsx
<span className="badge-info">
  New
</span>
```
**Style**: Blue background, blue text

## Icon Usage

### Size Reference
```tsx
<Icon className="h-4 w-4" />  // Small - 16px
<Icon className="h-5 w-5" />  // Medium - 20px
<Icon className="h-6 w-6" />  // Large - 24px
<Icon className="h-8 w-8" />  // XL - 32px
```

### Color Classes
```tsx
<Icon className="text-primary-maroon" />
<Icon className="text-primary-pink" />
<Icon className="text-accent-green" />
<Icon className="text-secondary-400" />
```

## Layout Patterns

### Section Header
```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold text-neutral-charcoal flex items-center gap-2">
    <Icon className="h-7 w-7 text-primary-maroon" />
    Section Title
  </h2>
  <button className="text-primary-maroon font-medium hover:underline">
    View All
  </button>
</div>
```

### Content Card with Icon
```tsx
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <div className="p-5">
    <div className="text-4xl mb-3">🎯</div>
    <h3 className="font-semibold text-neutral-charcoal mb-2">
      Card Title
    </h3>
    <p className="text-sm text-neutral-brown">
      Card description goes here
    </p>
  </div>
</Card>
```

### Info Row with Icon
```tsx
<div className="flex items-center gap-2 text-neutral-brown">
  <Icon className="h-5 w-5 text-primary-maroon" />
  <span>Information text</span>
</div>
```

## Animation Classes

### Slide Up on Load
```tsx
<div className="animate-slideUp">
  Content appears with slide up effect
</div>
```

### Fade In
```tsx
<div className="animate-fadeIn">
  Content fades in
</div>
```

### Pulse (for Live indicators)
```tsx
<span className="animate-pulse">
  LIVE
</span>
```

## Responsive Patterns

### Grid Layouts

**Mobile First:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>
```

**Breakdown:**
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 4 columns

### Flex Layouts

**Stack on Mobile, Row on Desktop:**
```tsx
<div className="flex flex-col md:flex-row items-center gap-4">
  {/* Content */}
</div>
```

### Hide/Show by Breakpoint

**Mobile Only:**
```tsx
<div className="lg:hidden">
  Mobile content
</div>
```

**Desktop Only:**
```tsx
<div className="hidden lg:block">
  Desktop content
</div>
```

## Form Elements

### Input Field
```tsx
<input 
  type="text"
  className="input-rural"
  placeholder="Enter text"
/>
```

### Textarea
```tsx
<textarea 
  className="input-rural resize-none"
  rows={4}
  placeholder="Enter description"
/>
```

### Select Dropdown
```tsx
<select className="input-rural">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## Special Components

### Progress Bar
```tsx
<div className="w-full bg-white rounded-full h-3 overflow-hidden">
  <div 
    className="bg-gradient-to-r from-secondary-400 to-accent-orange h-full transition-all duration-500"
    style={{ width: '65%' }}
  />
</div>
```

### Video Thumbnail
```tsx
<div className="aspect-video bg-gradient-to-r from-primary-maroon/20 to-primary-pink/20 relative">
  <div className="absolute inset-0 flex items-center justify-center">
    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
      <Video className="h-8 w-8 text-primary-maroon ml-1" />
    </button>
  </div>
</div>
```

### Notification Badge
```tsx
<button className="relative">
  <Bell className="h-6 w-6" />
  <span className="absolute -top-1 -right-1 bg-primary-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
    3
  </span>
</button>
```

## Spacing System

Tailwind spacing scale used:
```
0.5 = 2px
1   = 4px
2   = 8px
3   = 12px
4   = 16px
5   = 20px
6   = 24px
8   = 32px
10  = 40px
12  = 48px
```

### Common Padding
```tsx
className="p-4"   // 16px all sides
className="p-6"   // 24px all sides
className="px-4"  // 16px horizontal
className="py-3"  // 12px vertical
```

### Common Margins
```tsx
className="mb-4"  // 16px bottom
className="mb-6"  // 24px bottom
className="gap-4" // 16px gap in flex/grid
```

## Shadow System

```tsx
className="shadow-sm"    // Subtle shadow
className="shadow-soft"  // Custom soft shadow
className="shadow-card"  // Card shadow
className="shadow-lg"    // Large shadow on hover
```

## Common Component Combinations

### Icon Button
```tsx
<button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
  <Icon className="h-6 w-6 text-neutral-charcoal" />
</button>
```

### Button with Icon
```tsx
<Button className="btn-primary flex items-center justify-center gap-2">
  <Icon className="h-5 w-5" />
  Button Text
</Button>
```

### Section with Cards
```tsx
<div className="space-y-6">
  <h2 className="text-2xl font-bold">Section Title</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card>Card 1</Card>
    <Card>Card 2</Card>
  </div>
</div>
```

## Accessibility Features

### Minimum Touch Target
All interactive elements: `min-width: 44px`, `min-height: 44px`

### Focus States
All buttons and links have visible focus states

### ARIA Labels
```tsx
<button aria-label="Open menu">
  <Menu />
</button>
```

### Semantic HTML
Use proper heading hierarchy (h1 → h2 → h3)

## Best Practices

1. **Consistency**: Use predefined color classes
2. **Spacing**: Use Tailwind's spacing scale
3. **Responsive**: Mobile-first approach
4. **Accessibility**: Test with keyboard navigation
5. **Performance**: Avoid inline styles when possible
6. **Reusability**: Create components for repeated patterns

## Quick Reference

```tsx
// Primary CTA
<Button className="btn-primary">Action</Button>

// Card with content
<Card className="p-6">Content</Card>

// Icon with text
<div className="flex items-center gap-2">
  <Icon className="h-5 w-5 text-primary-maroon" />
  <span>Text</span>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items}
</div>

// Gradient background
<div className="bg-gradient-to-r from-primary-pink/10 to-primary-maroon/10">
  Content
</div>
```

---

This showcase provides all the building blocks needed to maintain design consistency throughout the application!
