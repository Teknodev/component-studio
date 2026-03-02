# Component Studio

Desktop application for building, previewing, and testing custom components locally with live hot-reload and theme configuration testing.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Features

### Authentication
Sign in through your Blinkpage account via browser-based authentication. The app registers a `blinkpage://` deep link protocol to receive the auth token after login.

### Projects
Browse all your owned projects fetched from the Blinkpage API. Each project card shows its name, status, and page count.

### Component Development
1. Select a project and link a local folder containing your component source files
2. The file tree displays all files in the linked folder with real-time updates via file watching
3. Components are auto-detected by scanning for folders containing `index.tsx` or `index.jsx` entry points

### Live Preview
- Selecting a component starts a local Vite dev server that serves it in an iframe
- Vite's HMR ensures changes in your editor are reflected instantly
- Toggle between mobile, tablet, and desktop viewport sizes

### Theme Configuration
- Open the theme overlay panel to adjust colors, fonts, and environment settings
- Changes are applied to the preview in real-time via `postMessage`
- Theme settings match the Blinkpage platform structure (colors, fonts, environments)
- Optionally save theme changes back to the project via the API

## Component Structure

Each component should be a folder with an `index.tsx` (or `index.jsx`) that default-exports a React component. Use CSS custom properties for theme integration:

```css
/* Available theme CSS variables */
--theme-background
--theme-primary
--theme-secondary
--theme-tertiary
--theme-font-color-primary
--theme-font-color-secondary
--theme-font-family
--theme-border-radius
--theme-content-width
--theme-box-shadow
```

See `component-template/` for a complete example.

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=https://app.blinkpage.app/api
```
