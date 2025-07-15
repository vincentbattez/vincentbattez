# Project Structure

## Root Level Organization
- **Configuration files** at root (nuxt.config.ts, tailwind.config.js, tsconfig.json)
- **Package management** with multiple lock files (pnpm-lock.yaml, yarn.lock)
- **Main app entry** in `app.vue`

## Core Directories

### `/pages`
- Nuxt 3 file-based routing
- `index.vue` - Main landing page
- `/go/[id].vue` - Dynamic redirect pages for external links

### `/components`
- **Business logic components** specific to the application
- `/footer/` - Footer-related components (VbFooter, VbNavbar, VbSkillList)
- Component naming: `Vb` prefix + PascalCase

### `/ui`
- **Reusable UI component library**
- `/components/` - Generic UI components organized by category:
  - `/forms/` - Form elements (VbButton)
  - `/icon/` - Icon components (VbIcon)
  - `/typography/` - Text components (VbH2)
- `/styles/` - SCSS styling system:
  - `main.scss` - Main stylesheet entry
  - `/base/` - Base styles (_typography.scss, _layout.scss)

### `/assets`
- `/icons/` - SVG icons for font generation
- `/img/` - Images and graphics
- `/fonts/` - Generated icon fonts (vb-icon)

### `/types`
- TypeScript type definitions
- `vb-icon.ts` - Icon enumeration types

### `/utils`
- Utility functions
- `redirect.ts` - URL redirection logic

### `/public`
- Static assets served directly
- `favicon.ico`, `/fonts/` directory

## Naming Conventions

### Components
- **Prefix**: All custom components use `Vb` prefix (Vincent Battez)
- **Format**: PascalCase (VbButton, VbIcon, VbFooter)
- **Types**: Companion `.type.ts` files for component props/enums

### Files & Directories
- **Kebab-case** for directories and non-component files
- **PascalCase** for Vue component files
- **camelCase** for TypeScript/JavaScript files

### CSS Classes
- **Utility classes**: Tailwind CSS utilities
- **Custom classes**: BEM-like methodology (`.btn`, `.btn--primary`)
- **Container class**: `.vb-container` for layout consistency

## Architecture Patterns
- **Composition API** - Vue 3 script setup syntax
- **TypeScript-first** - All components and logic typed
- **Design system approach** - Centralized styling in Tailwind config
- **Component library pattern** - Separation of UI components from business logic
- **Icon font system** - SVG to font conversion workflow