# Technology Stack

## Framework & Core Technologies
- **Nuxt 3** - Vue.js meta-framework for SSR/SSG
- **Vue 3** - Frontend framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Sass/SCSS** - CSS preprocessing for styling

## Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Design System** - Defined in `tailwind.config.js` with:
  - Custom color palette (primary orange, secondary blue)
  - Custom spacing scale (xs, sm, md, lg, xl, xxl, xxxl)
  - Typography system with Nunito font family
  - Icon utilities and sizing
- **Normalize.css** - CSS reset for cross-browser consistency

## Development Tools
- **ESLint** - Code linting with TypeScript and Prettier configs
- **Prettier** - Code formatting
- **Fantasticon** - Icon font generation from SVG files
- **SVGO** - SVG optimization

## Common Commands

### Development
```bash
# Start development server
npm run dev
# or
pnpm run dev
# or
yarn dev
```

### Building
```bash
# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

### Icon Generation
```bash
# Generate icon fonts from SVG files
npm run generate:icon
```

### Setup
```bash
# Install dependencies
npm install
# or pnpm install / yarn install

# Prepare Nuxt (runs automatically after install)
npm run postinstall
```

## Package Manager
Project uses multiple package managers (npm, pnpm, yarn) - check for lock files to determine which one is preferred. Currently has both `pnpm-lock.yaml` and `yarn.lock`.