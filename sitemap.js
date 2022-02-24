const SitemapGenerator = require('sitemap-generator')

// create generator
const generator = SitemapGenerator('https://vincentbattez.dev/', {
  stripQuerystring: false,
  filepath: './sitemap.xml',
});

// start the crawler
generator.start();
