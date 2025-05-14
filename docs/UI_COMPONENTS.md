# 5PT Finance UI Component System

This document outlines the UI component system used in the 5PT Finance application, providing guidelines on when to use each component and their hierarchy.

## Card Components

### PremiumCard
`components/ui/premium-card.tsx`

**Purpose:** Primary card component for dashboard elements with advanced visual effects.

**When to use:**
- For main dashboard cards that need hover effects
- When you need variant styling (primary, secondary, accent)
- For cards that benefit from interactive elements

**Props:**
- `variant`: 'primary' | 'secondary' | 'accent' | 'dark'
- `hoverEffect`: boolean
- `borderGlow`: boolean
- `innerGlow`: boolean

**Example:**
\`\`\`tsx
<PremiumCard variant="primary" hoverEffect={true} borderGlow={true}>
  <StatDisplay
    title="Total Balance"
    value={<AnimatedValue value={balance} formatFn={formatCrypto} />}
    icon={<Wallet />}
  />
</PremiumCard>
\`\`\`

### CyberCard
`components/ui/cyber-card.tsx`

**Purpose:** Specialized card with cyberpunk aesthetic for specific UI elements.

**When to use:**
- For elements that need a distinct cyberpunk style
- When you need scan line effects
- For panels with angular clip paths

**Props:**
- `variant`: 'default' | 'panel' | 'stat'
- `glowing`: boolean
- `scanline`: boolean

### ContentCard
`components/ui/content-card.tsx`

**Purpose:** Simple animated card for content sections.

**When to use:**
- For content sections on landing pages
- When you need simple entrance animations
- For less prominent UI elements

### GlowCard
`components/ui/glow-card.tsx`

**DEPRECATED:** Use PremiumCard instead.

## Button Components

### CyberButton
`components/ui/cyber-button.tsx`

**Purpose:** Primary button with cyberpunk aesthetic.

**When to use:**
- For primary actions
- When you need a distinctive button style
- For call-to-action buttons

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `glitch`: boolean

### Button (shadcn)
`components/ui/button.tsx`

**Purpose:** Standard button component from shadcn/ui.

**When to use:**
- For secondary or tertiary actions
- When you need a more subtle button
- For form submissions

## Display Components

### StatDisplay
`components/ui/stat-display.tsx`

**Purpose:** Display statistics with icons and trends.

**When to use:**
- For displaying key metrics
- When you need to show trends
- For dashboard KPIs

### AnimatedValue
`components/ui/animated-value.tsx`

**Purpose:** Animate changing numeric values.

**When to use:**
- For numbers that change and should animate
- When you want to draw attention to a changing value
- For counters and statistics

## Layout Components

### GradientBorder
`components/ui/gradient-border.tsx`

**Purpose:** Container with gradient border effect.

**When to use:**
- For section containers that need visual separation
- When you want to highlight a section
- For grouping related premium cards

## Component Hierarchy

1. **Container Components**
   - GradientBorder (highest level)
   - PremiumCard
   - CyberCard
   - ContentCard

2. **Interactive Components**
   - CyberButton (primary)
   - Button (secondary)

3. **Display Components**
   - StatDisplay
   - AnimatedValue
   - AnimatedCounter

## Migration Plan

We are standardizing on the following components:

1. **Cards:** PremiumCard is the preferred card component
2. **Buttons:** CyberButton for primary actions, Button for secondary actions
3. **Stats:** StatDisplay with AnimatedValue for metrics

Legacy components will be gradually phased out.
\`\`\`

### 2. Standardize UI Components

Let's create a consolidated card component that merges the functionality of our various card components:
