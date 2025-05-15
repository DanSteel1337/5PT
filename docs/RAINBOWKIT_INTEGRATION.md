# RainbowKit Integration Guide

## Critical Requirements

### 1. CSS Import Location
- ✅ ALWAYS import RainbowKit styles in `app/layout.tsx` (or `pages/_app.tsx` for Pages Router)
  \`\`\`tsx
  // app/layout.tsx
  import '@rainbow-me/rainbowkit/styles.css';
  \`\`\`
- ❌ NEVER import RainbowKit styles in client components
  \`\`\`tsx
  // components/providers/Web3Provider.tsx - WRONG!
  import '@rainbow-me/rainbowkit/styles.css'; // Will cause MIME type errors
  \`\`\`

### 2. Client-Side Only
- ✅ ALWAYS use 'use client' directive for components with Web3 functionality
- ✅ ALWAYS implement mounting checks to prevent hydration errors
  \`\`\`tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null; // Don't render during SSR
  \`\`\`
- ❌ NEVER use Web3 hooks in server components

### 3. Provider Order
- ✅ ALWAYS maintain correct provider nesting:
  \`\`\`tsx
  <WagmiProvider>
    <QueryClientProvider>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
  \`\`\`

### 4. Modal Styling
- ✅ ALWAYS add `position: relative` to the body element
- ✅ ALWAYS keep the CSS selectors targeting Radix UI Dialog components
- ❌ NEVER use `overflow: hidden` on parent containers of the modal

## Common Issues & Solutions

### CSS Loading Errors

If you see: `Failed to load "@rainbow-me/rainbowkit/styles.css" from "blob:..." Modules must be served with a valid MIME type`

**Solution**:
1. Remove direct CSS imports from client components
2. Add RainbowKit styles import to `app/layout.tsx`
3. Clear browser cache and restart dev server

### Modal Positioning Issues

If the RainbowKit modal appears in the wrong position:

**Solution**:
1. Add `position: relative` to body
2. Ensure CSS selectors targeting Radix UI Dialog components have proper z-index
3. Check that no parent containers have `overflow: hidden`

### Unstyled Modal Issues

If the modal appears but is unstyled (oversized icons, missing padding):

**Solution**:
1. Ensure RainbowKit styles are imported in `app/layout.tsx`
2. Check that your custom CSS isn't overriding RainbowKit's styles with `!important`
3. Verify that the RainbowKit CSS variables in `:root` are properly defined

### Hydration Errors

If you see hydration mismatches:

**Solution**:
1. Use mounting checks in ALL Web3 components
2. Add `suppressHydrationWarning` to html tag
3. Return null or a placeholder during server rendering

## Testing Your Fix

After implementing these changes:

1. **Clear your browser cache** completely (or use incognito mode)
2. **Restart your development server**
3. **Test the wallet connection** to see if the modal now appears with proper styling

## Troubleshooting Checklist

If issues persist, check:

- [ ] RainbowKit styles are imported ONLY in `app/layout.tsx`
- [ ] Body element has `position: relative`
- [ ] CSS selectors for Radix UI Dialog components are present and not overridden
- [ ] All Web3 components have mounting checks
- [ ] Provider nesting order is correct
- [ ] Browser cache is cleared and dev server restarted
\`\`\`

Let's also update the CustomConnectButton component with proper documentation:
