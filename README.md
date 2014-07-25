# Contentful Delivery API Demo

This demo project starts with a static HTML page and replaces the placeholder content with dynamic content retrieved from the Contentful Delivery API.

## Exploring this project.

To get the code, use `git clone`:

```bash
git clone git@github.com:contentful/cdn-webinar-store-demo.git
cd cdn-webinar-store-demo
```

Each step of the project has it's own named branch, so start with `step-1`:

```bash
git checkout step-1
```

At this point you can open `index.html` and see placeholder content. The [webinar](https://www.contentful.com/blog/2014/07/22/contentful-webinar-content-delivery-api/) will guide you through the rest of the steps and the changes each one introduces.

## Note: use a web server to view files

The demo uses protocol-independent image links (e.g. `<img src="//images.contentful.com/..." />` so the images won't load correctly when viewing `file://path/to/cdn-webinar-store-demo/index.html`. In the webinar I used [ecstatic](https://www.npmjs.org/package/ecstatic) but you could use anything else you're comfortable with or already have configured, such as Apache or Nginx.
