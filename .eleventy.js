module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Date filter for Nunjucks
  eleventyConfig.addFilter("dateFormat", function(value, format) {
    const d = new Date(value);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if (format === "short") {
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    if (format === "long") {
      return `${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  });

  // JSON dump filter
  eleventyConfig.addFilter("dump", function(value) {
    return JSON.stringify(value);
  });

  // Collection: interviews sorted by date (newest first)
  eleventyConfig.addCollection("interviews", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/interviews/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
