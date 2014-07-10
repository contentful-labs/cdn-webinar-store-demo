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

  $('body').on('keydown', '#search-terms', debounce(500, function (e) {
    var terms = $('#search-terms');
    window.location.hash = '#/search/' + terms.val();
  }));

  /**
   * Our "router". Right now this just chooses the template to render
   */
  function showPage (hash) {
    var path = hash.substr(2).split('/');
    var pagePromise;
    if (path[0] === 'product') {
      pagePromise = renderProductPage(path[1]);
    } else {
      var productQuery = makeProductQuery(path[0], path[1]);
      pagePromise = renderListingPage(productQuery);
    }

    pagePromise.then(function (html) {
      if (html === false) {
        window.location.hash = '#/category';
        return;
      }

      $('#page').html(html);
      window.dispatchEvent(new Event('page'));
    }).done();
  }

  /**
   * Request all the Category entries from the delivery API. then replace the
   * category menu content with a list items for each one.
   */
  function renderListingPage (productQuery) {
    return client.entries({ content_type: ContentTypes.Category }).then(function (categories) {
      var menuItems = categories.map(function (category) {
        return Templates.CategoryMenuItem(category);
      }).join('');

      return client.entries(productQuery).then(createProductTiles).then(function (productTiles) {
        return Templates.CategoryPage({
          categoryMenuItems: menuItems,
          productTiles: productTiles,
          searchTerms: productQuery.query
        });
      });
    });
  }

  function makeProductQuery (type, parameter) {
    var query = { content_type: ContentTypes.Product };
    if (type === 'search' && parameter) {
      query.query = parameter;
    }
    else if (type === 'category') {
      query['fields.categories.sys.id'] = parameter;
    }
    return query;
  }

  function createProductTiles (products) {
    return products.map(function (product) {
      var mainImage  = product.fields.mainImage;
      var hoverImage = product.fields.hoverImage || product.fields.mainImage;
      return Templates.ProductTile({
        href:          '#/product/' + product.sys.id,
        name:          product.fields.name,
        price:         product.fields.price,
        mainImageURL:  assetUrl(mainImage, { fit: 'pad', w: 420, h: 535 }),
        hoverImageURL: assetUrl(hoverImage, { fit: 'pad', w: 420, h: 535 })
      });
    }).join('');
  }

  /**
   * Show a single product
   */
  function renderProductPage (productId) {
    if (!productId) {
      return false;
    }

    return client.entries({
      content_type: ContentTypes.Product,
      'sys.id': productId
    }).then(function (products) {
      var product = products[0];
      if (!product) {
        return false;
      }
      product.allImages = [product.fields.mainImage, product.fields.hoverImage].concat(product.fields.images).filter(Boolean);
      return Templates.ProductPage(product);
    });
  }

  /**
   * Return the URL to a particular asset, optionally with query parameters appended.
   */
  function assetUrl (asset, extraParams) {
    try {
      var url = asset.fields.file.url;
      if (extraParams) {
        var queryString = '';
        for (var key in extraParams) {
          queryString += '&' + key + '=' + extraParams[key];
        }
        url += '?' + queryString.substr(1);
      }
      return url;
    } catch (e) {
      console.error('Asset had no file URL:', asset);
      return 'images/show_item_01.jpg';
    }
  }

  function debounce (delay, fn) {
    var timeout = false;

    return function (e) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () {
        timeout = false;
        fn(e);
      }, delay);
    };
  }

})(window, window.jQuery, window.contentful);
