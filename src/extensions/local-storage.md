# local-storage
An extension to append request headers with values from localStorage.

## Attributes
### `data-ls-item`
This is the key of the item in localStorage.
### `data-ls-header`
This is the name of the header which is added to requests.

## Example
```html
<div hx-get="/api/..." data-ls-item="auth-token" data-ls-header="Authorization" hx-trigger="load"></div>
```

This code sends a request with the header `Authorization: Bearer ...` (this token is stored in localStorage)

## Add to site
```html
<script src="https://cdn.jsdelivr.net/gh/htmxify/htmxify@latest/scripts/local-storage.min.js"></script>
```
If you would like to use a fixed version rather than `latest`, refer to [the GitHub Releases page](https://github.com/htmxify/htmxify/releases) for the latest version.