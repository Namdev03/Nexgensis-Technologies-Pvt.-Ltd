export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-slate-500">
      <div className="spinner" role="status" aria-label="loading" />
      <span>{label}</span>
    </div>
  );
}
