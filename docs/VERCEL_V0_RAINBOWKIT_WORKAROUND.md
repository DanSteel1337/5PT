# RainbowKit CSS Loading Workaround for Vercel v0 Preview

## The Problem

When using RainbowKit in a Vercel v0 preview environment, you may encounter the following error:

\`\`\`
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of 'text/css'. Strict MIME type checking is enforced for module scripts per HTML spec.
\`\`\`

This occurs because the Vercel v0 preview environment has limitations with how CSS files are loaded when imported directly in JavaScript/TypeScript files.

## The Solution: RainbowKitStylesProvider

We've implemented a workaround using a custom `RainbowKitStylesProvider` component that:

1. Detects if the application is running in the Vercel v0 preview environment
2. If not in preview: Dynamically imports RainbowKit styles
3. If in preview: Injects critical RainbowKit styles inline

## Implementation Details

### 1. RainbowKitStylesProvider Component

Located at `components/providers/RainbowKitStylesProvider.tsx`, this component:

- Uses `useEffect` to detect the environment
- Dynamically imports styles or injects inline CSS
- Shows a loading indicator while styles are being loaded

### 2. Modified Web3Provider

The `Web3Provider` component now wraps the `RainbowKitProvider` with our custom `RainbowKitStylesProvider`:

\`\`\`tsx
<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitStylesProvider>
      <RainbowKitProvider theme={customRainbowKitTheme}>
        {children}
      </RainbowKitProvider>
    </RainbowKitStylesProvider>
  </QueryClientProvider>
</WagmiProvider>
\`\`\`

### 3. Removed Direct Import

We've removed the direct import of RainbowKit styles from `app/layout.tsx`:

\`\`\`tsx
// REMOVED: import "@rainbow-me/rainbowkit/styles.css"
\`\`\`

## How It Works

1. In normal environments (development, production):
   - The provider dynamically imports RainbowKit styles
   - All RainbowKit components are styled as expected

2. In Vercel v0 preview environment:
   - The provider detects the preview environment
   - It injects critical RainbowKit styles inline
   - Basic functionality and styling are preserved

## Limitations

1. The inline styles may not cover all RainbowKit styling
2. There might be slight visual differences in the preview environment
3. This is a workaround, not an official solution

## Troubleshooting

If you encounter issues:

1. Check the browser console for any errors
2. Ensure the `RainbowKitStylesProvider` is correctly placed in the provider hierarchy
3. Clear browser cache and reload the page
4. If styles are still not loading, you may need to add more critical styles to the inline CSS

## Future Improvements

When Vercel v0 resolves the CSS loading issue, or when RainbowKit provides an official solution, this workaround can be removed by:

1. Removing the `RainbowKitStylesProvider` component
2. Restoring the direct import in `app/layout.tsx`
3. Updating the `Web3Provider` to remove the wrapper
\`\`\`

Let's also add a debug component to help troubleshoot any issues:
