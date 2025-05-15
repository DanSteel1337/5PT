# RainbowKit Quick Reference Guide

## 🚫 Common Mistakes to Avoid

1. **NEVER import RainbowKit styles in client components**
   \`\`\`tsx
   // ❌ WRONG - Will cause MIME type errors
   import "@rainbow-me/rainbowkit/styles.css" // In client components
   
   // ✅ RIGHT - Import in globals.css or layout.tsx only
   \`\`\`

2. **NEVER use Web3 hooks in server components**
   \`\`\`tsx
   // ❌ WRONG - Will cause hydration errors
   export default function ServerComponent() {
     const { address } = useAccount() // Server component using Web3 hook
   }
   
   // ✅ RIGHT - Use client components for Web3 functionality
   "use client"
   export default function ClientComponent() {
     const { address } = useAccount()
   }
   \`\`\`

3. **NEVER modify critical CSS selectors**
   \`\`\`css
   /* ❌ WRONG - Don't remove or modify these selectors */
   [data-rk] [role="dialog"] { /* ... */ }
   
   /* ✅ RIGHT - Keep these selectors intact */
   \`\`\`

## ✅ Best Practices

1. **ALWAYS use mounting checks in Web3 components**
   \`\`\`tsx
   "use client"
   export function Web3Component() {
     const [mounted, setMounted] = useState(false)
     
     useEffect(() => {
       setMounted(true)
     }, [])
     
     if (!mounted) return null // Don't render during SSR
     
     // Rest of component...
   }
   \`\`\`

2. **ALWAYS maintain correct provider nesting order**
   \`\`\`tsx
   <WagmiProvider>
     <QueryClientProvider>
       <RainbowKitProvider>
         {children}
       </RainbowKitProvider>
     </QueryClientProvider>
   </WagmiProvider>
   \`\`\`

3. **ALWAYS add position:relative to body**
   \`\`\`css
   body {
     position: relative; /* Required for RainbowKit modal */
   }
   \`\`\`

4. **ALWAYS use high z-index values for modals**
   \`\`\`css
   [role="dialog"] {
     z-index: 9999 !important;
   }
   \`\`\`

## 🔧 Quick Fixes for Common Issues

1. **CSS Loading Error**: If you see `Failed to load "@rainbow-me/rainbowkit/styles.css"` with MIME type errors:
   - Remove direct CSS imports from client components
   - Add RainbowKit styles to globals.css using CSS variables
   - Import RainbowKit styles ONLY in the root layout.tsx

2. **Modal Positioning Issues**: If the modal appears in the wrong position:
   - Add `position: relative` to body
   - Add CSS targeting Radix UI Dialog components with proper z-index
   - Ensure no parent containers have `overflow: hidden`

3. **Unstyled Modal**: If the modal appears but is unstyled:
   - Ensure RainbowKit styles are imported in `app/layout.tsx`
   - Check that your custom CSS isn't overriding RainbowKit's styles
   - Clear browser cache and restart dev server

4. **Hydration Errors**: If you see hydration mismatches:
   - Use mounting checks in ALL Web3 components
   - Add `suppressHydrationWarning` to html tag
   - Return null or a placeholder during server rendering
