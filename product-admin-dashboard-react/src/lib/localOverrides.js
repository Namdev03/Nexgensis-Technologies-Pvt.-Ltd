// DummyJSON's /products/add, PUT and DELETE endpoints are fakes: they return
// a valid-looking response but never actually change the server's data. The
// next GET /products call comes back as if nothing happened.
//
// To make the dashboard still *behave* like a real admin tool (added items
// show up, edited items reflect their new values, deleted items disappear -
// even after a refresh), we keep a small "overlay" in localStorage and merge
// it into whatever the API returns. Explained further in the README.
//
// Shape: { created: Product[], updated: { [id]: Partial<Product> }, deletedIds: number[] }

const KEY = "pad_overrides";
const NEW_ID_START = 900000; // clearly out of range of DummyJSON's real ids (1-194)

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { created: [], updated: {}, deletedIds: [] };
  } catch {
    return { created: [], updated: {}, deletedIds: [] };
  }
}

function write(data) {
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export function addCreatedProduct(product) {
  const data = read();
  const nextId = NEW_ID_START + data.created.length;
  const withId = {
    ...product,
    id: nextId,
    images: product.images?.length ? product.images : [product.thumbnail].filter(Boolean),
  };
  data.created.unshift(withId);
  write(data);
  return withId;
}

export function addUpdatedProduct(id, patch) {
  const data = read();
  data.updated[id] = { ...(data.updated[id] || {}), ...patch };
  const createdIdx = data.created.findIndex((p) => String(p.id) === String(id));
  if (createdIdx !== -1) {
    data.created[createdIdx] = { ...data.created[createdIdx], ...patch };
  }
  write(data);
}

export function addDeletedId(id) {
  const data = read();
  if (!data.deletedIds.includes(id)) data.deletedIds.push(id);
  data.created = data.created.filter((p) => String(p.id) !== String(id));
  write(data);
}

export function applyOverlayToList(products) {
  const { updated, deletedIds } = read();
  return products
    .filter((p) => !deletedIds.includes(p.id))
    .map((p) => (updated[p.id] ? { ...p, ...updated[p.id] } : p));
}

export function getCreatedProducts() {
  return read().created;
}

export function findLocalProduct(id) {
  const { created, updated } = read();
  const local = created.find((p) => String(p.id) === String(id));
  if (local) return local;
  if (updated[id]) return { __patchOnly: true, ...updated[id] };
  return null;
}

export function isDeleted(id) {
  const { deletedIds } = read();
  return deletedIds.includes(Number(id)) || deletedIds.includes(id);
}
