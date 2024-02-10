# inline-template

This extension uses Handlebars to compile a template passed in using an attribute and provides it the context of a JSON response.

## Note
Please load Handlebars from a CDN like [cdnjs](https://cdnjs.com/libraries/handlebars.js) or [jsDelivr](http://www.jsdelivr.com/#!handlebarsjs).

## Attributes
### `data-template`
The value of this attribute should be a Handlebars template.

#### Example

JSON:
```json
[{
    "content": "Hello World!",
    "author": {
        "username": "tercmd",
    },
}]
```

HTML:
```html
<div hx-get="/api/messages" data-template="{{[0].author.username}} said {{[0].content}}" hx-trigger="load" hx-ext="inline-template"></div>
```

Rendered content:
```plaintext
tercmd said Hello World!
```

> The use of `[0].content` is important because the Handlebars template is accessing the 0th element of the context provided, which is the response itself.

## Add to site
```html
<script src="https://cdn.jsdelivr.net/gh/htmxify/htmxify@latest/scripts/inline-template.min.js"></script>
```
If you would like to use a fixed version rather than `latest`, refer to [the GitHub Releases page](https://github.com/htmxify/htmxify/releases) for the latest version.