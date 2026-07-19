# Implementation Plan

- [x] 1. Install and configure Nuxt SEO modules
  - Install @nuxtjs/seo module which includes all required SEO modules
  - Configure the module in nuxt.config.ts with basic settings
  - _Requirements: 4.2, 5.1_

- [x] 2. Set up centralized site configuration
  - Configure @nuxtjs/site-config with Vincent's professional information
  - Define site metadata including name, URL, description in French
  - Set up author information and geographic location (Lille, France)
  - _Requirements: 1.1, 1.2, 3.3, 4.1_

- [x] 3. Implement core SEO meta configuration
- [x] 3.1 Create global SEO defaults in nuxt.config.ts
  - Configure default title template with AI engineering and Full Stack developer focus
  - Set up default meta description highlighting AI expertise
  - Configure French language and locale settings
  - _Requirements: 1.1, 1.2, 4.2_

- [x] 3.2 Add structured data for professional identity
  - Implement Person schema with Full Stack developer with AI engineer specialization
  - Add ProfessionalService schema for AI consulting services
  - Configure LocalBusiness schema for geographic relevance
  - _Requirements: 1.3, 3.1, 3.2_

- [x] 4. Configure Open Graph and social media optimization
- [x] 4.1 Set up Open Graph meta tags
  - Read the Nuxt OG Image documentation: https://nuxtseo.com/docs/og-image/getting-started/introduction.md
  - Configure og:title with professional Full Stack developer and AI engineer positioning
  - Set og:description highlighting specific AI technologies (RAG, LLMs) and Full Stack developer (node.js, react, observability)
  - Configure og:type as profile for professional presentation
  - Set og:locale to fr_FR for French market targeting
  - _Requirements: 2.1, 2.3, 3.1_

- [x] 4.2 Configure Twitter Card optimization
  - Set up Twitter Card with summary_large_image format
  - Configure twitter:title and twitter:description for professional networking
  - Set up twitter:image for professional presentation
  - _Requirements: 2.2, 2.3_

- [x] 5. Implement page-specific SEO optimization
- [x] 5.1 Optimize homepage SEO
  - Update index.vue with useSeoMeta for AI engineering keywords
  - Configure title with "IA Engineer", "Développeur Full Stack" keywords
  - Set meta description mentioning RAG, LLMs, context engineering and senior full stack expertise
  - Add keywords targeting French AI development terms
  - _Requirements: 1.1, 1.4, 3.1, 3.3_

- [x] 5.2 Optimize dynamic redirect pages SEO
  - Configure SEO meta for /go/[id].vue pages
  - Set appropriate noindex directives for redirect pages
  - Ensure canonical URLs point to main portfolio
  - _Requirements: 4.1, 4.2_

- [ ] 6. Configure robots.txt and sitemap
- [ ] 6.1 Set up robots.txt configuration
  - Configure @nuxtjs/robots for proper search engine crawling
  - Allow crawling of main content pages
  - Set appropriate crawl delays and directives
  - _Requirements: 4.1, 4.2_

- [ ] 6.2 Configure automatic sitemap generation
  - Set up @nuxtjs/sitemap for search engine discovery
  - Include main portfolio pages in sitemap
  - Configure sitemap with proper priority and change frequency
  - _Requirements: 4.1, 4.2_

- [ ] 7. Set up Open Graph image generation
  - Configure @nuxtjs/og-image for dynamic social media images
  - Create template for professional AI engineer branding
  - Set up image for social sharing
  - Set up specific image for /go/cv page
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 8. Test and validate SEO implementation
- [ ] 8.1 Validate structured data and meta tags
  - Test structured data with Google's Rich Results Test
  - Validate Open Graph tags with Facebook's Sharing Debugger
  - Check Twitter Card rendering with Twitter's Card Validator
  - _Requirements: 1.3, 2.1, 2.2, 4.2_

- [ ] 8.2 Test search engine optimization
  - Verify French keyword targeting in meta content
  - Test geographic relevance for Lille/France searches
  - Validate professional AI engineering positioning in all meta content
  - _Requirements: 1.1, 1.2, 3.3, 4.2_