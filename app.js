(function (window, $) {
  // Compile all our templates
  var Templates = {};
  $('script[type="text/x-handlebars-template"]').each(function () {
    Templates[this.id] = Handlebars.compile(this.innerHTML);
  });

  window.onhashchange = function (e) {
    if (e.oldURL === e.newURL) {
      return;
    }
    var match = e.newURL.match(/#.+/);
    var hash = match ? match[0] : '';
    showPage(hash);
  };

  var client = contentful.createClient({
    space: 'cxabrnrb7c0d',
    accessToken: '403bf75367636a190d5eca3346a59f1a476651a3c65cd21ac80de0eea46024a3'
  });

  client.space().then(
    function (space) { console.log(space); },
    function (error) { console.error(error); }
  );

  showPage(window.location.hash || '');

  /**
   * Our "router". Right now this just chooses the template to render
   */
  function showPage (hash) {
    var path = hash.substr(2).split('/');
    var page;
    if (path[0] === 'product') {
      page = Templates.ProductPage({});
    } else {
      page = Templates.CategoryPage({});
    }
    $('#page').html(page);
    window.dispatchEvent(new Event('page'));
  }

})(window, window.jQuery, window.contentful);
