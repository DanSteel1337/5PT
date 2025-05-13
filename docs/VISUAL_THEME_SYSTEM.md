# 5PT Investment DApp Visual Theme System

This document outlines the visual theme system used throughout the 5PT Investment DApp to ensure consistent styling and user experience.

## Core Components

### SectionContainer

The `SectionContainer` component provides a standardized wrapper for all major sections of the application. It includes:

- Consistent padding and spacing
- Standardized background gradient
- Animated section titles with consistent styling
- Decorative background elements

\`\`\`jsx
<SectionContainer
  id="section-id"
  title="SECTION TITLE"
  subtitle="Optional section subtitle text"
>
  {/* Section content */}
</SectionContainer>
\`\`\`

### ContentCard

The `ContentCard` component provides a standardized card container for content within sections. It includes:

- Consistent background opacity (`bg-black/40`)
- Standardized backdrop blur (`backdrop-blur-sm`)
- Uniform border styling (`border-purple-500/20`)
- Consistent border radius (`rounded-xl`)
- Standard padding (`p-8`)

\`\`\`jsx
<ContentCard>
  {/* Card content */}
</ContentCard>
\`\`\`

> **Important**: In some cases, using the ContentCard component directly may cause visual inconsistencies. If a section appears darker than others, try using the direct styling approach instead:
>
> \`\`\`jsx
> <motion.div
>   className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 overflow-hidden"
>   initial={{ opacity: 0, y: 20 }}
>   whileInView={{ opacity: 1, y: 0 }}
>   viewport={{ once: true }}
>   transition={{ duration: 0.8 }}
> >
>   {/* Content */}
> </motion.div>
> \`\`\`

## Tailwind Component Classes

The following component classes are available for use throughout the application:

- `.section-theme-default`: Base styling for sections
- `.section-card`: Standardized card styling
- `.section-title`: Styling for section titles
- `.section-subtitle`: Styling for section subtitles
- `.card-title`: Styling for card titles with gradient text
- `.card-content`: Standard styling for content within cards

## Background Implementation

All sections use a consistent background implementation:

\`\`\`jsx
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
\`\`\`

This ensures that all sections have the same background appearance and opacity.

## Typography Hierarchy

- Section titles: `text-4xl md:text-6xl font-bold` with gradient text
- Section subtitles: `text-xl text-gray-300`
- Card titles: `text-xl font-bold` with gradient text
- Body text: `text-gray-300` for standard text, `text-gray-400` for secondary text

## Animation Patterns

All sections use consistent animation patterns:

- Section titles fade in and slide up
- Section dividers animate from 0 width to full width
- Cards fade in and slide up
- Interactive elements have hover animations

## Color Palette

- Primary gradient: `from-purple-400 to-blue-400` for text gradients
- Secondary gradient: `from-purple-500 to-blue-500` for dividers and accents
- Background: Black with purple radial gradient overlay
- Card backgrounds: `bg-black/40` with `backdrop-blur-sm`
- Borders: `border-purple-500/20` for standard borders, `border-purple-500/50` for highlighted borders

## Usage Guidelines

1. Always use `SectionContainer` for major page sections
2. Use `ContentCard` for all card-based content
3. Maintain consistent opacity values for backgrounds
4. Use the predefined component classes for typography
5. Follow the established animation patterns
6. **Avoid custom padding on ContentCard components**
7. **If visual inconsistencies persist, use direct styling instead of ContentCard**

## Common Pitfalls to Avoid

1. **Custom Padding**: Adding custom padding classes to ContentCard components can affect their appearance and cause inconsistency
2. **Multiple Background Layers**: Adding additional background elements can stack opacity and make sections appear darker
3. **Custom Backdrop Filters**: Using different backdrop-filter values can cause visual inconsistency
4. **Nested Cards**: Nesting ContentCard components can multiply opacity effects and cause sections to appear darker
5. **Component Nesting**: In some cases, the way components are nested can affect their visual appearance

## Troubleshooting

If sections appear darker than others, try these solutions:

1. Check for multiple stacked background layers with their own opacity settings
2. Ensure consistent backdrop filter values
3. Remove additional wrappers with their own background properties
4. Check for CSS specificity conflicts
5. Remove custom padding classes on ContentCard components
6. **Try using direct styling instead of the ContentCard component**
7. **Ensure the component structure matches other sections exactly**

Always use the standardized components and classes to avoid these issues.
