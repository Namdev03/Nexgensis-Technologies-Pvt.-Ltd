import { useRef, useState } from "react";

const EMPTY = {
  title: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  description: "",
  thumbnail: "",
};

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  else if (values.title.trim().length < 3) errors.title = "Title must be at least 3 characters.";

  if (!values.category.trim()) errors.category = "Category is required.";

  if (values.price === "" || values.price === null) errors.price = "Price is required.";
  else if (Number.isNaN(Number(values.price)) || Number(values.price) <= 0)
    errors.price = "Price must be a positive number.";

  if (values.stock === "" || values.stock === null) errors.stock = "Stock is required.";
  else if (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0)
    errors.stock = "Stock must be a whole number, 0 or more.";

  if (values.rating !== "" && values.rating !== null) {
    const r = Number(values.rating);
    if (Number.isNaN(r) || r < 0 || r > 5) errors.rating = "Rating must be between 0 and 5.";
  }

  if (!values.description.trim()) errors.description = "Description is required.";
  else if (values.description.trim().length < 10)
    errors.description = "Description should be at least 10 characters.";

  if (values.thumbnail && !/^https?:\/\//i.test(values.thumbnail))
    errors.thumbnail = "Thumbnail must be a full URL (https://...).";

  return errors;
}

export default function ProductForm({ initialValues, categories = [], submitLabel = "Save", onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false); // extra guard against double-click races

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Guard: ignore rapid repeated submits (double click / double Enter).
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        rating: values.rating === "" ? 0 : Number(values.rating),
      });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const field = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
  const err = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          className={`${field} ${errors.title ? "border-red-400" : "border-slate-300"}`}
          placeholder="e.g. Wireless Mouse"
        />
        {errors.title && <p className={err}>{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <input
            name="category"
            value={values.category}
            onChange={handleChange}
            list="category-suggestions"
            className={`${field} ${errors.category ? "border-red-400" : "border-slate-300"}`}
            placeholder="e.g. electronics"
          />
          <datalist id="category-suggestions">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.category && <p className={err}>{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            className={`${field} ${errors.price ? "border-red-400" : "border-slate-300"}`}
            placeholder="e.g. 29.99"
          />
          {errors.price && <p className={err}>{errors.price}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
          <input
            name="stock"
            type="number"
            value={values.stock}
            onChange={handleChange}
            className={`${field} ${errors.stock ? "border-red-400" : "border-slate-300"}`}
            placeholder="e.g. 50"
          />
          {errors.stock && <p className={err}>{errors.stock}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Rating (0–5)</label>
          <input
            name="rating"
            type="number"
            step="0.01"
            value={values.rating}
            onChange={handleChange}
            className={`${field} ${errors.rating ? "border-red-400" : "border-slate-300"}`}
            placeholder="e.g. 4.5"
          />
          {errors.rating && <p className={err}>{errors.rating}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Thumbnail URL (optional)</label>
        <input
          name="thumbnail"
          value={values.thumbnail}
          onChange={handleChange}
          className={`${field} ${errors.thumbnail ? "border-red-400" : "border-slate-300"}`}
          placeholder="https://..."
        />
        {errors.thumbnail && <p className={err}>{errors.thumbnail}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          className={`${field} ${errors.description ? "border-red-400" : "border-slate-300"}`}
          placeholder="What is this product? What makes it worth buying?"
        />
        {errors.description && <p className={err}>{errors.description}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
