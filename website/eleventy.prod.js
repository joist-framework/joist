import CleanCSS from "clean-css";
import { minify } from "terser";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/**/*");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter(
    "cssmin",
    (code) => new CleanCSS({}).minify(code).styles,
  );

  eleventyConfig.addFilter("jsmin", async (code) => {
    try {
      const minified = await minify(code);

      return minified.code;
    } catch (err) {
      console.error("Terser error: ", err);
      return code;
    }
  });

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
