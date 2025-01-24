export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/**/*");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter("cssmin", (code) => code);
  eleventyConfig.addFilter("jsmin", (code) => code);

  eleventyConfig.addGlobalData(
    "jsFiles",
    fs.readdirSync("./src/_includes/js/").map((file) => `js/${file}`),
  );

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
}
