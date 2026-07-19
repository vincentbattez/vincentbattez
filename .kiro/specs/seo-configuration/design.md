# SEO Configuration Design Document

## Overview

This design implements a comprehensive SEO strategy for Vincent Battez's AI Engineer portfolio using the Nuxt SEO collection of modules. The solution focuses on French-language optimization targeting AI engineering keywords while maintaining professional presentation across search engines and social media platforms.

The design leverages multiple Nuxt SEO modules working together to provide maintainable SEO optimization

## Architecture

### Module Selection Strategy

Based on the requirements and Nuxt SEO documentation, we'll implement:

1. **@nuxtjs/seo** - Main SEO module providing integrated functionality
2. **@nuxtjs/sitemap** - Automatic sitemap generation for search engine discovery
3. **@nuxtjs/robots** - Robots.txt management for proper crawling
4. **@nuxtjs/site-config** - Centralized site configuration
5. **@nuxtjs/og-image** - Dynamic Open Graph image generation

### SEO Content Strategy

**Primary Keywords (French):**
- IA Engineer / Développeur Full Stack
- Expert RAG (Retrieval-Augmented Generation)
- Spécialiste LLM (Large Language Models)
- Context Engineering / Prompt Engineering
- IA Engineer Freelance Lille

**Secondary Keywords:**
- Intégration IA entreprise
- Consultant intelligence artificielle
- Développement solutions IA
- Architecture LLM

## Components and Interfaces

### 1. Site Configuration Component

**Purpose:** Centralized configuration for all SEO-related site information

**Configuration Structure:**
```typescript
interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    url: string;
  };
  language: string;
  locale: string;
  location: {
    city: string;
    country: string;
  };
}
```

### 2. Meta Tags Component

**Purpose:** Meta tag generation

**Key Meta Tags:**
- Title optimization with AI engineering focus
- Meta description highlighting specific AI capabilities
- Keywords targeting French AI development terms
- Author and professional information
- Geographic targeting for Lille/France

### 3. Open Graph Component

**Purpose:** Social media optimization for professional sharing

**Open Graph Properties:**
- og:title - Professional AI Engineer title
- og:description - Expertise summary
- og:image - Professional portrait or AI-themed graphic
- og:type - Professional profile
- og:locale - French localization

### 4. Twitter Card Component

**Purpose:** Twitter-specific optimization for professional networking

**Twitter Card Properties:**
- twitter:card - Summary with large image
- twitter:title - AI expertise focus
- twitter:description - Professional capabilities
- twitter:image - Professional headshot

### 5. Structured Data Component

**Purpose:** Rich snippets for search engine understanding

**Schema.org Types:**
- Person schema for professional identity
- ProfessionalService for AI consulting
- Organization for freelance business
- LocalBusiness for geographic relevance

## Data Models

### SEO Configuration Model

```typescript
interface SEOConfig {
  // Base site information
  site: {
    name: string;
    url: string;
    description: string;
    language: 'fr';
    locale: 'fr-FR';
  };
  
  // Professional identity
  person: {
    name: 'Vincent Battez';
    jobTitle: 'AI Engineer & Full Stack Developer';
    description: string;
    location: 'Lille, France';
    expertise: string[];
    services: string[];
  };
  
  // SEO targeting
  keywords: {
    primary: string[];
    secondary: string[];
    technical: string[];
  };
  
  // Social media
  social: {
    linkedin: string;
    github: string;
  };
}
```

### Page-Specific SEO Model

```typescript
interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}
```

## Implementation Considerations

### French Language Optimization

1. **Content Localization:**
   - All meta content in professional French
   - Technical terms balanced with French equivalents
   - Geographic targeting for French market

2. **Keyword Strategy:**
   - Primary focus on French AI development terms
   - Technical English terms where industry-standard
   - Local SEO optimization for Lille region

### Professional Positioning

1. **Expertise Communication:**
   - Clear AI specialization messaging
   - Specific technology mentions (RAG, LLMs, etc.)
   - Senior-level positioning for full stack development

2. **Trust Signals:**
   - Professional contact information
   - Geographic location transparency

### Technical Implementation

1. **Module Integration:**
   - Nuxt SEO modules configured in nuxt.config.ts
   - The `@nuxtjs/seo` module is an alias module that combines all the other SEO modules into a single installation. Here the list of modules:
     - `Nuxt Sitemap`: for automatic sitemap generation (documentation: https://nuxtseo.com/docs/sitemap/getting-started/introduction.md)
     - `Nuxt Robots`: for proper crawling (documentation: https://nuxtseo.com/docs/robots/getting-started/introduction.md)
     - `Nuxt OG Image`:  for dynamic Open Graph image generation (documentation: https://nuxtseo.com/docs/og-image/getting-started/introduction.md)
     - `Nuxt Schema.org`: for structured data (documentation: https://nuxtseo.com/docs/schema-org/getting-started/introduction.md)
     - `Link Checker DevTools` : for checking links (documentation: https://nuxtseo.com/docs/link-checker/guides/live-inspections.md)
     - `Nuxt SEO Utils`: is a collection of defaults and utilities to improve your Nuxt site's discoverability and shareability.  (documentation: https://nuxtseo.com/docs/seo-utils/getting-started/introduction.md)
     - `Site Config`: A single source of truth for site config (documentation: https://nuxtseo.com/docs/site-config/getting-started/introduction.md)
   - Site config centralized for maintainability

2. **Maintainability:**
   - DRY principles followed throughout
    - Clear separation of concerns
    - Easy updates for future changes
   - Configuration-driven approach
   - Minimal manual intervention required
   - No over-complicated configurations
   - No overengineered solutions