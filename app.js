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

})(window, window.jQuery);
