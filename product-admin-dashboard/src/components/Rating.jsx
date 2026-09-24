export default function Rating({ value = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-slate-700">
      <span aria-hidden className="text-amber-500">★</span>
      {typeof value === "number" ? value.toFixed(2) : value}
    </span>
  );
}
