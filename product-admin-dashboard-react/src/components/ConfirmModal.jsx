export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="focus-ring rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`focus-ring rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
