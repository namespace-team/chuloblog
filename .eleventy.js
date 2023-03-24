const { EleventyRenderPlugin } = require("@11ty/eleventy");

// function sortByName(values) {
//   return values.slice().sort((a, b) => a.data.tag.localeCompare(b.data.tag))
// }

module.exports = (eleventyConfig) => {
  // eleventyConfig.addWatchTarget("./_includes/assets/")
  // eleventyConfig.addPassthroughCopy("./_includes/assets/")
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addCollection("posts", (collection) => {
    return collection.getFilteredByGlob("posts/**/*.md");
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  function elementCount(arr, element) {
    return arr.reduce((currentElement, arrElement) =>
      (arrElement == element ? currentElement + 1 : currentElement), 0);
  };

  eleventyConfig.addCollection('authors', collection => {
    let x = [];
    let y = collection.getFilteredByTag('post');
    let a = []
    y.forEach(post => a.push(post.data.author))


    y.forEach(post => {
      z = {
        'author': post.data.author,
        'firstname': post.data.fullname.split(" ")[0],
        'count': elementCount(a, post.data.author)
      }

      if (x.length == 0) {
        x.push(z);
      }
      else {
        traces = false
        x.forEach(m => {
          if (m.author == post.data.author) {
            traces = true;
          }
        })
        if (traces == true) {
          console.log("rejected <<< ", z)
        }
        else {
          x.push(z);
        }
      }
    });
    return [...new Set(x)]
  });

  eleventyConfig.addCollection('labels', collection => {
    let x = [];
    let y = collection.getFilteredByTag('post')
    let a = []
    y.forEach(post => a.push(post.data.tag))

    y.forEach(post => {
      z = {
        'label': post.data.tag,
        'count': elementCount(a, post.data.tag)
      }
      if (x.length == 0) {
        x.push(z);
      }
      else {
        traces = false
        x.forEach(m => {
          if (m.label == post.data.tag) {
            traces = true;
          }
        })
        if (traces == true) {
          console.log("rejected <<< ", z)
        }
        else {
          x.push(z);
        }
      }
    });
    return [...new Set(x)]
  });

  eleventyConfig.addFilter('dateFormat', function (text) {
    return String(text).split(":")[0].slice(0, -2)
  });

  eleventyConfig.addFilter('algExcerpt', function (text) {

    //first remove code
    text = text.replace(/<code class="language-.*?">.*?<\/code>/sg, '');

    //now remove html tags
    text = text.replace(/<.*?>/g, '');

    //Remove backslashes
    text = text.replace(/\\/g, '');

    //Remove tabs
    text = text.replace(/\t/g, '');

    //Remove big spaces and punctuation
    text = text.replace(/\n/g, ' ');

    //remove repeated spaces
    text = text.replace(/[ ]{2,}/g, '  ');

    //now limit to 8k
    return text.substring(0, 8000);
  });



  eleventyConfig.addPassthroughCopy("assets/css/*.css");
  eleventyConfig.addPassthroughCopy("assets/js/jquery.min.js");
  eleventyConfig.addPassthroughCopy("assets/js/lunr.min.js");
  eleventyConfig.addPassthroughCopy("assets/js/main.js");
  eleventyConfig.addPassthroughCopy("assets/js/search.js");
  eleventyConfig.addPassthroughCopy({ "assets/image/favicon": "/" });

  // eleventyConfig.addPassthroughCopy("authors/sample.liquid");



  return {
    templateFormats: [
      "md",
      "liquid",
      "njk",
    ],
    // passthroughFileCopy: true,
    markdownTemplateEngine: false,
    // markdownTemplateEngine: "njk",
    // templateEngineOverride: "liquid"

    // htmlTemplateEngine: "njk",

  };
};
