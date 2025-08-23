# @merke/brand

Shared brand tokens and utilities for Merke projects.

## Install

```bash
pnpm add -D @merke/brand
```

## Usage

1. Fonts (in your app entry):

```ts
import { Geist } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], display: "swap" });
```

2. Global CSS:

```css
@import "@merke/brand";
```

3. HTML body class:

```tsx
<body className={`${geistSans.variable} ${serif.variable} antialiased`}>
```

4. Utilities:

- .font-brand-serif for headings
- .font-brand-sans for UI text
- .brand-underline for the thin accent underline
- .magic-border for animated conic gradient border

### Tokens

CSS variables you can override:

- --background, --foreground, --border, --input, --ring
- --muted, --muted-foreground
- --accent, --accent-foreground
- --primary, --primary-foreground

Override in your app by redeclaring any variable in :root or a theme scope.
