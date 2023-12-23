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