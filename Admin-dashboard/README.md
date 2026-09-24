# Product Admin Dashboard

A small admin dashboard for browsing, searching, filtering and managing products, built on the
[DummyJSON](https://dummyjson.com) API.

**Stack:** React (Vite) · React Router · Tailwind CSS · Axios

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)). You'll be redirected
to `/login`.

**Demo login:** `emilys` / `emilyspass` (the form is pre-filled with these).

### Build for production

```bash
npm run build
npm run preview
```

`npm run build` outputs a static `dist/` folder — deploy it to Vercel or Netlify as a static site
(framework preset "Vite", or just point it at `dist`). No environment variables are required; the API
base URL is public and hard-coded in `src/lib/axios.js`.

> This is a client-side-only single-page app, so on Netlify/Vercel add a rewrite/redirect from `/*` to
> `/index.html` (Vercel does this automatically for Vite; on Netlify add a `public/_redirects` file with
> `/* /index.html 200` if you want deep links like `/products/5` to work on a hard refresh).

## What's finished

- [x] Login page, error messages on wrong credentials, logout button, protected product routes
- [x] Product list: image, title, category, price, rating, stock — table on desktop, cards on mobile
- [x] Pagination: page numbers, Previous/Next, page-size selector (10/20/50), "Showing X–Y of Z"
- [x] Debounced search (`/products/search`), resets to page 1 on change, cancels stale requests
- [x] Category filter (`/products/categories`) and sort by price / rating / title (asc/desc)
- [x] Product details page at `/products/:id` with images, description, price, reviews
- [x] "Not found" state for an invalid product id
- [x] Add / edit form with validation, delete with a confirm popup
- [x] Loading, empty and error (with Retry) states everywhere data is fetched
- [x] One shared Axios instance (`src/lib/axios.js`) — attaches the token, centralises error handling
- [x] Page / search / filter / sort state kept in the URL query string (`useSearchParams`)
- [x] Guards against `?page=abc` / `?page=999` and against double-submitting login or the product form

## Notes on trickier requirements

**Search + category can't run together.** DummyJSON's `/products/search` endpoint doesn't accept a
category, so when there's an active search term the app searches across *all* categories and disables
the category dropdown (with a short note explaining why). Clearing the search box re-enables it.

**Add/edit/delete aren't really saved by the API.** DummyJSON's `add`/`PUT`/`DELETE` endpoints return a
valid-looking response but don't persist anything — the next `GET /products` looks like nothing happened.
To make the dashboard still behave like a real tool, `src/lib/localOverrides.js` keeps a small overlay in
`localStorage` (created products, per-id patches, deleted ids) and merges it into whatever the API
returns, on every list/detail fetch. Newly created products get an id starting at `900000` so they never
collide with DummyJSON's real ids (1–194). This is local to the browser, not a real backend — refreshing
keeps your changes, but a different browser/device won't see them.

**Fast typing in search never shows stale results.** Two layers protect this: the search box is
debounced (~450ms) before it updates the URL/query, and every request in `src/pages/Products.jsx` is
made with an `AbortController` that's aborted as soon as a newer request starts — so even if a slow
early response comes back after a faster later one, it's ignored instead of overwriting the screen.

**Bad URLs don't break the page.** `?page=abc`, `?page=-1` etc. all fall back to page 1
(`sanitizePage` in `src/pages/Products.jsx`). `?page=999` loads normally and, once the real total is
known, the app snaps the URL back to the last valid page instead of showing a blank table.

**Double-clicks / double-submits.** Login is throttled (ignores a second submit within 500ms) and also
guarded by an in-flight ref in `AuthContext`. The product form guards submission with a ref so a fast
double-click can't fire two save requests.

## One problem I ran into

DummyJSON's write endpoints (`add`/`PUT`/`DELETE`) don't persist, so a straightforward implementation
would show a success message and then have the product "revert" on the next page load — which looks
broken even though it's the API's fault, not the app's. I fixed it by adding the local overlay layer
described above, so the dashboard behaves consistently even though the backend is a sandbox.

## Where AI helped

I used an AI assistant to scaffold the project structure and repetitive pieces (the Tailwind table/card
markup, the pagination number-range logic, and the first draft of the validation rules in
`ProductForm.jsx`), and to think through edge cases like the search/category conflict and the
double-submit guards. I reviewed and adjusted the generated code, and can walk through and explain every
file.
