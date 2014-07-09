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

  // Friendlier names for Content Type id's
  var ContentTypes = {
    Category: '3O7B8JdPZecUCm8AumKkUE',
    Product:  'DgvD5CjmoKESsMscCyCc6',
  };

  showPage(window.location.hash || '');

  /**
   * Our "router". Right now this just chooses the template to render
   */
  function showPage (hash) {
    var path = hash.substr(2).split('/');
    var pagePromise;
    if (path[0] === 'product') {
      pagePromise = Promise.cast(Templates.ProductPage({}));
    } else {
      pagePromise = renderCategoryPage(path[1]);
    }

    pagePromise.then(function (html) {
      $('#page').html(html);
      window.dispatchEvent(new Event('page'));
    }).done();
  }

  /**
   * Request all the Category entries from the delivery API. then replace the
   * category menu content with a list items for each one.
   */
  function renderCategoryPage (categoryId) {
    return client.entries({ content_type: ContentTypes.Category }).then(function (categories) {
      categoryId = categoryId || categories[0].sys.id;
      var menuItems = categories.map(function (category) {
        return Templates.CategoryMenuItem(category);
      }).join('');

      return Templates.CategoryPage({
        categoryMenuItems: menuItems
      });
    });
  }
})(window, window.jQuery, window.contentful);
