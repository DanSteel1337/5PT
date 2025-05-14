# 5PT Investment DApp

## Web3 Integration Guidelines

### Critical Requirements

1. **Client-Side Only**: All Web3 functionality MUST be client-side only.
   - Always use 'use client' directive
   - Always implement mounting checks
   - Never use Web3 hooks in server components

2. **CSS Imports**: 
   - NEVER import RainbowKit styles directly in client components
   - ALWAYS use globals.css for RainbowKit styling
   - DO NOT modify the CSS selectors targeting Radix UI Dialog components

3. **Provider Structure**:
   - ALWAYS maintain correct provider nesting:
     - WagmiProvider > QueryClientProvider > RainbowKitProvider
   - ALWAYS wrap providers in a Suspense boundary

4. **Component Structure**:
   - ALWAYS use mounting checks in Web3 components
   - ALWAYS handle errors gracefully
   - ALWAYS use relative positioning and z-index for proper modal positioning

### Common Issues & Solutions

See `docs/RAINBOWKIT_INTEGRATION.md` for detailed troubleshooting.

### Development Guidelines

1. When modifying Web3 components:
   - Ensure all logic remains client-side
   - Test on multiple browsers and devices
   - Verify modal positioning and styling

2. When updating styles:
   - Modify CSS variables in globals.css
   - Do not remove or modify critical CSS selectors
   - Test modal positioning after style changes

3. When adding new Web3 functionality:
   - Create client components with proper mounting checks
   - Follow the established pattern for error handling
   - Test thoroughly before committing
