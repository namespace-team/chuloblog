(function () {
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');


  if (searchTerm) {
    document.getElementById('search-box').setAttribute("value", searchTerm);
    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');
      my_big_json.forEach(function (doc) {
        this.add(doc)
      }, this)
    });
  }
})();


var idx = lunr(function () {
  this.ref('id')
  this.field('title')
  this.field('body')
  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
});


function lunr_search(term) {
  if (term) {
    document.getElementById('contentArea').innerHTML = '<article class="searchResult">' +
      '<div class="title" id="foundResults"><h2>...Search Result for "' + term + '"</h2><ul></ul></div></article>'
    var results = idx.search(term);
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        // more statements
        var ref = results[i]['ref'];
        var url = documents[ref]['url'];
        var title = documents[ref]['title'];
        var body = documents[ref]['body'].substring(0, 160) + '...';
        document.querySelectorAll('#foundResults ul')[0].innerHTML = document.querySelectorAll('#foundResults ul')[0].innerHTML + "<li class='lunrsearchresult'><h4><a href='" + url + "'>" + title + "</a></h4><p><a href='" + url + "'>" + body + "</a></p></li>";
      }
    } else {
      document.querySelectorAll('#foundResults ul')[0].innerHTML = "<li class='lunrsearchresult'>🫣 No results found...</li>";
    }
  }
  return false;
}
