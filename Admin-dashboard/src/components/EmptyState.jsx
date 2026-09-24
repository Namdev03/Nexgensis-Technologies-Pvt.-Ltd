export default function EmptyState({ title = "Nothing here yet", hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <p className="text-base font-medium text-slate-700">{title}</p>
      {hint && <p className="max-w-sm text-sm text-slate-500">{hint}</p>}
    </div>
  );
}
